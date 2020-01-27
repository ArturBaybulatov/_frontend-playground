import './index.html';
import './index.less';

import '../components/list';
import '../components/pre';


const items = _(6).times(i => ({ id: i, name: 'Foo-' + i, age: _.random(15, 100) }) ).shuffle().v;

const vm = new Vue({
    el: '#app',

    data: {
        items: items,
        newName: null,
        newAge: null,
    },

    methods: {
        add() {
            this.items.push({ id: -Number(_.uniqueId()), name: this.newName, age: this.newAge });
            this.newName = null;
            this.newAge = null;
        },
    },
});
