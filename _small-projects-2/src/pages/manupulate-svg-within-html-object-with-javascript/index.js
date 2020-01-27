import './index.html';
import './index.less';

const { ensure } = util;


const $content = ensure.jqElement($('[js-content]'));
const itemTpl = ensure.jqElement($('[js-item-tpl]')).html();

$content.append('a,b,b_optimized,c,d,e,f,g,h,i,j'.split(',').map(function(imgBasename) {
    const $item = ensure.jqElement($(itemTpl));


    const $obj = ensure.jqElement($item.find('[js-obj]'));

    $obj.off('load.fjy3Lhx5').on('load.fjy3Lhx5', function() {
        const $doc = ensure.jqElement($(this.contentDocument));
        const color = _('red green blue orange aqua fuchsia limegreen').split(' ').sample().v;
        const $style = $('<style>', { text: `svg { fill: ${color} }` });
        ensure.jqElement($doc.find('svg')).append($style);
    });

    $obj.attr('data', `../../assets/manupulate-svg-within-html-object-with-javascript/images/${imgBasename}.svg`);


    ensure.jqElement($item.find('[js-text]')).text(util.lorem(1, _.random(2, 5)));


    return $item;
}));
