(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;

    $.get('data.xml')
        .then(function(document) {
            var $offersWrap = ensure.jqElement($(document).find('offers'));
            var $offers = ensure.nonEmptyJqCollection($offersWrap.find('offer'));

            log(_($offers)
                //.sampleSize(5)
                //.forEach(log)

                .map(function(offer) {
                    try {
                        var $param = ensure.jqElement($(offer).find('param[name="Стиль"]'));
                        return ensure.nonEmptyString($param.text());
                    } catch (err) {
                        return null;
                    }
                })

                .uniq()
                .filter(function(x) { return x != null }).v
            );
        })

        .catch(console.error);
}());
