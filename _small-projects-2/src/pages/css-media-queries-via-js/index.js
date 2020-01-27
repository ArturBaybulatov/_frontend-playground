import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const $block = ensure.jqElement($('[js-block]'));

    adapt($block, { mobile: 'a', tablet: 'b bold big', desktop: 'c striked' });
};


const adapt = function($elem, { mobile, tablet, desktop }) {
    ensure.jqElement($elem);
    ensure.maybe.nonEmptyString(mobile, tablet, desktop);


    const $window = $(window);

    let media, prevMedia;

    $window.on('resize', function() {
        if ($window.width() < 768) {
            media = 'mobile';
            if (media === prevMedia) return;

            $elem.removeClass([mobile, tablet, desktop].join(' '));
            setTimeout(() => $elem.addClass(mobile), 100);
        }

        else if ($window.width() >= 768 && $window.width() < 1200) {
            media = 'tablet';
            if (media === prevMedia) return;

            $elem.removeClass([mobile, tablet, desktop].join(' '));
            setTimeout(() => $elem.addClass(tablet), 100);
        }

        else {
            media = 'desktop';
            if (media === prevMedia) return;

            $elem.removeClass([mobile, tablet, desktop].join(' '));
            setTimeout(() => $elem.addClass(desktop), 100);
        }


        prevMedia = media;
    });


    $window.trigger('resize');
};


init();
