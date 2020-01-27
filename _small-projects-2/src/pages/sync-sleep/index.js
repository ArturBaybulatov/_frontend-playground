import './index.html';


const log = function(val) { console.log(val); return val }; // Debug


const sleep = function(ms) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + ms) {}
    return;
};


log('Sleeping...');
sleep(3000);
log('Done');
