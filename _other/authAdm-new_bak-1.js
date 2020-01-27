(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var __ = undefined;
    var ensure = util.ensure;


    var init = function() {
        util.blockUi();

        getGroupsAsync()
            .always(util.unblockUi)

            .then(function(groups) {
                var $groupSelect = ensure.jqElement($('[js-group-select]'));
                renderGroupSelect($groupSelect, groups);

                $groupSelect.on('change', function() {
                    var groupName = $(this).val();
                    util.blockUi();

                    $.when(getGroupUsernamesAsync(groupName), getGroupFeaturesAsync(groupName))
                        .always(util.unblockUi)

                        .then(function(usernames, features) {
                            var $userList = ensure.jqElement($('[js-user-list]'));
                            renderUserList($userList, usernames);

                            var $featureTree = ensure.jqElement($('[js-feature-tree]'));
                            var args = convertFeatureListToTree(features);
                            var featureTree = args.tree, featureTreeFields = args.fields;
                            var featureTreeview = renderTree($featureTree, featureTree, featureTreeFields);

                            $featureTree.on('dblclick', function($evt) {
                                if (!$evt.ctrlKey) return;
                                toggleCollapsing($featureTree, featureTreeview);
                            });
                        })

                        .catch(function(err) { toastr.error(err.message, "Couldn't get data") });
                });

                $groupSelect.change();
            })

            .catch(function(err) { toastr.error(err.message, "Couldn't get groups"); console.error(err) });
    };


    var getGroupsAsync = function() {
        return $.get('/authadmin/groups').then(function(json) {
            var wrapper = ensure.plainObject(JSON.parse(json));
            var groups = ensure.array(wrapper.data);
            return _.sortBy(groups, 'groupName');
        });
    };

    var getGroupUsernamesAsync = _.memoize(function(groupName) {
        return $.when().then(function() {
            ensure.nonEmptyString(groupName);

            return $.post('/authadmin/usersGroup', { groupName: groupName })
                .then(function(res) {
                    ensure.plainObject(res);
                    ensure(res.ResultState === 0, res.Value);
                    return ensure.array(JSON.parse(res.Value));
                });
        });
    });

    var getGroupFeaturesAsync = _.memoize(function(groupName) {
        return $.when().then(function() {
            ensure.nonEmptyString(groupName);

            return $.post('/authadmin/featuresGroup', { groupName: groupName })
                .then(function(res) {
                    ensure.plainObject(res);
                    ensure(res.ResultState === 0, res.Value);
                    return ensure.array(JSON.parse(res.Value));
                });
        });
    });


    var convertFeatureListToTree = function(features) {
        ensure.array(features);

        var paths = features
            .map(function(f) { return f.Feature.split('/').filter(function(s) { return util.isNonEmptyString(s) }) })
            .filter(function(path) { return util.isNonEmptyArray(path) });

        //paths = paths.map(function(path) { return toTree_({}, path, 0) });

        paths = paths.map(function(path) { return _.set({}, path) });
        paths = _.merge.apply(__, paths);

        var tree = toTree(paths);

        //var tree = util.generateTree('id', 'parentId', 'children', 'name'); // Debug

        var fields = [
            { name: 'id', type: 'number', title: 'ID' },
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'order', type: 'number' },
            { name: 'checked', type: 'boolean', field: 'awesome' },
            { name: 'items', field: 'children' },
        ];

        return { tree: tree, fields: fields };
    };


    var renderGroupSelect = function($select, groups) {
        ensure.jqElement($select);
        ensure.array(groups);

        $select.html(groups.map(function(g) {
            return $('<option>', { text: g.groupName, attr: { value: g.groupName } });
        }));
    };

    var renderUserList = function($list, usernames) {
        ensure.jqElement($list);
        ensure.array(usernames);

        $list.html(usernames.map(function(n) { return $('<li>', { text: n }) }));
    };

    var renderTree = function($tree, tree, fields) {
        ensure.jqElement($tree);
        ensure.array(tree, fields);

        $tree.empty();

        return $tree.kendoTreeView({
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
        }).data('kendoTreeView');
    };


    var toggleCollapsing = function($tree, treeview) {
        ensure.jqElement($tree);
        ensure.object(treeview);

        if ($tree.data('expanded')) {
            treeview.collapse('.k-item');
            $tree.data('expanded', false);
        } else {
            treeview.expand('.k-item');
            $tree.data('expanded', true);
        }
    };


    var toTree_ = function(obj, path, startIndex) {
        ensure.plainObject(obj);
        ensure.array(path);
        ensure.integer(startIndex);

        obj.name = path[startIndex];

        if (startIndex + 1 === path.length)
            return obj;

        setChildren(obj, path[startIndex + 1]);
        toTree(obj.children[0], path, startIndex + 1);
        return obj;
    };

    var setChildren_ = function(obj, childName) {
        ensure.plainObject(obj);
        ensure.nonEmptyString(childName);

        obj.children = [{ name: childName }];
        return obj;
    };

    var toTree = function(paths) {
        ensure.plainObject(paths);

        return _.map(paths, function(v, k) {
            var obj = { name: k };

            if (_.isPlainObject(v))
                obj.children = toTree(v);

            return obj;
        });
    };


    init();
}());
