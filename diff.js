function diff(oldTree,newTree){
    var index = 0;
    var patches = {};
    dfsWalk(oldTree,newTree,index,patches)
    return patches;
}

function dfsWalk(oldNode,newNode,index,patches){
    var currentPatch = [];
    if (newNode === null){}
    //text 变化
    else if (isString(oldNode) && isString(newNode)){
        if(newNode !== oldNode){
            currentPatch.push({ type: TEXT,content : newNode}) ;
        }
    }
    
    // prop 变化
    
    else if(oldNode.tagName === newNode.tagName &&
           oldNode.key === newNode.key)
    {
        
        var propsPatches = diffProps(oldNode,newNode);
        if(propsPatches){
            currentPatch.push({type:PROPS,props:propsPatches});
        }
    if(! isIgnoreChildren(newNode)){
       // reorder 
        diffChildren(oldNode.children,newNode.children,index,patches,currentPatch);
         }
    }
    //剩余的都是全新节点
        else{
            currentPatch.push({ type:REPLACE , node : newNode});
        }
    
    if(currentPatch.length){
        patches[index] = currentPatch;
    }
}

function diffChildren(oldChildren,newChildren,index,patches,currentPatch){
    var diffs = listdiff(oldChildren,newChildren,'key')// return moves: 0->delete; 1 -->insert
    newChildren  = diffs.children;
    if (diffs.moves.length){
        currentPatch.push({type : REORDER,moves: diffs.moves})
    }
    var leftnode = null;
    var currentNodeIndex = index;
    each(oldChildren,function(child,i){
        var newChild = newChildren[i];
        currentNodeIndex = (leftnode && leftnode.count)?
            currentNodeIndex + leftnode.count+1: currentNodeIndex+1;
        dfsWalk(child,newChild,currentNodeIndex,patches)
        leftnode = child;
    });
}

function diffProps(oldNode,newNode){
    var count = 0;
    var oldProps = oldNode.props;
    var newProps = newNode.props;
    var key,value;
    var propPatches = {}
    for(key in oldProps){
        if(newProps[key] !==  oldProps[key] ){
            count ++;
            propPatches[key] = newProps[key];
        }
    }
    for(key in newProps){
        if(!oldProps.hasOwnProperty(key)){
            count++;
            propsPatches[key] = newProps[key];
        }
    }
    if (count === 0){
        return null
    }
    console.log(propPatches);
    return propPatches;
}
function isIgnoreChildren(node){
    return (node.props && node.props.hasOwnProperty('ignore'))
}