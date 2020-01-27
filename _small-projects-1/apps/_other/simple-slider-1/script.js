(function () {
    var $slides = $('.slider__slide');
    var $navs = $('.slider__slide-nav');
    
    $navs.on('click', function ($evt) {
        var $prevNav = $navs.filter('.slider__slide-nav--active');
        var $nextNav = $(this);
    
        $prevNav.removeClass('slider__slide-nav--active');
        $nextNav.addClass('slider__slide-nav--active');
    
    
        var $prevSlide = $slides.filter('.slider__slide--active');
        var $nextSlide = $slides.eq($nextNav.index());
        
        var reversed = $nextNav.index() > $prevNav.index();
        
        $$.timeout(function () {
            $slides.removeClass('u-animate');
            $nextSlide.removeClass('slider__slide--hidden-left slider__slide--hidden-right');
            $nextSlide.addClass(reversed ? 'slider__slide--hidden-right' : 'slider__slide--hidden-left');
        }, 0)()
            .then($$.timeout(function () {
                $slides.addClass('u-animate');
                $prevSlide.removeClass('slider__slide--active');
                $prevSlide.removeClass('slider__slide--hidden-left slider__slide--hidden-right');
                $prevSlide.addClass(reversed ? 'slider__slide--hidden-left' : 'slider__slide--hidden-right');
                $nextSlide.addClass('slider__slide--active');
            }, 100));
    });
}());
