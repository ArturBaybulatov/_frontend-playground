;(function() {
    var datepickerConfig = {
        selectYears: true,
        // onSet: datepickerOnSet,
    }
    
    var $datepicker = $('.js-datepicker').pickadate(datepickerConfig).removeClass('hidden')
    var datepicker = $datepicker.pickadate('picker')
    var $button = $('.js-button').first()
    
    datepicker.on({set: datepickerOnSet})
    
    datepicker.set('select', new Date(2000, 00, 01))
    
    $button.on('click', function($evt) {
        var date = datepicker.get('select').obj
        console.log(date)
    })
    
    
    // Definitions ----------------------------
    
    function datepickerOnSet(args) {
        console.log('args.select:', args.select)
    }
}())
