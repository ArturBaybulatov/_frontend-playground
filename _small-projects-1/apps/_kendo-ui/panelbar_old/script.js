'use strict';


var $menu = $('[js-menu]').first();
var menuItems = generateMenuItems();

var menu = $menu.kendoPanelBar({
    expandMode: 'single',
    dataSource: menuItems,
}).data('kendoPanelBar');

var $currentMenuItem = $(_.sample($menu.find('.k-item > .k-link'))).closest('.k-item'); // Tmp
menu.expand($currentMenuItem.parents('.k-item'));
menu.select($currentMenuItem);


function generateMenuItems() {
    return _.times(10, function() {
        var randomIdent = 'level1-' + util.randomIdent()

        return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 9), function() {
            var randomIdent = 'level2-' + util.randomIdent()

            return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 8), function() {
                var randomIdent = 'level3-' + util.randomIdent()

                return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 7), function() {
                    var randomIdent = 'level4-' + util.randomIdent()

                    return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 6), function() {
                        var randomIdent = 'level5-' + util.randomIdent()

                        return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 5), function() {
                            var randomIdent = 'level6-' + util.randomIdent()

                            return {text: randomIdent, url: '/' + randomIdent + '/', items: _.sample([null, _.times(_.random(1, 4), function() {
                                var randomIdent = 'level7-' + util.randomIdent()

                                return {text: randomIdent, url: '/' + randomIdent + '/', items: null}
                            })])}
                        })])}
                    })])}
                })])}
            })])}
        })])}
    })
}
