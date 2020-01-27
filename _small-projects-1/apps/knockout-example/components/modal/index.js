require('./style.less');
var template = require('./template.html');


ko.components.register('ko:modal', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            var $component = $(componentInfo.element);

            return new function() {
                var vm = this;

                vm.params = params;

                var $modal = $component.find('[js-modal]').first();
                UIkit.modal($modal).show();
                $modal.on('hide.uk.modal', function() {$component.remove()});
            };
        }
    },
});
