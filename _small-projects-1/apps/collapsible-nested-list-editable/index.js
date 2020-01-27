'use strict';

var tree = util.generateTree();

var $document = $(document);
var $rootNode = $('[js-node][js-node--root]').first();
var urlNodeId = util.fromNumeric(window.location.hash.replace(/^#/, ''));
var $serializeBtn = $('[js-serialize-btn]').first();

$rootNode.on('click', '[js-caption]', function() {
    var $node = $(this).closest('[js-node]');
    showNode($node);
});

$serializeBtn.on('click', function() {console.log(serialize($rootNode))});

buildTree($rootNode, tree);
$rootNode.find('[js-node-container] [js-node-container]').hide();
showNodeForId(urlNodeId);

$rootNode
    .find('[js-node-container]').first()
    .addClass('sortable')
    .sortable({distance: 10, handle: '[js-drag-handle]'});


function buildTree($parentNode, tree) {
    var $nodeContainer = $('<ul>', {attr: {'js-node-container': ''}});
    $parentNode.append($nodeContainer);

    tree.forEach(function(item) {
        var $node = $('<li>', {data: {id: item.id}, class: 'node', attr: {'js-node': ''}});
        var $caption = $('<div>', {text: item.name, class: 'caption', attr: {'js-caption': '', contenteditable: 'true'}});
        var $dragHandle = $('<span>', {class: 'drag-handle', attr: {'js-drag-handle': ''}});

        $caption.prepend($dragHandle);
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
    if ($node.length === 0)
        return;

    var $otherNodes = $rootNode.find('[js-node]').not($node);

    if ($node.is('[js-node--leaf]')) {
        $node.addClass('node--selected');
        $otherNodes.removeClass('node--selected');
        window.location.hash = $node.data('id'); // Changes are saved to history
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

function showNodeForId(id) {
    var $node = $rootNode
        .find('[js-node]')
        .filter(function(__, n) {return $(n).data('id') === id}).first();

    showNode($node);
}

function updateStyles() {
    var $nodes = $rootNode.find('[js-node]');

    $nodes.removeClass('node--active');
    $nodes.filter('[js-node--active]').addClass('node--active');
}

function serialize($node) {
    return $node.children().children('[js-node]').map(function(__, node) {
        var $node = $(node);

        var item = {
            id: $node.data('id'),
            name: $node.find('[js-caption]').first().text(),
        };

        if ($node.is('[js-node--branch]'))
            item.children = serialize($node);

        return item;
    }).get();
}
