const { ensure } = util;


export const promptAuth = function(onSuccess) {
    ensure.function(onSuccess);


    const $loginInput = $('<input>', {
        class: 'k-textbox bgap',
        attr: { placeholder: 'Login' },
        css: { width: '100%' },
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
            $('<button>', { attr: { type: 'submit' }, css: { position: 'absolute', opacity: 0, zIndex: -1 } }),
        ],
    });


    kendoUtil.popup({ title: 'Logging in', content: $form }, {
        open(destroy) {
            setTimeout(() => $loginInput.trigger('select'), 100);

            $form.on('submit', function($evt) {
                $evt.preventDefault();


                try {
                    var login = ensure.nonEmptyString($loginInput.val());
                    var password = ensure.nonEmptyString($passwordInput.val());
                } catch (err) {
                    toastr.error(err.message, 'Please check if login and password fields are filled in');
                    $loginInput.trigger('select');
                    return;
                }

                destroy();
                onSuccess(login, password);
            });
        },

        ok() { $form.trigger('submit') },
    }).open();
};
