(function() {
    'use strict';

    var util = window.util = {};


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


    function fromNumeric(val, defaultVal) {
        fromNumeric._version = '0.1';

        if (arguments.length <= 1)
            defaultVal = null;

        return isNumeric(val) ? Number(val) : defaultVal;
    }

    util.fromNumeric = fromNumeric;


    function sample(arr) {
        sample._version = '1.0';

        return arr[random(0, arr.length - 1)];
    }

    util.sample = sample;


    function randomNumber() {
        randomNumber._version = '1.0';

        return sample([random(1, 9), random(10, 99), random(100, 999)]);
    }

    util.randomNumber = randomNumber;


    function times(num, callback) {
        times._version = '1.0';

        var arr = [];

        for (var i = 0; i < num; i++)
            arr.push(callback(i))

        return arr;
    }

    util.times = times;


    function tryParseJsonOrNull(str) {
        tryParseJsonOrNull._version = '0.1';

        try {
            return JSON.parse(str);
        } catch (err) {
            return null;
        }
    }

    util.tryParseJsonOrNull = tryParseJsonOrNull;
}());
