require('./style.less');
var template = require('./template.html');


ko.components.register('ko:slider', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            return new function() {
                this.params = params;
            };
        }
    },
});
