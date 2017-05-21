function type (obj){
    return Object.prototype.toString.call(obj)
}

function isArray(list){
    return this.type(list) ==='[object Array]'
}

function each(arr,fn){
    for(var i =0;i<arr.length;i++){
        fn(arr[i],i);
    }
}

function setAttr(node,key,value){
    switch (key){
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            var tagName = node.tagName || ''
            tagName = tagName.toLowerCase();
            if(tagName === 'input' || tagName ==='textarea'){
                node.value = value;
            }
            else{
                node.setAttribute(key,value)
            }
            break;
        default:
            node.setAttribute(key,value);
            break;
           }
}