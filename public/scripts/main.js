(function() {
	var commentButtons = $('.cs-comment-modal-btn'),
		uploadProfilePic = $('#uploadProfilePic'),
		uploadProfilePicModal = $('#editProfilePicModal');
		
	commentButtons.on('click', function(e) {
		var commentAction = $(this).data('action'),
			commentText = $(this).data('comment'),
			modalForm = $('.modal-content'),
			modalCommentField = $('.modal-body #cs-edit-comment-field');
			
		modalForm.prop('action', commentAction);
		modalCommentField.val(commentText);
	});
	
	uploadProfilePic.on('change', function(e) {
		// get the file name
		var fileInput = $(this)[0],
			fileName = fileInput && fileInput.files ? fileInput.files[0].name : $(this).val();
		
		// replace the "Choose a file" label
		$(this).next('.custom-file-control').html(fileName);
	});
	
	uploadProfilePicModal.on('hidden.bs.modal', function(e) {
		// empty input value
		$(this).find('.custom-file-input').val('');
		
		// empty profile picture uploader text
		$(this).find('.custom-file-control').empty();
	});
}());