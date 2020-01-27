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


init();
