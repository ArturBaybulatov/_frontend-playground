(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var __ = undefined;
    var ensure = util.ensure;


    var init = function() {
        var $tree = ensure.jqElement($('[js-tree]'));

        var args = getTreeviewData();
        var tree = args.tree, fields = args.fields;

        var treeview = renderTree($tree, tree, fields, {
            dataBound: function() {
                var initialTreeItemId = util.fromNumeric(location.hash.replace(/^#/, ''));

                if (!util.isNumeric(initialTreeItemId))
                    return;

                selectTreeItemById(initialTreeItemId, this);
            },

            dragend: function(evt) {
                var item = this.dataItem(evt.sourceNode);
                var items = item.parent();

                updateOrderFields(items);
                var parent = items.parent();

                var payload = items.map(function(item) {
                    return { order: item.order, id: item.id, parentId: parent == null ? 0 : parent.id };
                });

                log(utilInspect(payload));
            },
        });

        //toggleCollapsing($tree, treeview, true);

        $tree.on('dblclick', function($evt) { if (!$evt.ctrlKey) return; toggleCollapsing($tree, treeview) });

        var $createItemBtn = ensure.jqElement($('[js-create-item-btn]'));
        $createItemBtn.on('click', createNewItem.bind(__, treeview));

        var $deleteItemBtn = ensure.jqElement($('[js-delete-item-btn]'));
        var $itemEditField = ensure.jqElement($('[js-edit-item-field]'));

        $deleteItemBtn.on('click', deleteCurrentItem.bind(__, treeview, $itemEditField));
        $itemEditField.on('keyup', syncCurrentItemWithItemEditField.bind(__, $itemEditField, treeview));
        treeview.bind('change', syncItemEditFieldWithCurrentItem.bind(__, treeview, $itemEditField));
        treeview.bind('change', syncLocationWithCurrentItem.bind(__, treeview));
    };


    var getTreeviewData = function() {
        var tree = util.generateTree('id', 'parentId', 'children', 'name');
        tree = util.sortTree(tree, 'order', 'children');

        var fields = [
            { name: 'id', type: 'number', title: 'ID' },
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'order', type: 'number' },
            { name: 'checked', type: 'boolean', field: 'awesome' },
            { name: 'items', field: 'children' },
        ];

        return { tree: tree, fields: fields };
    };


    var updateOrderFields = function(items) {
        ensure.object(items);
        items.forEach(function(item, i) { item.set('order', i) });
    };

    var selectTreeItemById = function(id, treeview) {
        ensure.numeric(id);
        ensure.object(treeview);

        var item = treeview.dataSource.get(id);

        if (!_.isObject(item))
            return;

        treeview.select(treeview.findByUid(item.uid));
        treeview.expandTo(item);
    };


    var renderTree = function($tree, tree, fields, extraOptions) {
        ensure.jqElement($tree);
        ensure.array(tree, fields);
        ensure.maybe.plainObject(extraOptions);

        return $tree.kendoTreeView(Object.assign({
            loadOnDemand: false,
            //template: "#: utilInspect(_.pick(item, ['order','id','name'])) #", // Debug
            dataTextField: 'name',

            dataSource: new kendo.data.HierarchicalDataSource({
                data: tree,

                schema: {
                    model: {
                        id: 'id',
                        fields: _(fields).keyBy('name').mapValues(function(o) { return _.pick(o, ['type', 'field', 'editable']) }).v,
                        children: 'items',
                    },
                },
            }),

            checkboxes: { checkChildren: true },
            dragAndDrop: true,
        }, extraOptions)).data('kendoTreeView');
    };


    var toggleCollapsing = function($tree, treeview, shouldExpand) {
        ensure.jqElement($tree);
        ensure.object(treeview);
        ensure.maybe.boolean(shouldExpand);

        if (typeof shouldExpand !== 'boolean')
            shouldExpand = !$tree.data('expanded');

        if (shouldExpand) {
            treeview.expand('.k-item');
            $tree.data('expanded', true);
        } else {
            treeview.collapse('.k-item');
            $tree.data('expanded', false);
        }
    };


    var createNewItem = function(treeview) {
        ensure.object(treeview);

        var item = treeview.dataItem(treeview.select());
        var items = item == null ? treeview.dataSource.data() : item.parent();

        var newItemData = { id: -Number(_.uniqueId()), name: '(New item)' };

        items.push(newItemData);
        var newItem = treeview.dataSource.get(newItemData.id);
        updateOrderFields(items);
        treeview.select(treeview.findByUid(newItem.uid));
    };

    var deleteCurrentItem = function(treeview, $itemEditField) {
        ensure.object(treeview);
        ensure.jqElement($itemEditField);

        var item = treeview.dataItem(treeview.select());

        if (!_.isObject(item)) {
            toastr.error('Please select an item');
            return;
        }

        treeview.dataSource.remove(item);
        $itemEditField.val('');
    };


    var syncCurrentItemWithItemEditField = function($itemEditField, treeview) {
        ensure.jqElement($itemEditField);
        ensure.object(treeview);

        var item = treeview.dataItem(treeview.select());

        if (!_.isObject(item)) {
            $itemEditField.val('');
            return;
        }

        item.set('name', $itemEditField.val());
    };

    var syncItemEditFieldWithCurrentItem = function(treeview, $itemEditField) {
        ensure.object(treeview);
        ensure.jqElement($itemEditField);

        var item = ensure.object(treeview.dataItem(treeview.select()));
        $itemEditField.val(item.name);
    };

    var syncLocationWithCurrentItem = function(treeview) {
        ensure.object(treeview);

        var item = ensure.object(treeview.dataItem(treeview.select()));
        location.hash = item.id; // Changes are saved to history
    };


    init();
}());
