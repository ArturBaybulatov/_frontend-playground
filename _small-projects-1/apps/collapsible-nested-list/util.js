(function() {
    'use strict';


    var util = window.util = {}; // Export to global scope


    function random(min, max) {
        random._version = '1.2';

        if (min == null && max == null) {
            min = 0;
            max = 1;
        } else if (max == null) {
            if (!isNumber(min))
                throw new Error('Number expected');

            max = 0;
        } else if (min == null) {
            if (!isNumber(max))
                throw new Error('Number expected');

            min = 0;
        }

        if (min > max) {
            var _min = min;
            min = max;
            max = _min;
        }

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    util.random = random;


    function sample(arr) {
        sample._version = '1.0';

        return arr[random(0, arr.length - 1)];
    }

    util.sample = sample;


    function times(num, callback) {
        times._version = '1.0';

        var arr = [];

        for (var i = 0; i < num; i++)
            arr.push(callback(i))

        return arr;
    }

    util.times = times;


    function isNumber(val) {
        isNumber._version = '1.0';

        return typeof val === 'number' && !Number.isNaN(val) && Math.abs(val) !== Infinity;
    }

    util.isNumber = isNumber;


    function isNumeric(val) {
        isNumeric._version = '1.1';

        if (isNumber(val))
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


    function flat2tree(arr, idKey, parentIdKey, childrenKey) {
        flat2tree._version = '1.0';

        var groups = _.groupBy(arr, function(item) {return item[parentIdKey] == null ? '__root' : item[parentIdKey]});
        arr.forEach(function(item) {delete item[parentIdKey]}); // No need
        var refs = _.keyBy(arr, idKey);

        _.forEach(groups, function(children, groupId) {
            if (groupId !== '__root')
                _.set(refs, [groupId, childrenKey], children);
        });

        return groups['__root'];
    }

    util.flat2tree = flat2tree;


    function generateTree(idKey, parentIdKey, childrenKey, nameKey) {
        generateTree._version = '1.0-custom';

        idKey == null && (idKey = 'id');
        parentIdKey == null && (parentIdKey = 'parentId');
        childrenKey == null && (childrenKey = 'children');
        nameKey == null && (nameKey = 'name');

        var MAX_ITEMS = 101;

        var randoms = times(31, function() {return random(MAX_ITEMS)});

        var arr = _.shuffle(times(MAX_ITEMS, function(i) {
            var r = sample(randoms);
            var weightedRandom = sample(_(5).times(_.constant(r)).push(null).v);

            var obj = {};

            obj[idKey] = i;
            obj[parentIdKey] = weightedRandom;
            obj[nameKey] = lorem(1, random(3, 15));

            return obj;
        }));

        // Remove circular dependencies:
        arr = JSON.parse(JsonStringifySafe.stringify(arr, null, null, function() {}));

        return flat2tree(arr, idKey, parentIdKey, childrenKey);
    }

    util.generateTree = generateTree;


    function lorem(sentenceCount, wordCount) {
        lorem._version = '1.0';

        if (sentenceCount == null)
            sentenceCount = random(1, 5);

        if (wordCount == null)
            wordCount = random(5, 30);

        var vocab = [
            'a ac adipiscing amet ante arcu at auctor augue bibendum commodo condimentum consectetur consequat convallis curabitur',
            'cursus diam dictum dignissim dolor donec duis efficitur eget eleifend elit enim erat et eu ex facilisis faucibus feugiat',
            'finibus gravida iaculis id imperdiet in integer ipsum lacinia lacus laoreet lectus leo libero ligula lobortis lorem',
            'luctus maecenas mauris metus mi mollis morbi nam nec neque nisi non nulla nullam nunc odio orci ornare pellentesque',
            'pharetra phasellus porta porttitor posuere pretium proin pulvinar purus quam quis rhoncus rutrum sapien sed sem semper',
            'sit sollicitudin tempor tempus tincidunt tortor turpis ullamcorper ultricies ut varius vehicula vel velit vestibulum',
            'vitae viverra volutpat vulputate',
        ].join(' ').split(' ');

        return times(sentenceCount, function() {
            return _(vocab).sampleSize(wordCount).join(' ').capitalize().v;
        }).join('. ');
    }

    util.lorem = lorem;
}());
