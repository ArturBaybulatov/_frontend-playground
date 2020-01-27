import './index.html';
import './index.less';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const $loadingBtn = ensure.jqElement($('[js-loading-btn]'));

    $loadingBtn.on('click', function() {
        kendoUtil.blockUi();
        setTimeout(kendoUtil.unblockUi, 2000);
    });


    const $confirmBtn = ensure.jqElement($('[js-confirm-btn]'));

    $confirmBtn.on('click', function() {
        kendo.confirm('Are you sure?').then(() => toastr.info('Thank you'));
    });


    const $popupBtn = ensure.jqElement($('[js-popup-btn]'));

    $popupBtn.on('click', function() {
        const $loginInput = $('<input>', {
            class: 'k-textbox',
            attr: { placeholder: 'Login' },
            css: { width: '100%', marginBottom: '20px' },
        });

        const $passwordInput = $('<input>', {
            class: 'k-textbox',
            attr: { placeholder: 'Password', type: 'password' },
            css: { width: '100%' },
        });

        const $form = $('<form>', {
            css: { display: 'flex', flexDirection: 'column' },

            html: [
                $loginInput,
                $passwordInput,
                $('<button>', { attr: { type: 'submit' }, css: { position: 'absolute', opacity: 0 } }),
            ],
        });

        kendoUtil.popup($form, { title: 'Logging in' }, {
            open(destroy) {
                setTimeout(() => $loginInput.trigger('select'), 100);

                $form.on('submit', function($evt) {
                    $evt.preventDefault();

                    const login = $loginInput.val();
                    const password = $passwordInput.val();

                    if (!(util.isNonEmptyString(login) && util.isNonEmptyString(password))) {
                        toastr.error('Please, input the login and password');
                        $loginInput.trigger('select');
                        return;
                    }

                    kendoUtil.blockUi();

                    setTimeout(function() {
                        if (login === 'vasya' && password === '123') {
                            toastr.success("You've logged in");
                            destroy();
                        } else {
                            toastr.error("Couldn't log in");
                            $loginInput.trigger('select');
                        }

                        kendoUtil.unblockUi();
                    }, 3000);
                });
            },

            ok() { $form.trigger('submit') },
            close() { toastr.warning('Closed') },
        });
    });


    const $imagePopupBtn = ensure.jqElement($('[js-image-popup-btn]'));

    $imagePopupBtn.on('click', function() {
        const imageUrl = '../images/forest.jpg';
        const $popup = $('<div>', { class: 'image-display', css: { backgroundImage: `url("${imageUrl}")` } });
        kendoUtil.popup($popup, { width: 1000, maxWidth: 1000, height: 800, maxHeight: 800, actions: null });
    });
};


init();
