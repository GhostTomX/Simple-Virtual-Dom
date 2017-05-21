
function Element(tagName,props,children){
    if (isArray(props)){
        children = props;
        props = {}
    }
    this.tagName = tagName;
    this.props = props || {}; // undefined change to {}
    this.children = children || [];
    this.key = (props) ? props.key : void 0;//key与其他的不同，是一个特殊的关键字（排序等）

    var count = 0;
    each(this.children,function(child,i){
        if (child instanceof Element){
            count += child.count;
        }
        else{
            children[i] = ''+child;//与tistring的区别是undefined也能转换成字符串
        }
        count++;
    })
    this.count = count;
    
}

Element.prototype.render = function(){
    var el = document.createElement(this.tagName);
    console.log(el);
    var props = this.props;
    for (var propName in props){
        var propValue = props[propName]
        setAttr(el,propName,propValue);
    }
    each(this.children,function(child){
        var childEl = (child instanceof Element)?child.render() : document.createTextNode(child);
        el.appendChild(childEl);
    })
    return el;
}

//module.exports = function (tagName,props,children){
//    return new Element(tagName,props,children);
//}
