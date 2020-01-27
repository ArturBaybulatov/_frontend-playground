import template from './index.html';
import './index.less';


angular.module('app').component('cMenu', {
    template: template,
    bindings: { class: '@', pages: '<' },

    //controller() {
    //    const ctrl = this;
    //
    //    ctrl.$onInit = function() {
    //        ctrl.items.some(function(item) {
    //            return (item.active = util.samePath(window.location.href, item.path));
    //        });
    //    };
    //},
});
