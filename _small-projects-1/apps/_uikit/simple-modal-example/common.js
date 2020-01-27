(function() {
    $(document).on('click', '[js-modal-open]', function() {
        var $modalOpenBtn = $(this);
        modalOpen($modalOpenBtn.data('modal-contents-id'));
    });

    function modalOpen(modalContentsId) {
        var modalTemplate = _.template($('#modal').html());
        var $modal = $(modalTemplate({html: $('#' + modalContentsId).html()}));
        $('body').append($modal);
        UIkit.modal($modal).show();
        $modal.on('hide.uk.modal', function() {$modal.remove()});
    }
}());
