require('./style.less');
var template = require('./template.html');


ko.components.register('ko:gallery', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            var $component = $(componentInfo.element);

            return new function() {
                var vm = this;

                vm.params = params;

                var apiUrl = 'https://api.unsplash.com/photos';
                var clientId = 'ba00d3214d35e01c2cda1290e36431d63c1a906eeb6ab8ccce3136bf8ee3696b';
                var page = params.page();
                var perPage = params.perPage;
                var $galleryImages = $component.find('[js-gallery-images]').first();

                vm.params.page.subscribe(function(page) {
                    $.get(apiUrl + '?client_id=' + clientId + '&page=' + page + '&per_page=' + perPage)
                        .then(function(images) {
                            var $images = $(images).map(function(i, image) {
                                return $('<img>').attr('src', image.urls.thumb).get(0);
                            });

                            $galleryImages.html($images);
                        });
                });

                vm.params.page.valueHasMutated();
            };
        }
    },
});
