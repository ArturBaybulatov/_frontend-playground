import template from './index.html';
import './index.less';

const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


angular.module('app').component('cExample', {
    template: template,
    bindings: { class: '@', text: '@' },

    controller() {
        const ctrl = this;

        ctrl.$onInit = function() {
            ensure.nonEmptyString(ctrl.text);
            ctrl.val = ctrl.text.toUpperCase();
        };
    },
});
