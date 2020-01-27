const fs = require('fs');
const express = require('express');
const serveIndex = require('serve-index');
const Stat = require('stat-mode');
const reload = require('reload');
const path = require('path');
const _ = require('lodash');


const log = function(val) { console.log(val); return val }; // Debug


const app = express();


app.use('/', express.static('public'), serveIndex('public', {
    icons: true,
    view: 'details',

    template(args, next) {
        try {
            args.fileList = args.fileList.filter(function(x) {
                x.stat = new Stat(x.stat);

                return x.stat.isDirectory()
                    || x.stat.isFile() && 'jpg jpeg png apng gif bmp svg tif tiff webp ico'.split(' ')
                        .includes(path.extname(x.name).replace(/^\./, '').toLowerCase());
            });


            fs.readFile('template.html', 'utf8', function(err, html) {
                if (err) throw err;
                next(null, _.template(html)({ args: args }));
            });
        } catch (err) {
            next(err);
        }
    },
}));


reload(app);


app.listen(56048);
