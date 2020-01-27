import '../../lib/baybulatov-util-css-0.2.0-beta/index.less';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';
import '../../lib/baybulatov-util-js-0.7.0-beta/index.less';

import './index.less';


const { ensure } = util;

global.log = function(val) { console.log(val); return val }; // Debug


const init = function() {};


init();
