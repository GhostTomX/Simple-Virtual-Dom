var el = require('./element.js');
var tree = el('div', {'id': 'container'}, [
    el('h1', {key: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [Element('li')])
]);
//  var dom = tree.render();
//  document.body.appendChild(dom);