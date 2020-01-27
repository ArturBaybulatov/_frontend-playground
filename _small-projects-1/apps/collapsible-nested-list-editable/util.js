(function() {
    'use strict';


    var util = window.util = {}; // Export to global scope


    function flat2tree(arr) {
        var groups = _.groupBy(arr, function(item) {return item.parentId == null ? '_root' : item.parentId});
        var refs = _.keyBy(arr, 'id');

        _.forEach(groups, function(children, groupId) {
            if (groupId !== '_root')
                _.set(refs, [groupId, 'children'], children);
        });

        return groups['_root'];
    }

    util.flat2tree = flat2tree;


    function generateTree() {
        var MAX_ITEMS = 101;

        var randoms = _.times(50, function() {return _.random(MAX_ITEMS)});

        var arr = _.times(MAX_ITEMS, function(i) {
            var r = _.sample(randoms);
            var weightedRandom = _.sample(_(5).times(_.constant(r)).push(null).v);
            return {id: i, parentId: weightedRandom, name: lorem()};
        });

        return flat2tree(JSON.parse(JsonStringifySafe.stringify(arr, null, null, function() {})));
    }

    util.generateTree = generateTree;


    function isNumeric(val) {
        if (typeof val === 'number' && !Number.isNaN(val))
            return true;

        if (val == null)
            return false;

        if (typeof val !== 'string')
            return false;

        val = val.trim();

        if (val === '')
            return false;

        return !Number.isNaN(Number(val));
    }

    util.isNumeric = isNumeric;


    function fromNumeric(str) {
        if (isNumeric(str))
            return Number(str);
        else
            return null;
    }

    util.fromNumeric = fromNumeric;


    function lorem(sentenceCount, wordCount) {
        if (sentenceCount == null)
            sentenceCount = _.random(1, 3);

        if (wordCount == null)
            wordCount = _.random(5, 20);

        var vocab = [
            'a ac adipiscing amet ante arcu at auctor augue bibendum commodo condimentum consectetur consequat convallis curabitur',
            'cursus diam dictum dignissim dolor donec duis efficitur eget eleifend elit enim erat et eu ex facilisis faucibus feugiat',
            'finibus gravida iaculis id imperdiet in integer ipsum lacinia lacus laoreet lectus leo libero ligula lobortis lorem',
            'luctus maecenas mauris metus mi mollis morbi nam nec neque nisi non nulla nullam nunc odio orci ornare pellentesque',
            'pharetra phasellus porta porttitor posuere pretium proin pulvinar purus quam quis rhoncus rutrum sapien sed sem semper',
            'sit sollicitudin tempor tempus tincidunt tortor turpis ullamcorper ultricies ut varius vehicula vel velit vestibulum',
            'vitae viverra volutpat vulputate',
        ].join(' ').split(' ');

        return _(sentenceCount).times(function() {
            return _(vocab).sampleSize(wordCount).join(' ').capitalize().v;
        }).join('. ').v;
    }

    util.lorem = lorem;
}());
