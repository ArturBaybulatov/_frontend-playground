require('./style.less');
var template = require('./template.html');


ko.components.register('ko:video', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            var $component = $(componentInfo.element);

            return new function() {
                var vm = this;
                vm.params = params;
            };
        }
    },
});
