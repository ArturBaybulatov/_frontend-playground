import '../../lib/baybulatov-util-css-0.3.0-beta/index.less';

import * as util from '../../lib/baybulatov-util-js-0.7.0-beta';
import '../../lib/baybulatov-util-js-0.7.0-beta/index.less';

import './index.less';


window.util_ = util; // eslint-disable-line no-multi-assign

global.log = val => { console.log(val); return val }; // eslint-disable-line no-console


export const id = () => Number(_.uniqueId()); // eslint-disable-line import/prefer-default-export


const init = () => {};


init();
