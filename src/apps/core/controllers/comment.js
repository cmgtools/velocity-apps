// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'comment', 'cmg.core.controllers.CommentController' );
	app.mapController( 'review', 'cmg.core.controllers.ReviewController' );
	app.mapController( 'feedback', 'cmg.core.controllers.FeedbackController' );
	app.mapController( 'testimonial', 'cmg.core.controllers.TestimonialController' );
});

// == Comment Controller ==================

cmg.core.controllers.CommentController = function() {};

cmg.core.controllers.CommentController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.CommentController.prototype.createActionSuccess = function( requestElement, response ) {

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

cmg.core.controllers.CommentController.prototype.spamActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to mark it as spam?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.core.controllers.CommentController.prototype.spamActionSuccess = function( requestElement, response ) {

	// Process request spam
};

cmg.core.controllers.CommentController.prototype.approveActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to approve it?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.core.controllers.CommentController.prototype.approveActionSuccess = function( requestElement, response ) {

	// Process request approve
};

cmg.core.controllers.CommentController.prototype.deleteActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to delete it?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.core.controllers.CommentController.prototype.deleteActionSuccess = function( requestElement, response ) {

	// Process request delete
};

// == Review Controller ===================

cmg.core.controllers.ReviewController = function() {};

cmg.core.controllers.ReviewController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.ReviewController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.gallery-review' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Feedback Controller =================

cmg.core.controllers.FeedbackController = function() {};

cmg.core.controllers.FeedbackController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.FeedbackController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.gallery-feedback' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Testimonial Controller ==============

cmg.core.controllers.TestimonialController = function() {};

cmg.core.controllers.TestimonialController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.TestimonialController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.gallery-testimonial' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Direct Calls ========================

// == Additional Methods ==================

/*

function initCommentListeners() {

	jQuery( '.reviews-uploader' ).cmtFileUploader( { uploadListener: reviewItemListener } );

	jQuery( '.review-items-wrap .btn-delete' ).click( function() {

		jQuery( this ).closest( '.review-item' ).remove();

		// Reset Counter
		resetReviewItemCounter();
	});
}

function reviewItemListener( fileUploader, directory, type, responseData ) {

	// Generate View
	var form		= jQuery( '.reviews-uploader .form-wrap' );
	var title		= form.find( '.title' );
	var desc		= form.find( '.desc' );

	var total		= jQuery( '.review-items-wrap .review-item' ).length;
	var source 		= document.getElementById( 'reviewItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { count: total, data: responseData, title: title.val(), description: desc.val() };
	var output 		= template( data );

	title.val( '' );
	desc.val( '' );

	jQuery( '.review-items-wrap' ).append( output );

	jQuery( '.review-items-wrap .btn-delete' ).last().click( function() {

		jQuery( this ).closest( '.review-item' ).remove();

		// Reset Counter
		resetReviewItemCounter();
	});

	// Reset Counter
	resetReviewItemCounter();
}

function resetReviewItemCounter() {

	// Reset Counter
	jQuery( '.review-items-wrap .review-item' ).each( function( index, value ) {

		var item	= jQuery( this );

		item.find( '.id' ).attr( 'name', 'File[' + index + '][id]' );
		item.find( '.name' ).attr( 'name', 'File[' + index + '][name]' );
		item.find( '.extension' ).attr( 'name', 'File[' + index + '][extension]' );
		item.find( '.directory' ).attr( 'name', 'File[' + index + '][directory]' );
		item.find( '.type' ).attr( 'name', 'File[' + index + '][type]' );
		item.find( '.changed' ).attr( 'name', 'File[' + index + '][changed]' );
		item.find( '.title' ).attr( 'name', 'File[' + index + '][title]' );
		item.find( '.description' ).attr( 'name', 'File[' + index + '][description]' );
	});
}

// cmg.core.controllers.CommentController ------------------------------------------

cmg.core.controllers.CommentController	= function() {};

cmg.core.controllers.CommentController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.CommentController.prototype.likeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentLike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.core.controllers.CommentController.prototype.dislikeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentDislike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.core.controllers.CommentController.prototype.followerActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentFollower( requestElement, response.data );
	}
};


cmg.core.controllers.ReviewController.prototype.approveActionPost = function( success, requestElement, response ) {

	if( success ) {

		requestElement.closest( '.review' ).remove();

		jQuery( '#approved-reviews' ).prepend( response.data );
		jQuery( '#approved-reviews #caption-fallback' ).fadeOut();

		var countApproved	= parseInt( jQuery( '#total-count-approved' ).html() );
		var countNew		= parseInt( jQuery( '#total-count-new' ).html() );

		jQuery( '#total-count-approved' ).html( countApproved + 1 );
		jQuery( '#total-count-new' ).html( countNew - 1 );

		jQuery( '#approved-reviews .review .cmt-request' ).first().cmtRequestProcessor({
			app: mainApp
		});

		jQuery( '.filled' ).prevAll().html( '&#9733;' );
	}
};

cmg.core.controllers.ReviewController.prototype.deleteActionPost = function( success, requestElement, response ) {

	if( success ) {

		requestElement.closest( '.review' ).remove();

		var countTotal	= parseInt( jQuery( '#total-count' ).html() );
		var countNew	= parseInt( jQuery( '#total-count-new' ).html() );

		jQuery( '#total-count' ).html( countTotal - 1 );

		if( requestElement.hasClass( 'approved' ) ) {

			var countApproved	= parseInt( jQuery( '#total-count-approved' ).html() );

			jQuery( '#total-count-approved' ).html( countApproved - 1 );
		}
		else {

			jQuery( '#total-count-new' ).html( countNew - 1 );
		}
	}
};

cmg.core.controllers.ReviewController.prototype.spamRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-ban'></i><span class='width width-5 inline-block'></span>Requested For Spam </a>" );
	}
};

cmg.core.controllers.ReviewController.prototype.deleteRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-close'></i><span class='width width-5 inline-block'></span>Requested For Delete </a>" );
	}
};
*/
