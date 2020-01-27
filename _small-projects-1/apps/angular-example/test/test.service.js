angular.module('test').factory('testService', function($http) {
    return {
        getThings: function(args) {
            var url = $$.format('http://localhost:8000/api/things/?limit=%s&offset=%s', args.limit, args.offset)
            
            return $http.get(url).then(function(res) {
                return res.data.results
            })
        }
    }
})
