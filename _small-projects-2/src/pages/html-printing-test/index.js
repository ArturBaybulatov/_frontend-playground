import './index.html';
import './index.less';

const { ensure } = util;


const $printBtn = ensure.jqElement($('[js-print-btn]'));

$printBtn.on('click', function() {
    const win = window.open('', 'printing', 'height=900,width=1500,resizable=yes,scrollbars=yes');
    const $printContent = ensure.jqElement($('[js-print-content]'));

    win.document.write(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Hello</title>
            <link href="../../lib-local/baybulatov-util-css-0.0.1-beta/baybulatov-util.css" rel="stylesheet">
            <link href="index.css" rel="stylesheet"> <!-- Tmp -->
        </head>

        <body>
            <div class="content">
                ${$printContent.html()}
            </div>

            <script>
                window.document.close(); // IE
                window.focus(); // IE
                window.print();
            </script>
        </body>
        </html>
    `);
});
