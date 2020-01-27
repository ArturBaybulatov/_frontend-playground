angular.module('test').component('test', {
    bindings: {
        limit: '<',
        offset: '<',
    },
    
    templateUrl: 'test/test.html',
    
    controller: function(testService) {
        var ctrl = this
        
        ctrl.$onInit = function() {
            testService.getThings({limit: ctrl.limit, offset: ctrl.offset}).then(function(things) {
                ctrl.things = things
            })
        }
    },
})
