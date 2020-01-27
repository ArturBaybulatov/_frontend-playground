var getDataAsync = function(password) {
    return $.when().then(function() {
        if (password !== 's3cr3t')
            throw new Error('Password incorrect');

        return $.Deferred(function() {
            var self = this;
            setTimeout(function() { self.resolve('Example data') }, 2000);
        });
    });
};

getDataAsync('s3cr3t')
    .then(function(res) { toastr.success(res.toUpperCase()) })
    .catch(function(err) { toastr.error(err.message, "Couldn't get data") });


(async function() {
    try {
        var res = await getDataAsync('s3cr3t');
        toastr.success(res.toUpperCase());
    } catch (err) {
        toastr.error(err.message, "Couldn't get data");
    }
}());
