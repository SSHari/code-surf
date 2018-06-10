(function() {
	var commentButtons = $('.cs-comment-modal-btn');
	commentButtons.on('click', function(e) {
		var commentAction = $(this).data('action'),
			commentText = $(this).data('comment'),
			modalForm = $('.modal-content'),
			modalCommentField = $('.modal-body #cs-edit-comment-field');
			
		modalForm.prop('action', commentAction);
		modalCommentField.val(commentText);
	});
}());