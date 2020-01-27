(function() {

'use strict';

var tree = util.generateTree('id', 'parentId', 'children', 'name');
var $rootNode = $('[js-node][js-node--root]').first();

buildTree($rootNode, tree);
$rootNode.find('[js-node-container] [js-node-container]').hide();

$rootNode.on('click', '[js-caption]', function() {
    var $node = $(this).closest('[js-node]');

    if ($node.is('[js-node--branch]'))
        showNode($node);

    if ($node.is('[js-node--leaf]'))
        window.location.hash = $node.data('id'); // Changes are saved to history
});

var $window = $(window);

$window.on('hashchange', function() {
    var nodeId = fromNumeric(window.location.hash.replace(/^#/, ''));
    var $node = getNodeById(nodeId);
    showNode($node);
});

var initialNodeId = fromNumeric(window.location.hash.replace(/^#/, ''));
var $node = getNodeById(initialNodeId);
showNode($node);


function buildTree($parentNode, tree) {
    var $nodeContainer = $('<ul>', {attr: {'js-node-container': ''}});
    $parentNode.append($nodeContainer);

    tree.forEach(function(item) {
        var $node = $('<li>', {data: {id: item.id}, class: 'node', attr: {'js-node': ''}});
        var $caption = $('<div>', {text: item.name, class: 'caption', attr: {'js-caption': ''}});

        $node.append($caption);

        if (item.children == null) {
            $node.addClass('node--leaf').attr('js-node--leaf', '');
        } else {
            $node.addClass('node--branch').attr('js-node--branch', '');
            buildTree($node, item.children);
        }

        $nodeContainer.append($node);
    });
}

function showNode($node) {
    if ($node == null || $node.length === 0)
        return;

    var $otherNodes = $rootNode.find('[js-node]').not($node);

    if ($node.is('[js-node--leaf]')) {
        $node.addClass('node--selected');
        $otherNodes.removeClass('node--selected');
    }

    var $parentNodes = $node.parent().parents('[js-node]').not($rootNode);
    $otherNodes.not($parentNodes).removeAttr('js-node--active');

    if ($node.is('[js-node--branch][js-node--active]')) {
        $node.removeAttr('js-node--active');

        $rootNode
            .find('[js-node-container]')
            .not($node.parents('[js-node-container]'))
            .slideUp();

        updateStyles();
        return;
    }

    $node.add($parentNodes).attr('js-node--active', '');

    var $childNodeContainer = $node.find('[js-node-container]').first();

    $rootNode
        .find('[js-node-container]')
        .not($node.parents('[js-node-container]').add($childNodeContainer))
        .slideUp();

    $node.parents('[js-node-container]').add($childNodeContainer).slideDown();
    updateStyles();
}

function getNodeById(id) {
    if (id == null)
        return;

    return $rootNode
        .find('[js-node]')
        .filter(function(__, n) {return $(n).data('id') === id}).first();
}

function updateStyles() {
    var $nodes = $rootNode.find('[js-node]');

    $nodes.removeClass('node--active');
    $nodes.filter('[js-node--active]').addClass('node--active');
}

function fromNumeric(val) {
    if (util.isNumeric(val))
        return Number(val);
}

}());
