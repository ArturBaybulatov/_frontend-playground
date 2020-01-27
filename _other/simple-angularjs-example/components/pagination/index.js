angular.module('app').component('cPagination', {
    templateUrl: 'components/pagination/index.html',
    bindings: { class: '@', page: '=' },

    controller: function() {
        var ctrl = this;


        ctrl.getPages = function() {
            var minPage = ctrl.page - 2;
            if (minPage < 1) minPage = 1;

            var maxPage = ctrl.page + 3;
            if (maxPage < 6) maxPage = 6;

            return _.range(minPage, maxPage);
        };
    },
});
