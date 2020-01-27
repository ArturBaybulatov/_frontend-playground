require('./style.less');
var template = require('./template.html');


Vue.component('vue-list', {
    template: template,
    props: ['items'],

    mounted: function() {
        var that = this;
        var $list = $(that.$el);

        $list.sortable({
            start: function(__, ui) {ui.item.data('oldIndex', ui.item.index())},

            update: function(__, ui) {
                var oldIndex = ui.item.data('oldIndex');
                that.items.splice(ui.item.index(), 0, that.items.splice(oldIndex, 1)[0]);
            },
        });
    },

    methods: {
        remove: function(i) {this.items.splice(i, 1)},
    },
});
