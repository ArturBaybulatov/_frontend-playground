require('./style.less');
var template = require('./template.html');

angular.module('app').component('cVideo', {
    template: template,

    bindings: {
        class: '@',
        videoId: '@',
    },
});
