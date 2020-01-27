(function () {
    var $ul = $('ul');
    var $lis = $ul.find('li');
    var minIndex = 0;
    var maxIndex = $lis.length - 1;

    $('.prev').on('click', function ($evt) {
        var $currentLi = $lis.filter('.active');
        $currentLi.removeClass('active');
        var currentIndex = $currentLi.index();

        if (currentIndex === minIndex)
            var prevIndex = maxIndex;
        else
            var prevIndex = $lis.eq(currentIndex - 1).index();

        var $prevLi = $lis.eq(prevIndex);
        $prevLi.addClass('active');
    });

    $('.next').on('click', function ($evt) {
        var $currentLi = $lis.filter('.active');
        $currentLi.removeClass('active');
        var currentIndex = $currentLi.index();

        if (currentIndex === maxIndex)
            var nextIndex = 0;
        else
            var nextIndex = $lis.eq(currentIndex + 1).index();

        var $nextLi = $lis.eq(nextIndex);
        $nextLi.addClass('active');
    });
}());
