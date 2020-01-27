import './index.html';
import './index.less';


const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug

const API_BASE_URL = 'http://localhost:8765';


const init = async function() {
    const res = await axios.get(`${ API_BASE_URL }/`);

    log(res.data);
};


init();
