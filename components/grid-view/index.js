import template from './index.html';
import './index.less';


const API_ORIGIN = 'https://api.unsplash.com/photos';
const CLIENT_ID = 'ba00d3214d35e01c2cda1290e36431d63c1a906eeb6ab8ccce3136bf8ee3696b';

const { ensure, handleRejection } = util;


angular.module('app').component('cGridView', {
    template: template,
    bindings: { class: '@', page: '<', perPage: '<' },

    controller: ['$element', function($elem) {
        const ctrl = this;


        ctrl.$onInit = function() {
            ctrl.page = ensure.positiveInteger(util.fromNumeric(ctrl.page));
            ctrl.perPage = ensure.positiveInteger(util.fromNumeric(ctrl.perPage));
        };


        const $gridViewImages = ensure.jqElement($elem.find('[js-grid-view-images]'));

        ctrl.$onChanges = function(changes) {
            const page = changes.page.currentValue;

            getImagesAsync(page, ctrl.perPage)
                .then(function(images) {
                    $gridViewImages.html(images.map((x, i) => $('<div>', {
                        class: `grid-view__image-wrap`,

                        html: $('<div>', {
                            class: `grid-view__image`,
                            css: { backgroundImage: `url('${x.urls.thumb}')` },
                            title: (page - 1) * ctrl.perPage + i + 1,
                        }),
                    })));
                })

                .catch(handleRejection("Couldn't display images"));
        };
    }],
});


const getImagesAsync = function(page, perPage) {
    return $.when().then(function() {
        ensure.positiveInteger(page, perPage);

        //return $.get(`${API_ORIGIN}?client_id=${CLIENT_ID}&page=${page}&per_page=${perPage}`)
        //    .catch(util.responseToError)
        //    .then(images => ensure.array(images));


        // Debug -------------------------------------------

        const randomColors = 'fcc cfc ccf cff fcf ffc'.split(' ');

        return _.times(30, function() {
            return { urls: { thumb: `http://via.placeholder.com/100x100/${_.sample(randomColors)}` } };
        });
    });
};
