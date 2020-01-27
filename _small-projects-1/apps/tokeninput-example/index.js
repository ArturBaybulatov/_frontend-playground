(function() {
    var data = [
        { id: 1, title: 'Foo' },
        { id: 2, title: 'Bar' },
        { id: 3, title: 'Baz' },
        { id: 4, title: 'Qux' },
        { id: 5, title: 'Quux' },
        { id: 6, title: 'Corge' },
        { id: 7, title: 'Grault' },
        { id: 8, title: 'Garply' },
    ];

    var $select = $('[js-select]').first();

    $select.tokenInput(data, { // Requires an "<input>"
        propertyToSearch: 'title',
        preventDuplicates: true,
        theme: 'facebook',
    });

    //$select.tokenInput(url, {
    //    //...
    //
    //    crossDomain: false,
    //    jsonContainer: 'results',
    //    queryParam: 'name__icontains',
    //    resultsLimit: 10, // No effect
    //});

    var $getDataBtn = $('[js-get-data-btn]').first();

    $getDataBtn.on('click', function() {
        console.log($select.tokenInput('get'));
    });
}());
