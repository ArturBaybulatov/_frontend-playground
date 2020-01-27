import template from './index.html';
import './index.less';


const { ensure } = util;


angular.module('app').component('cPagination', {
    template: template,
    bindings: { class: '@', page: '=' },

    controller: function() {
        var ctrl = this;



        //ctrl.$onInit = function() {
        //    ctrl.page = ensure.positiveInteger(util.fromNumeric(ctrl.page));
        //};


        ctrl.getPages = function() {
            var minPage = ctrl.page - 2;
            if (minPage < 1) minPage = 1;

            var maxPage = ctrl.page + 3;
            if (maxPage < 6) maxPage = 6;

            return _.range(minPage, maxPage);
        };
    },
});
