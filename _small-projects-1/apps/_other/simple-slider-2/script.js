var $bullet = $('.bullet');
var current = 0;

$bullet.first().addClass('current');
    
$bullet.on('click', function() {
    current = $bullet.index($(this));

    $bullet.removeClass('current');
    $bullet.eq(current).addClass('current');
    
    $('.slide-group').animate({ left: '-' + current + '00%' });
});
