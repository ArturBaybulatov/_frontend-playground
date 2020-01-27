(function() {
    'use strict';

    var $listbox = $('[js-listbox]').first();

    var data = [
        {id: 3, text: 'Foo'},
        {id: 5, text: 'Bar'},
        {id: 8, text: 'Baz'},
    ];

    $listbox.jqxListBox({
        source: data,
        displayMember: 'text',
        valueMember: 'id',
    });

    $listbox.on('dblclick', function() {
        var item = $listbox.jqxListBox('getSelectedItem');

        window.setTimeout(function() {
            window.alert(JSON.stringify({id: item.value, text: item.label}, null, 4));
        }, 100);
    });
}());
