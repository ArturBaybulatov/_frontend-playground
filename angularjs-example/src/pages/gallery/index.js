import './index.html';

import { pages } from '../../variables.js';

import '../../modules/_external/grid-view';
import '../../modules/_external/menu';
import '../../modules/_external/pagination';

import '../../modules/common';


angular.module('app').controller('MainCtrl', function() {
    var vm = this;
    vm.pages = pages;

    vm.galleryPage = 1;
});
