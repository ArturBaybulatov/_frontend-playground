(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;


    var init = function() {
        var $panelBar = ensure.jqElement($('[js-panel-bar]'));

        var kPanelBar = $panelBar.kendoPanelBar({
            expandMode: 'single',
            dataSource: util.generateTree(5, 'text', 'items'),

            //select: function(evt) {
            //    var item = this.dataItem(evt.item);
            //    log(item.text);
            //},
        }).data('kendoPanelBar');


        var $content = ensure.jqElement($('[js-content]'));
        $content.html(_.times(_.random(1, 100), function() { return '<p>' + util.lorem() + '</p>' }).join(''));
    };


    init();
}());
