require('./style.less');
var template = require('./template.html');


ko.components.register('ko:entry', {
    template: template,
    viewModel: function(params) {this.params = params},
});
