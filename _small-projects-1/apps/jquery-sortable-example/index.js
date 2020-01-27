'use strict';

var tree = util.generateTree();

var $tree = $('[js-tree]').first();
var $serializeBtn = $('[js-serialize-btn]').first();

$serializeBtn.on('click', function() {
    var data = $sortable.sortable('serialize').get();
    console.log(data);
});

buildTree($tree, tree);

var $sortable = $tree.find('ul').first().addClass('sortable');
$sortable.sortable({distance: 10});


function buildTree($parentNode, tree) {
    var $nodeContainer = $('<ul>', {attr: {'js-node-container': ''}});
    $parentNode.append($nodeContainer);

    tree.forEach(function(item) {
        var $node = $('<li>', {text: item.name, data: {id: item.id, name: item.name}});

        if (item.children != null)
            buildTree($node, item.children);

        $nodeContainer.append($node);
    });
}
