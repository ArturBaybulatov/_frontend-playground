(function() {
    'use strict';

    var log = _.unary(console.log); // Debug
    var sampleData = window.sampleData = {};

    sampleData.funnelLabels = [
        { abbr: 'BSE', name: 'Показ баннера' },
        { abbr: 'BCE', name: 'Клик по баннеру' },
        { abbr: 'CTO', name: 'Открытие каталога' },
        { abbr: 'GCO', name: 'Открытие карточки товара' },
        { abbr: 'АТВ', name: 'Добавление в корзину' },
        { abbr: 'BK1', name: 'Главная страница корзины' },
        { abbr: 'BKD', name: 'Выбор способа доставки' },
        { abbr: 'BKP', name: 'Выбор способа оплаты' },
        { abbr: 'ORC', name: 'Заказ подтвержден' },
    ];
}());
