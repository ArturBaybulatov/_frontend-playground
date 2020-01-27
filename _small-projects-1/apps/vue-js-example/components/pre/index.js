require('./style.less');
var template = require('./template.html');


Vue.component('vue-pre', {
    template: template,
    props: ['data'],
});
