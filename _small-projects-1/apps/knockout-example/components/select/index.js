require('./style.less');


var executePlugins = _.once(function() {
    var $selects = $('[js-select]');

    $selects.selectize({
        allowEmptyOption: true,

        render: {
            // TODO: Sanitize HTML contained in `obj.text`:

            item: function(obj, escape) {return '<div class="select__input">' + obj.text + '</div>'},
            option: function(obj, escape) {return '<div class="select__option">' + obj.text + '</div>'},
        },
    });

    $('.selectize-control.single .selectize-input input').prop('disabled', true); // Don't trigger keyboard on mobiles
});

$(document).on('ko-ready', executePlugins);
