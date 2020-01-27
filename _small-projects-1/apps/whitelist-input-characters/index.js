(function() {
    var $input = $('[js-input]').first();
    var latinRegex = /[a-z]/i;
    var latinRegexGlobal = /[a-z]/ig;


    // #1 ----------------------------------------

    $input.on('keypress', function($evt) {
        var char = String.fromCharCode($evt.which);

        if (latinRegex.exec(char))
            $evt.preventDefault();
    });

    $input.on('paste', function($evt) {
        setTimeout(function() {
            $input.val($input.val().replace(latinRegexGlobal, ''));
        }, 100);
    });


    // #2 ----------------------------------------

    var oldInputVal;

    setInterval(function() {
        var newInputVal = $input.val();

        if (oldInputVal !== newInputVal) {
            var sanitizedInputVal = newInputVal.replace(latinRegexGlobal, '');
            $input.val(sanitizedInputVal);
            oldInputVal = sanitizedInputVal
        }
    }, 100);
}());
