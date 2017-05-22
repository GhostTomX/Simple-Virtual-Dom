var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function patch(node, patches) {
    var walker = {
        index;0
    }
    dfsWalkPatch(node, walker, patches);
}

dfsWalkPatch(node, walker, patches) {
    var currentPatches = patches[walker.index];
    var len = node.childNodes ? node.childNodes.length : 0
    for (var i = 0; i < len; i++) {
        var child = node.childNodes[i]
        walker.index++;
        dfsWalkPatch(child, walker, patches);
    }

    if (currentPatches) {
        applyPatches(node, currentPatches);
    }
}

function applyPatches(node, currentPatches) {
    each(current，
        function (currentPatch) {
            switch (currentPatch.type) {
                case REPLACE:
                    var newNode = (typeof currentPatch.node === 'String') ?
                        document.createTextNode(currentPatch.node);
                    node.parentNode.replaceChild(newNode, node);
                    break;
                case REORDER:
                    reorderChildren(node, currentPatch.moves);
                    break;
                case PROPS:
                    setProps(node, currentPatch.props);
                    break;
                case TEXT:
                    if (node.textContent) {
                        node.textContent = currentPatch.content;
                    } else {
                        node.nodeValue = currentPatch.content;
                    }
                    break;
                default:
                    throw new Error('Unknown patch type' + currentPatch.type);
            }
        })
}

function setProps(node, props) {
    for (var key in props) {
        if (props[key] === void 0) {
            node.removeAttribute(key);
        } else {
            var value = props[key]
            setAttr(node, key, value);
        }
    }
}

function reorderChildren(node, moves) {
    var staticNodeList = toArray(node.childNodes);
    var map = {}
    each(staticNodeList, function (node) {
        if (node.nodeType === 1) {
            var key = node.getAttribute('key');
            if (key) {
                maps[key] = node;
            }
        }
    })
    each(moves, function (move) {
        var index = move.index;
        if (move.type === 0) { //remove
            if (staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index]);
            }
            staticNodeList.splice(index, 1)
        } else if (move.type === 1) { //insert
            var insertNode = maps[move.item.key] ?
                maps[move.item.key] // reuse old item
                :
                (typeof move.item === 'object') ?
                move.item.render() :
                document.createTextNode(move.item)
            staticNodeList.splice(index, 0, insertNode)
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
    })
}