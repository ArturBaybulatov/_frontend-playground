(function() {
    'use strict';

    window.g = window; // Debug
    var log = g.log = _.unary(console.log); // Debug

    var __ = undefined;
    var ensure = util.ensure;

    var paths = _.times(200, function() { return _('abcdefgh').shuffle().sampleSize(_.random(1, 8)).v });

    paths = paths.map(function(path) {
        return path.map(function(fragm, i) { return fragm + '-lvl-' + (i + 1) });
    });

    var obj = { name: '__root' };
    paths.forEach(function(path) { util.setPath(obj, path) });
    //log(obj);

    lbl: try {
        util.getPath(obj, ['x', 'y', 'zzz']);
    } catch (err) {
        if (err instanceof util.NoSuchPathError) {
            toastr.info('No such path');
            break lbl;
        }

        throw err;
    };
}());
