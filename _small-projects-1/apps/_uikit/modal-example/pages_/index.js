var vm = new function() {
    var vm = this;

    vm.inputText1 = ko.observable('Lorem');
    vm.inputText2 = ko.observable('Ipsum');
    vm.inputText3 = ko.observable('Dolor');

    vm.openModal = function(text) {
        var $modal = $('<ko:modal>').attr({params: 'text: "' + text + '"'});
        $(document.body).append($modal);
        ko.applyBindings({}, $modal.get(0));
    };
}

ko.applyBindings(vm);
