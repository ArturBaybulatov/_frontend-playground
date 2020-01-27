import template from './index.html';
import './index.less';


ko.components.register('ko:media', {
    template: template,
    viewModel: function(params) { this.params = params },
});
