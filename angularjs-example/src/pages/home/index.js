import './index.html';

import { pages } from '../../variables.js';

import '../../modules/_external/menu';
import '../../modules/_external/pagination';

import '../../modules/common';
import '../../modules/example';


const { ensure } = util;


angular.module('app').controller('MainCtrl', ['$scope', '$compile', function($scope, $compile) {
    var vm = this;


    vm.pages = pages;
    vm.paginationPage = 32;


    vm.openPopup = function() {
        const $popup = $('<div>').dialog({
            modal: true,
            close() { $(this).dialog('destroy') },
            buttons: { OK() { $(this).dialog('close') } },
        });

        //const $example = $('<c-example text="Lorem ipsum">');
        //$popup.html($example);
        //$compile($example)($scope.$new());

        const $pagination = $('<c-pagination page="vm.paginationPage">');
        $popup.html($pagination);
        $compile($pagination)($scope.$new());
    };
}]);
