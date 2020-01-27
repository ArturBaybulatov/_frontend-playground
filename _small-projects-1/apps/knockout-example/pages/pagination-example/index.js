require('../../components/l-content');
require('../../components/gallery');
require('../../components/pagination');


var vm = new function() {
    var vm = this;

    vm.currentPage = ko.observable(1);
};

ko.applyBindings(vm);
