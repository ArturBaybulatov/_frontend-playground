(function() {
    //isMyJsonValid({type: 'string'})('Hello');
    //// => true
    //
    //isMyJsonValid({type: 'string'})(123);
    //// => false

    //--------------------------------

    var schema = {
        type: 'object',
        required: ['a', 'b', 'c'],

        properties: {
            a: {type: 'string'},
            b: {type: 'integer'},
            c: {type: 'array', items: {type: 'string'}, minItems: 1},
        },
    };

    console.log(isMyJsonValid(schema)({
        a: 'foo',
        b: 123,
        c: ['lorem', 'ipsum', 'dolor'],
    }));
}());
