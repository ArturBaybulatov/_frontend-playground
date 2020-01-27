angular.module('app').controller('MainCtrl', ['$scope', '$compile', function($scope, $compile) {
    var vm = this;


    vm.paginationPage = 32;


    vm.openPopup = function() {
        const $popup = $('<div>').dialog({
            modal: true,
            close: function() { $(this).dialog('destroy') },
            buttons: { OK: function() { $(this).dialog('close') } },
        });

        const $pagination = $('<c-pagination page="vm.paginationPage">');
        $popup.html($pagination);
        $compile($pagination)($scope.$new());
    };
}]);
