function koParams(params) {
    return JSON.stringify(params).slice(1, -1);
}

module.exports.koParams = koParams;
