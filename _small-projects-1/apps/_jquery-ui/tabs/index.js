(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;


    var init = function() {
        var $tabWidget = ensure.jqElement($('[js-tab-widget]'));
        jqUtil.initTabWidget($tabWidget);


        var $addTabs = ensure.jqElement($('[js-add-tabs-btn]'));

        $addTabs.on('click', function() {
            var shouldActivateFirst = !util.isNonEmptyJqCollection($tabWidget.find('[js-tab-btn]'));

            _.times(5, function(i) {
                setTimeout(function() {
                    var title = util.lorem(1, _.random(1, 3));
                    var $tabView = jqUtil.createTab($tabWidget, title, i === 0 && shouldActivateFirst);
                    $tabView.text(util.lorem());
                    //$tabView.html(_.times(_.random(1, 100), function() { return '<p>' + util.lorem() + '</p>' }).join(''));
                }, i * 300);
            });
        });


        var $activateTabBtn = ensure.jqElement($('[js-activate-tab-btn]'));

        $activateTabBtn.on('click', function() {
            var $tabBtns = $tabWidget.find('[js-tab-btn]');

            if (!util.isNonEmptyJqCollection($tabBtns)) {
                toastr.error('There are no tabs');
                return;
            }

            var $tabIndexToActivateInput = ensure.jqElement($('[js-tab-index-to-activate-input]'));
            var index = util.fromNumeric($tabIndexToActivateInput.val());

            if (!(util.isNonNegativeInteger(index) && index < $tabBtns.length)) {
                toastr.error('Please, input a valid number');
                return;
            }

            $tabWidget.tabs('option', 'active', index);
        });


        var $removeTabBtn = ensure.jqElement($('[js-remove-tab-btn]'));

        $removeTabBtn.on('click', function() {
            var $tabBtns = $tabWidget.find('[js-tab-btn]');

            if (!util.isNonEmptyJqCollection($tabBtns)) {
                toastr.error('There are no tabs');
                return;
            }

            var $tabBtn = jqUtil.getActiveTabBtn($tabWidget);
            jqUtil.removeTab($tabWidget, $tabBtn);
        });


        $addTabs.trigger('click');
    };


    init();
}());
