(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var ensure = util.ensure;
    var handleRejection = util.handleRejection;


    var init = function() {
        var $authBtn = ensure.jqElement($('[js-auth-btn]'));

        $authBtn.on('click', function() {
            promptAuth(function(authToken) {
                toastr.success(authToken, 'Successfully logged in');
            }, handleRejection("Couldn't log in"));
        });


        var $confirmTestBtn = ensure.jqElement($('[js-confirm-test-btn]'));

        $confirmTestBtn.on('click', function() {
            jqUtil.confirm('Are you sure?', function() { toastr.success('Action performed') });
        });
    };

    var getAuthTokenAsync = function(login, password) {
        return $.when().then(function() {
            ensure.nonEmptyString(login, password);

            return $.Deferred(function() {
                var self = this;

                setTimeout(function() {
                    if (login === 'vasya' && password === '123')
                        self.resolve('example-token');
                    else
                        self.reject(new Error('Wrong login or password'));
                }, 2000);
            });
        });
    };

    var promptAuth = function(onSuccess, onError) {
        ensure.function(onSuccess, onError);

        var $loginInput = $('<input>', { class: 'ui-widget input', attr: { placeholder: 'Login' } });
        var $passwordInput = $('<input>', { class: 'ui-widget input', attr: { placeholder: 'Password', type: 'password' } });

        var $popup = $('<form>', {
            html: [
                $('<div>', { class: 'l-row', html: $loginInput }),
                $('<div>', { class: 'l-row', html: $passwordInput }),
                $('<button>', { attr: { type: 'submit' }, css: { position: 'absolute', opacity: 0 } }),
            ],
        });

        jqUtil.popup('Logging in', $popup, {
            open: function() {
                $popup.on('submit', function($evt) {
                    $evt.preventDefault();

                    var login = $loginInput.val();
                    var password = $passwordInput.val();

                    if (!(util.isNonEmptyString(login) && util.isNonEmptyString(password))) {
                        toastr.error('Please, input the login and password');
                        return;
                    }

                    jqUtil.blockUi();

                    getAuthTokenAsync(login, password)
                        .always(jqUtil.unblockUi)
                        .then(function(authToken) { $popup.dialog('destroy'); onSuccess(authToken) })
                        .catch(onError);
                });
            },

            ok: function() { $popup.trigger('submit') },
        });
    };


    init();
}());
