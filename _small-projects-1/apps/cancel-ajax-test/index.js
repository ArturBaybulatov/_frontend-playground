(function() {
    'use strict';

    var $containers = $('[js-container]');

    $containers.each(function(__, container) {
        var $container = $(container);

        var $getDataBtn = $container.find('[js-get-data-btn]').first();
        var $downloadBtn = $container.find('[js-download-btn]').first();
        var $cancelBtn = $container.find('[js-cancel-btn]').first();
        var $result = $container.find('[js-result]').first();

        $result.text('');
        $downloadBtn.hide();
        $cancelBtn.hide();

        $getDataBtn.on('click', function() {
            var taskCancelled = false;

            $result.text('Loading...');
            $cancelBtn.show();
            $getDataBtn.hide();

            getData().then(function(res) {
                if (taskCancelled)
                    return;

                $cancelBtn.hide();
                $result.text(res);
                $downloadBtn.show();
            });

            $cancelBtn.on('click', function() {
                taskCancelled = true;

                $result.text('Cancelled');
                $cancelBtn.hide();
                $getDataBtn.show();
            });
        });
    });


    function getData() {
        return new Promise(function(resolve, reject) {
            window.setTimeout(function() {
                resolve('Hello');
            }, 4000);
        });
    };
}());
