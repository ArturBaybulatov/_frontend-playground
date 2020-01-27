require('./style.less');
var template = require('./template.html');


ko.components.register('ko:pagination', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            var $component = $(componentInfo.element);

            return new function() {
                var vm = this;

                vm.params = params;

                vm.pages = ko.computed(function() {
                    var minPage = params.currentPage() - 2;

                    if (minPage < 1)
                        minPage = 1;

                    var maxPage = params.currentPage() + 3;

                    if (maxPage < 6)
                        maxPage = 6;

                    return _.range(minPage, maxPage);
                });
            };
        }
    },
});
