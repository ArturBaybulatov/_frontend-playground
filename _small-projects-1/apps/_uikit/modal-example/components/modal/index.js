require('./style.less');
var template = require('./template.html');


ko.components.register('ko:modal', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            return new function() {
                this.params = params;

                var $modal = $(componentInfo.element).find('[js-modal]').first();
                UIkit.modal($modal).show();
                $modal.on('hide.uk.modal', function($evt) {$(componentInfo.element).remove()});
            };
        }
    },
});
