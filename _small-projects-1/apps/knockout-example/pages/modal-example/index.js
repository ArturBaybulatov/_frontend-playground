require('../../components/l-content');
require('../../components/modal');
require('../../components/video');
require('../../components/entry');
require('../../components/button');

var util = require('../../util.js');


var vm = new function() {
    var vm = this;

    vm.randomVideoId = ko.observable('9FVqK55glX8');

    vm.modalOpen = function(randomVideoId) {
        var $video = $('<ko:video>').attr({params: util.koParams({
            videoId: randomVideoId,
        })});

        var $entry = $('<ko:entry>').attr({params: util.koParams({
            title: 'Waaaaaaaat',
            body: 'This is nice',
        })});

        var $modal = $('<ko:modal>');

        $modal.append($video).append($entry);
        $('body').append($modal);

        ko.applyBindings({}, $modal.get(0));
    };
};

ko.applyBindings(vm);
