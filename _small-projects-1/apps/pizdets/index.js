import './index.html';
import './index.less';


const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const $call = ensure.jqElement($('[js-call]'));
    const $callText = ensure.jqElement($('[js-call-text]'));

    $call.on('mouseenter', () => $callText.stop().animate({ width: 162 }, 600));
    $call.on('mouseleave', () => $callText.stop().animate({ width: 0 }, 600));
    setTimeout(() => $callText.animate({ width: 0 }, 600), 1000);



    const exampleCampaignNames = [
        'Распродажа. Скидки до 90%',
        'Ликвидация цен',
        'Чёрная пятница 2018-07-13',
        'Летний супер-sale 2018',
        'Цены пополам',
        'Грандиозные скидки',
        'Одежда для отдыха',
    ];

    const exampleBannerNames = [
        'Кроссовки Adidas',
        'Распродажа сумок и рюкзаков',
        "Джинсы Levi's",
        'Куртки Reebok',
        'Белые тапочки',
        'Электроника по самым выгодным ценам',
    ];

    const statuses = {
        unreviewed: { name: 'Непроверен', color: '#666' },
        beingReviewed: { name: 'На модерации', color: 'rgb(214, 207, 17)', bgColor: 'rgba(214, 207, 17, 0.1)' },
        approved: { name: 'Одобрен', color: 'rgb(68, 201, 86)', bgColor: 'rgba(68, 201, 86, 0.2)' },
        rejected: { name: 'Отклонён', color: 'red', bgColor: 'rgba(255, 0, 0, 0.1)' },
        ended: { name: 'Показы завершены', color: '#999', bgColor: 'rgba(153, 153, 153, 0.1)' },
    };


    const bannerTableFields = [
        { path: 'campaignName', title: 'Кампания', type: 'string' },
        { path: 'banner', title: 'Баннер', type: 'Banner' },
        { path: 'date', title: 'Дата', type: 'date' },
        { path: 'status', title: 'Статус', type: 'Status' },
        { path: 'position', title: 'Позиция', type: 'number' },
    ];

    const items = _(50).times(function() {
        return {
            campaignName: _.sample(exampleCampaignNames),

            banner: {
                name: _.sample(exampleBannerNames),
                imageUrl: `../../images/rIfZrOwe/banner-examples/${ _.sample('abcdefg') }.jpg`,
            },

            date: util.randomDate(),
            status: statuses[_.sample(Object.keys(statuses))],
            position: _.random(1, 16),
        };
    }).orderBy('date', 'desc').v;


    const $bannerTableHead = ensure.jqElement($('[js-banner-table-head]'));

    $bannerTableHead.html($('<tr>', { html: bannerTableFields.map(f => $('<th>', { text: f.title })) }).append('<th>', '<th>'));


    const $bannerTableBody = ensure.jqElement($('[js-banner-table-body]'));

    $bannerTableBody.html(items.map(function(item) {
        const $tr = $('<tr>', { html: bannerTableFields.map(function(field) {
            const $td = $('<td>');
            const val = _.get(item, field.path);

            if (['string', 'number'].includes(field.type)) $td.text(val);

            if (field.type === 'date') $td.text(util.formatDateRu(val));

            if (field.type === 'Banner') {
                const $thumb = $('<span>', { class: 'rgap-s', css: {
                    width: 40,
                    height: 40,
                    background: `url("${ val.imageUrl }") center center / cover no-repeat`,
                } });

                const $name = $('<span>', { text: val.name });

                $td.addClass('flex f-middle');
                $td.html([$thumb, $name]);
            }

            if (field.type === 'Status') {
                $td.addClass('status');
                $td.text(val.name);
                if (util.isNonEmptyString(val.color)) $td.css('color', val.color);
            }

            return $td;
        }) });

        if (util.isNonEmptyString(_.get(item, 'status.bgColor'))) $tr.css('background', item.status.bgColor);

        $tr.append(
            `<td><a href="#">Аукцион</a></td>`,
            `<td><a href="#">Статистика</a></td>`,
        );

        return $tr;
    }));
};


init();
