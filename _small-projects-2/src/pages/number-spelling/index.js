import './index.html';

const { ensure } = util;

const log = function(val) { console.log(val); return val }; // Debug


const testNumbers = [
    0,
    1,
    2,
    3,
    4,
    5,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    1000000000,
    2000000000,
    101101101101,
    202202202202,
    5210652064414568,
];

testNumbers.forEach(function(n) {
    log(`${ util.spellNumberRu(n) } ${ util.morph(n, ['ребёнок', 'ребёнка', 'детей']) }`);
    log(`${ util.spellNumberRu(n, true) } ${ util.morph(n, ['проблема', 'проблемы', 'проблем']) }`);
    log('------------------------------');
});
