(function() {
    var image = 'images/dino.svg';

    //var $dino = $('<img>').attr('src', image);
    var $dino = $('<object type="image/svg+xml"></object>').attr('data', image);

    $dino.on('load', function() {
        var $contents = $(this).contents().find('g').first();

        $contents.on('click', function() {
            console.log('Clicked');
        });
    });

    $('body').append($dino);
    $dino.draggable(); // Not working with an object element
}());
