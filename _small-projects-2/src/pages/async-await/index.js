import './index.html';
import './index.less';


const API_BASE_URL = 'http://api.example.com';
const DEBUG_SUPPLIER_ID = 8828;
//const DEBUG_SUPPLIER_ID = 1234;
const { ensure } = util;

const log = window.log = function(val) { console.log(val); return val }; // Debug


const init = async function() {
    $.ajaxSetup({ headers: { 'X-SupplierId': DEBUG_SUPPLIER_ID } });


    try {
        var [supplier, stats, brands] = await Promise.all([
            getSupplierAsync().catch(err => { console.error('Не удалось получить данные поставщика', err.message); throw err }),
            getOverallStatsAsync().catch(err => { console.error('Не удалось получить статистику', err.message); throw err }),
            getSupplierBrandsAsync().catch(err => { console.error('Не удалось получить бренды', err.message); throw err }),
        ]);
    } catch (__) {
        return;
    }


    log('Поставщик:');
    log(supplier);

    log('Статистика:');
    log(stats);

    log('Бренды:');
    log(brands);
};


const getSupplierAsync = function() {
    return $.get(`${ API_BASE_URL }/supplier`)
        .catch(util.responseToError)
        .then(x => ensure.plainObject(x));
};


const getSupplierBrandsAsync = function() {
    return $.get(`${ API_BASE_URL }/brands`)
        .catch(util.responseToError)
        .then(x => ensure.nonEmptyArray(x));
};


const getOverallStatsAsync = function() {
    return $.get(`${ API_BASE_URL }/stats/adverts`)
        .catch(util.responseToError)
        .then(x => ensure.nonEmptyArray(x));
};


init();
