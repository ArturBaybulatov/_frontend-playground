import './index.less';

import {
    API_BASE_URL,
    pages,
} from '../../variables.js';

import { renderMenu } from '../menu';
import { promptAuth } from '../auth';

const { ensure } = util;


const init = function() {
    renderMenu(ensure.jqElement($('[js-menu]')), pages);


    const $logInBtn = ensure.jqElement($('[js-log-in-btn]'));
    const $logOutBtn = ensure.jqElement($('[js-log-out-btn]'));

    $logInBtn.on('click', function() {
        promptAuth(function(login, password) {
            [global.login, global.password] = [login, password];

            $logInBtn.hide();
            $logOutBtn.show();

            toastr.success('Logged in');
        });
    });

    $logOutBtn.on('click', function() {
        global.login = global.password = null;

        $logOutBtn.hide();
        $logInBtn.show();

        toastr.success('Logged out');
    });
};


export const renderTable = function($table, items) {
    ensure.jqElement($table);
    ensure.array(items);

    $table.html(items.map(function(item) {
        ensure.plainObject(item);

        return $('<tr>', {
            html: Object.keys(item).map(function(key) {
                let val = item[key];
                if (_.isPlainObject(val)) val = val.name;
                return $('<td>', { text: val });
            }),
        });
    }));
};


export const getCategoriesAsync = function(page) {
    return $.when().then(function() {
        ensure.positiveInteger(page);

        return $.get(`${API_BASE_URL}/categories/?page=${page}&ordering=-id`)
            .catch(util.responseToError)
            .then(wrap => ensure.array(ensure.plainObject(wrap).results));
    });
};


init();
