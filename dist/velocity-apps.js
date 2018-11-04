/**
 * Velocity Apps - v1.0.0-alpha1 - 2018-11-04
 * Description: Velocity Apps is application and controllers library for CMSGears.
 * License: GPL-3.0-or-later
 * Author: Bhagwat Singh Chouhan
 */

// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'core', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=core]' ) );

	// Register Service Triggers
	//cmt.api.utils.request.registerServiceTriggers( jQuery( '.cmt-request' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.core = cmg.core || {};

// == Controller Namespace ================

cmg.core.controllers = cmg.core.controllers || {};

// == Service Namespace ===================

cmg.core.services = cmg.core.services || {};

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'address', 'cmg.core.controllers.AddressController' );
});

// == Address Controller ==================

cmg.core.controllers.AddressController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'address' );
};

cmg.core.controllers.AddressController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.AddressController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var address		= requestElement.closest( '.cmt-address' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, address, response.data );
};

cmg.core.controllers.AddressController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.AddressController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	this.modelService.refresh( container, address, response.data );
};

cmg.core.controllers.AddressController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, address );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'city', 'cmg.core.controllers.CityController' );
});

// == City Controller =====================

cmg.core.controllers.CityController	= function() {};

cmg.core.controllers.CityController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.CityController.prototype.autoSearchActionPre = function( requestElement ) {

	var form		= requestElement.closest( '.cmt-location' );
	var autoFill	= requestElement.closest( '.auto-fill' );

	var provinceId 	= form.find( '.cmt-location-province' ).val();
	var regionId	= form.find( '.cmt-location-region' ).val();
	var cityName 	= form.find( '.auto-fill-text' ).val();

	if( cityName.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.target' ).val( '' );

		return false;
	}

	this.requestData = "province-id=" + provinceId + "&region-id=" + regionId + "&name=" + cityName;

	return true;
};

cmg.core.controllers.CityController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\" data-lat=\"" + obj.latitude + "\" data-lon=\"" + obj.longitude + "\" data-zip=\"" + obj.postal + "\">" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class=\"auto-fill-message\">No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= autoFill.find( '.target' );
			var id		= jQuery( this ).attr( 'data-id' );
			var name	= jQuery( this ).html();

			var lat		= jQuery( this ).attr( 'data-lat' );
			var lon		= jQuery( this ).attr( 'data-lon' );
			var zip		= jQuery( this ).attr( 'data-zip' );
			zip			= zip.split( ' ' );

			itemList.slideUp();

			// Update City Id and Name
			target.val( id );
			requestElement.find( '.auto-fill-text' ).val( name );

			// Update Map
			var parent		= jQuery( this ).closest( '.cmt-location' );
			var address		= lat + ',' + lon;

			parent.find( '.search-ll' ).val( address ).trigger( 'change' );

			// Update City Zip
			parent.find( '.address-zip' ).val( zip[ 0 ] );
		});
	}

	itemList.slideDown();
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'comment', 'cmg.core.controllers.CommentController' );
	app.mapController( 'review', 'cmg.core.controllers.ReviewController' );
	app.mapController( 'feedback', 'cmg.core.controllers.FeedbackController' );
});

// == Comment Controller ==================

cmg.core.controllers.CommentController = function() {};

cmg.core.controllers.CommentController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.CommentController.prototype.createActionSuccess = function( requestElement, response ) {

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
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

cmg.core.controllers.ReviewController.prototype.spamRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to mark it as spam ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.core.controllers.ReviewController.prototype.spamRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-ban'></i><span class='width width-5 inline-block'></span>Requested For Spam </a>" );
	}
};

cmg.core.controllers.ReviewController.prototype.deleteRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to delete it ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.core.controllers.ReviewController.prototype.deleteRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-close'></i><span class='width width-5 inline-block'></span>Requested For Delete </a>" );
	}
};
*/


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'file', 'cmg.core.controllers.FileController' );
});

// == File Controller =====================

cmg.core.controllers.FileController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'file' );
};

cmg.core.controllers.FileController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.FileController.prototype.assignActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.FileController.prototype.clearActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Show Update Form
	this.modelService.clear( uploader );
};

cmg.core.controllers.FileController.prototype.clearActionFailure = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Show Update Form
	this.modelService.clear( uploader );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'location', 'cmg.core.controllers.LocationController' );
});

// == Location Controller =================

cmg.core.controllers.LocationController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'location' );
};

cmg.core.controllers.LocationController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.LocationController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var location	= requestElement.closest( '.cmt-location' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, location, response.data );
};

cmg.core.controllers.LocationController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.LocationController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var location	= container.find( '.cmt-location[data-id=' + response.data.cid + ']' );

	this.modelService.refresh( container, location, response.data );
};

cmg.core.controllers.LocationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var location	= container.find( '.cmt-location[data-id=' + response.data.cid + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, location );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'main', 'cmg.core.controllers.MainController' );
});

// == Main Controller =====================

cmg.core.controllers.MainController = function() {};

cmg.core.controllers.MainController.inherits( cmt.api.controllers.RequestController );

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'meta', 'cmg.core.controllers.MetaController' );
});

// == Meta Controller =====================

cmg.core.controllers.MetaController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'meta' );
};

cmg.core.controllers.MetaController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.AddressController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var meta		= requestElement.closest( '.cmt-meta' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, meta, response.data );
};

cmg.core.controllers.MetaController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.MetaController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var meta		= container.find( '.cmt-meta[data-id=' + response.data.id + ']' );

	this.modelService.refresh( container, meta, response.data );
};

cmg.core.controllers.MetaController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var meta		= container.find( '.cmt-meta[data-id=' + response.data.id + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, meta );
};

cmg.core.controllers.AddressController.prototype.toggleActionSuccess = function( requestElement, response ) {

	// Meta Tooggle Success
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'model', 'cmg.core.controllers.ModelController' );
});

// == Model Controller ====================

cmg.core.controllers.ModelController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'model' );
};

cmg.core.controllers.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.ModelController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= requestElement.closest( '.cmt-model' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.ModelController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	this.modelService.refresh( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, model );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'province', 'cmg.core.controllers.ProvinceController' );

	// Listeners
	jQuery( '.cmt-location-province' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Province Controller =================

cmg.core.controllers.ProvinceController	= function() {};

cmg.core.controllers.ProvinceController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.ProvinceController.prototype.optionsListActionPre = function( requestElement ) {

	var country = requestElement.find( 'select' );

	this.requestData = "country-id=" + country.val();

	if( cmt.utils.data.hasAttribute( country, 'data-province' ) ) {

		this.requestData += "&province-id=" + country.attr( 'data-province' );
	}

	return true;
};

cmg.core.controllers.ProvinceController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.cmt-location' ).find( '.cmt-location-provinces .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'region', 'cmg.core.controllers.RegionController' );

	// Listeners
	jQuery( '.cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Region Controller ===================

cmg.core.controllers.RegionController = function() {};

cmg.core.controllers.RegionController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.RegionController.prototype.optionsListActionPre = function( requestElement ) {

	var province = requestElement.find( 'select' );

	this.requestData = "province-id=" + province.val();

	if( cmt.utils.data.hasAttribute( province, 'data-region' ) ) {

		this.requestData += "&region-id=" + province.attr( 'data-region' );
	}

	return true;
};

cmg.core.controllers.RegionController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.cmt-location' ).find( '.cmt-location-regions .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'site', 'cmg.core.controllers.SiteController' );
});

// == Site Controller =====================

cmg.core.controllers.SiteController = function() {};

cmg.core.controllers.SiteController.inherits( cmt.api.controllers.RequestController );

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'user', 'cmg.core.controllers.UserController' );

});

// == User Controller =====================

cmg.core.controllers.UserController = function() {};

cmg.core.controllers.UserController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.UserController.prototype.assignAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Header Popuout
	jQuery( '.popout-group-main .wrap-user .fa-user' ).remove();
	jQuery( '.popout-group-main .wrap-user .user-avatar' ).remove();
	jQuery( '.popout-group-main .wrap-user' ).prepend( '<img class="user-avatar" src="' + response.data.thumbUrl + '" />' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.UserController.prototype.clearAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Header Popuout
	jQuery( '.popout-group-main .wrap-user .fa-user' ).remove();
	jQuery( '.popout-group-main .wrap-user .user-avatar' ).remove();
	jQuery( '.popout-group-main .wrap-user' ).prepend( '<span class="fa fa-user icon"></span>' );

	// Update Uploader
	uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-user"></i>');
	uploader.find( '.file-clear' ).hide();
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.UserController.prototype.profileActionSuccess = function( requestElement, response ) {

	// Profile success
};

cmg.core.controllers.UserController.prototype.accountActionSuccess = function( requestElement, response ) {

	// Show old password field
	requestElement.find( '.data-crud-wrap .hidden-easy' ).removeClass( 'hidden-easy' );
};

cmg.core.controllers.UserController.prototype.addressActionSuccess = function( requestElement, response ) {

	// Address success
};

cmg.core.controllers.UserController.prototype.settingsActionSuccess = function( requestElement, response ) {

	// Settings success
};

// == Direct Calls ========================

function setUserData( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-data", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserData( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-data", "Meta[key]=" + key );
}

function setUserAttribute( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-attribute", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserAttribute( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-attribute", "Meta[key]=" + key );
}

function setUserConfig( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-config", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserConfig( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-config", "Meta[key]=" + key );
}

function setUserSetting( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-setting", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserSetting( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-setting", "Meta[key]=" + key );
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'address', 'cmg.core.services.AddressService' );

	// Event Listeners
	app.getService( 'address' ).initListeners();

	app.getService( 'address' ).refreshGoogleMap( jQuery( '.frm-address' ) );
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations using Address and ModelAddress models.

.cmt-address-crud {

	.cmt-address-add {
		// Trigger to show the address form
	}

	.cmt-address-form {
		// The form container to add/update address
		// Render the from available in addTemplate and updateTemplate

		.cmt-address-close {
			// Hides the add/update form
		}

		// The location component
		.cmt-location {

			.cmt-location-country { }
			.cmt-location-countries { }
			.cmt-location-province { }
			.cmt-location-provinces { }
			.cmt-location-region { }

			.cmt-location-city-fill {
				
				.target { }
				.auto-fill-text { }
			}
		}

		.lat-long-picker {
			// Latitude and Longitude Picker
		}

		.cmt-location-ll-picker {
			.line1 { }
			.line2 { }
			.line3 { }
			.city { }
			.zip { }
			.search-box { }
		}
	}

	.cmt-address-collection {
		// Collection of existing addresses

		.cmt-address {
			// Renders all the addresses either using PHP or viewTemplate by making call to get addresses and iterating the result set
			// Renders the address using viewTemplate after adding an address
			// Refresh and partial render the address using refreshTemplate after updating an address
		}
	}
}
 */

// == Address Service =====================

cmg.core.services.AddressService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addAddressTemplate';
	this.updateTemplate		= 'updateAddressTemplate';
	this.viewTemplate		= 'addressViewTemplate';
	this.refreshTemplate	= 'addressRefreshTemplate';
};

cmg.core.services.AddressService.inherits( cmt.api.services.BaseService );

cmg.core.services.AddressService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-address-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-address-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.AddressService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.AddressService.prototype.initUpdateForm = function( container, address, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Custom Select
	var country		= form.find( '.cmt-location-country' );
	var province	= form.find( '.cmt-location-province' );
	var region		= form.find( '.cmt-location-region' );

	//country.find( "option[value='" + country.attr( 'cid' ) + "']" ).prop( 'selected', true );

	country.val( country.attr( 'cid' ) );
	province.val( province.attr( 'pid' ) );

	if( region.length === 1 ) {

		region.val( region.attr( 'rid' ) );
	}

	form.find( '.cmt-address-type' ).val( data.ctype );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );

	// TODO: Check the timings and overlapping of response
	this.refreshProvinces( form, province.attr( 'pid' ) );

	this.refreshRegions( form, region.attr( 'rid' ) );
}

cmg.core.services.AddressService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-address-collection' );

	// Add at first
	collection.prepend( output );

	var address = collection.find( '.cmt-address' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', address );

	// Init Actions
	cmt.utils.ui.initActionsElement( address.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.core.services.AddressService.prototype.refresh = function( container, address, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	address.find( '.cmt-address-header .title' ).html( data.title );
	address.find( '.cmt-address-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.core.services.AddressService.prototype.remove = function( container, address ) {

	var actions = address.find( '.cmt-actions' );
	
	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	address.remove();
}

cmg.core.services.AddressService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-address-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-address-crud' );
		}
	}

	return container;
}

cmg.core.services.AddressService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.cmt-location-country' ).attr( 'data-province', provinceId );

	target.find( '.cmt-location-country' ).closest( '.cmt-location-countries' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.AddressService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.cmt-location-province' ).attr( 'data-region', regionId );

	target.find( '.cmt-location-province' ).closest( '.cmt-location-provinces' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.AddressService.prototype.clearCity = function( target ) {

	target.find( '.cmt-location-province, .cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}

cmg.core.services.AddressService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.cmt-location-ll-picker .line1, .cmt-location-ll-picker .line2, .cmt-location-ll-picker .line3, .cmt-location-ll-picker .city, .cmt-location-ll-picker .zip' ).keyup( function() {

		var line1 	= jQuery( '.cmt-location-ll-picker .line1' ).val();
		var line2 	= jQuery( '.cmt-location-ll-picker .line2' ).val();
		var city 	= jQuery( '.cmt-location-ll-picker .city' ).val();
		var zip 	= jQuery( '.cmt-location-ll-picker .zip' ).val();
		var address	= line1 + ',' + line2 + ',' + city + ',' + zip;

		if( address.length > 10 ) {

			jQuery( '.cmt-location-ll-picker .search-box' ).val( address ).trigger( 'change' );
		}
	});
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'file', 'cmg.core.services.FileService' );

	// Event Listeners
	app.getService( 'file' ).initListeners();
});

// == File Service ========================

cmg.core.services.FileService = function() {};

cmg.core.services.FileService.inherits( cmt.api.services.BaseService );

cmg.core.services.FileService.prototype.initListeners = function() {

	var self = this;
}

cmg.core.services.FileService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-file-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-file-crud' );
		}
	}

	return container;
}

cmg.core.services.FileService.prototype.clear = function( uploader ) {

	var type = uploader.attr( 'type' );

	// Update Uploader
	switch( type ) {
		
		case 'image': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-image"></i>' );
			
			break;
		}
		case 'video': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-video"></i>' );
			
			break;
		}
		case 'compressed': {

			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-file-archive"></i>' );

			break;
		}
		default: {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="icon cmti cmti-5x cmti-file"></i>' );
			
			break;
		}
	}

	uploader.find( '.file-clear' ).hide();
	uploader.find( '.post-action' ).hide();
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'location', 'cmg.core.services.LocationService' );

	// Event Listeners
	app.getService( 'location' ).initListeners();

	app.getService( 'location' ).refreshGoogleMap( jQuery( '.frm-location' ) );
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations using Location and ModelLocation models.

.cmt-location-crud {

	.cmt-location-add {
		// Trigger to show the location form
	}

	.cmt-location-form {
		// The form container to add/update location
		// Render the from available in addTemplate and updateTemplate

		.cmt-location-close {
			// Hides the add/update form
		}

		// The location component
		.cmt-location {

			.cmt-location-country { }
			.cmt-location-countries { }
			.cmt-location-province { }
			.cmt-location-provinces { }
			.cmt-location-region { }

			.cmt-location-city-fill {
				
				.target { }
				.auto-fill-text { }
			}
		}

		.lat-long-picker {
			// Latitude and Longitude Picker
		}

		.cmt-location-ll-picker {
			.title { }
			.city { }
			.zip { }
			.search-box { }
		}
	}

	.cmt-location-collection {
		// Collection of existing locations

		.cmt-location {
			// Renders all the locations either using PHP or viewTemplate by making call to get locations and iterating the result set
			// Renders the location using viewTemplate after adding an location
			// Refresh and partial render the location using refreshTemplate after updating an location
		}
	}
}
 */

// == Address Service =====================

cmg.core.services.LocationService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addLocationTemplate';
	this.updateTemplate		= 'updateLocationTemplate';
	this.viewTemplate		= 'locationViewTemplate';
	this.refreshTemplate	= 'locationRefreshTemplate';
};

cmg.core.services.LocationService.inherits( cmt.api.services.BaseService );

cmg.core.services.LocationService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-location-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-location-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.LocationService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-location-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-location-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.LocationService.prototype.initUpdateForm = function( container, location, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-location-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Custom Select
	var country		= form.find( '.cmt-location-country' );
	var province	= form.find( '.cmt-location-province' );
	var region		= form.find( '.cmt-location-region' );

	//country.find( "option[value='" + country.attr( 'cid' ) + "']" ).prop( 'selected', true );

	country.val( country.attr( 'cid' ) );
	province.val( province.attr( 'pid' ) );

	if( region.length === 1 ) {

		region.val( region.attr( 'rid' ) );
	}

	form.find( '.cmt-location-type' ).val( data.type );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-location-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );

	// TODO: Check the timings and overlapping of response
	this.refreshProvinces( form, province.attr( 'pid' ) );

	this.refreshRegions( form, region.attr( 'rid' ) );
}

cmg.core.services.LocationService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-location-collection' );

	// Add at first
	collection.prepend( output );

	var location = collection.find( '.cmt-location' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', location );

	// Init Actions
	cmt.utils.ui.initActionsElement( location.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-location-form' ).slideUp( 'slow' );
}

cmg.core.services.LocationService.prototype.refresh = function( container, location, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	location.find( '.cmt-location-header .title' ).html( data.title );
	location.find( '.cmt-location-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-location-form' ).slideUp( 'slow' );
}

cmg.core.services.LocationService.prototype.remove = function( container, location ) {

	var actions = location.find( '.cmt-actions' );
	
	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	location.remove();
}

cmg.core.services.LocationService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-location-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-location-crud' );
		}
	}

	return container;
}

cmg.core.services.LocationService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.cmt-location-country' ).attr( 'data-province', provinceId );

	target.find( '.cmt-location-country' ).closest( '.cmt-location-countries' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.LocationService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.cmt-location-province' ).attr( 'data-region', regionId );

	target.find( '.cmt-location-province' ).closest( '.cmt-location-provinces' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.LocationService.prototype.clearCity = function( target ) {

	target.find( '.cmt-location-province, .cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}

cmg.core.services.LocationService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.cmt-location-ll-picker .title, .cmt-location-ll-picker .line1, .cmt-location-ll-picker .line2, .cmt-location-ll-picker .line3, .cmt-location-ll-picker .city, .cmt-location-ll-picker .zip' ).keyup( function() {
		
		var title		= jQuery( '.cmt-location-ll-picker .title' );
		var location	= '';

		if( title.length > 0 ) {

			location = title.val();
		}

		var city	= jQuery( '.cmt-location-ll-picker .city' ).val();
		var zip		= jQuery( '.cmt-location-ll-picker .zip' ).val();

		location += location + ',' + city + ',' + zip;

		if( location.length > 10 ) {

			jQuery( '.cmt-location-ll-picker .search-box' ).val( location ).trigger( 'change' );
		}
	});
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'meta', 'cmg.core.services.MetaService' );

	// Event Listeners
	app.getService( 'meta' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of model attributes.

.cmt-meta-crud {

	.cmt-meta-add {
		// Trigger to show the model form
	}

	.cmt-meta-form {
		// The form container to add/update model

		.cmt-meta-close {
			// Hides the add/update form
		}
	}

	.cmt-meta-collection {
		// Collection of existing models

		.cmt-meta {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model

			.cmt-meta-header {
				// Header

				.btn-edit {
					// Copy meta values and show update popup
				}

				.btn-delete {
					// Copy meta values and show delete popup
				}
			}

			.cmt-meta-data {
				// Data
			}
		}
	}
}
*/

// == Meta Service ========================

cmg.core.services.MetaService = function() {

	this.addTemplate		= 'addMetaTemplate';
	this.updateTemplate		= 'updateMetaTemplate';
	this.viewTemplate		= 'metaViewTemplate';
	this.refreshTemplate	= 'metaRefreshTemplate';
};

cmg.core.services.MetaService.inherits( cmt.api.services.BaseService );

cmg.core.services.MetaService.prototype.initListeners = function() {

	var self = this;

	var containers = jQuery( '.cmt-meta-crud' );

	if( containers.length == 0 ) {

		return;
	}

	containers.each( function() {

		var container	= jQuery( this );
		var layout		= container.attr( 'ldata-layout' );

		switch( layout ) {

			case 'popup': {

				self.initPopups( container );

				break;
			}
			default: {

				container.find( '.cmt-meta-add' ).click( function() {

					self.initAddForm( container );
				});
			}
		}
	});
}

cmg.core.services.MetaService.prototype.initPopups = function( container ) {

	container.find(  '.cmt-meta-add' ).click( function() {

		showPopup( '#popup-attribute-add' );

		cmt.utils.data.bindEditor( '#popup-attribute-add .late-editor' );
	});
	
	this.initPopupTriggers( container.find( '.cmt-meta' ) );
}

cmg.core.services.MetaService.prototype.initPopupTriggers = function( meta ) {

	var self = this;

	meta.find( '.btn-edit' ).click( function() {

		showPopup( '#popup-attribute-update' );

		self.copyData( jQuery( this ).closest( '.cmt-meta' ), '#popup-attribute-update' );

		cmt.utils.data.bindEditor( '#popup-attribute-update .late-editor' );
	});

	meta.find( '.btn-delete' ).click( function() {

		showPopup( '#popup-attribute-delete' );

		self.copyData( jQuery( this ).closest( '.cmt-meta' ), '#popup-attribute-delete' );

		cmt.utils.data.bindEditor( '#popup-attribute-delete .late-editor' );
	});
}

cmg.core.services.MetaService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-meta-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Listeners
	form.find( '.cmt-meta-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.MetaService.prototype.initUpdateForm = function( container, meta, data ) {

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-meta-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Listeners
	form.find( '.cmt-meta-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
	
	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.MetaService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-meta-collection' );
	var layout		= container.attr( 'ldata-layout' );

	// Add at first
	collection.prepend( output );

	var meta = collection.find( '.cmt-meta' ).first();

	switch( layout ) {

		case 'popup': {

			closePopup( '#popup-attribute-add' );
			
			this.initPopupTriggers( meta );

			// Init Scroller
			meta.find( '.cscroller' ).mCustomScrollbar( { autoHideScrollbar: true } );
	
			break;
		}
		default: {

			// Init Request
			cmt.api.utils.request.registerTargetApp( 'core', meta );

			// Init Actions
			cmt.utils.ui.initActionsElement( meta.find( '.cmt-actions' ) );

			// Hide Form
			container.find( '.cmt-meta-form' ).slideUp( 'slow' );
		}
	}
}

cmg.core.services.MetaService.prototype.refresh = function( container, meta, data ) {

	var layout = container.attr( 'ldata-layout' );

	switch( layout ) {

		case 'popup': {

			meta.find( '.title' ).html( data.name );
			meta.find( '.cmt-meta-data .mCSB_container' ).html( data.value );

			closePopup( '#popup-attribute-update' );
	
			break;
		}
		default: {

			var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
			var template 	= Handlebars.compile( source );
			var output 		= template( data );

			meta.find( '.cmt-meta-header .title' ).html( data.title );
			meta.find( '.cmt-meta-data' ).replaceWith( output );

			// Hide Form
			container.find( '.cmt-meta-form' ).slideUp( 'slow' );
		}
	}
}

cmg.core.services.MetaService.prototype.remove = function( container, meta ) {

	var actions = meta.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove meta
	switch( container.attr( 'ldata-layout' ) ) {

		case 'popup': {

			meta.remove();

			closePopup( '#popup-attribute-delete' );

			break;
		}
		default: {

			meta.remove();
		}
	}
}

cmg.core.services.MetaService.prototype.copyData = function( meta, selector ) {

	var id		= meta.attr( 'data-id' );
	var name	= meta.find( '.title' ).html();
	var value	= meta.find( '.cmt-meta-data .mCSB_container' ).html();

	// Reset Form
	var form = jQuery( selector ).find( 'form' );

	form.find( '.name' ).val( name );
	form.find( '.description' ).val( value );
	form.find( '.message.success' ).val();
	form.find( '.message.error' ).val();

	var url = cmt.utils.data.updateUriParam( form.attr( 'action' ), 'cid', id );

	form.attr( 'action', url );
}

cmg.core.services.MetaService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-meta-crud' );

	// Find in Actions
	if( container.length == 0 ) {
		
		var listData	= requestElement.closest( '.actions-list-data' );
		var popupData	= requestElement.closest( '.popup-content-wrap' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-meta-crud' );
		}

		if( popupData.length == 1 ) {

			var id		= popupData.attr( 'data-id' );
			var type	= popupData.attr( 'data-type' );

			container = jQuery( '.cmt-meta-crud[data-id=' + id + '][data-type=' + type + ']' );
		}
	}

	return container;
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'model', 'cmg.core.services.ModelService' );

	// Event Listeners
	app.getService( 'model' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of models.

.cmt-model-crud {

	.cmt-model-add {
		// Trigger to show the address form
	}

	.cmt-model-form {
		// The form container to add/update model

		.cmt-model-close {
			// Hides the add/update form
		}
	}

	.cmt-model-collection {
		// Collection of existing models

		.cmt-model {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model
		}
	}
}
*/

// == Model Service =======================

cmg.core.services.ModelService = function() {

	this.addTemplate		= 'addModelTemplate';
	this.updateTemplate		= 'updateModelTemplate';
	this.viewTemplate		= 'modelViewTemplate';
	this.refreshTemplate	= 'modelRefreshTemplate';
};

cmg.core.services.ModelService.inherits( cmt.api.services.BaseService );

cmg.core.services.ModelService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-model-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-model-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.ModelService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-model-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.ModelService.prototype.initUpdateForm = function( container, model, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-model-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.ModelService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-model-collection' );

	// Add at first
	collection.prepend( output );

	var model = collection.find( '.cmt-model' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', model );

	// Init Actions
	cmt.utils.ui.initActionsElement( model.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.refresh = function( container, model, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	model.find( '.cmt-model-header .title' ).html( data.title );
	model.find( '.cmt-model-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.remove = function( container, model ) {

	var actions = model.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	model.remove();
}

cmg.core.services.ModelService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-model-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier	= listData.attr( 'ldata-id' );
			var list		= jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-model-crud' );
		}
	}
	
	return container;
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'user', 'cmg.core.services.UserService' );

	// Event Listeners
	app.getService( 'user' ).initListeners();
});

// == User Service ========================

cmg.core.services.UserService = function() {};

cmg.core.services.UserService.inherits( cmt.api.services.BaseService );

cmg.core.services.UserService.prototype.initListeners = function() {

	// Init User Service
}

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'data', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'custom', 'cmg.data.controllers.CustomController' );

	// Map Services
	app.mapService( 'custom', 'cmg.data.services.CustomService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=data]' ) );

	// Event Listeners
	app.getService( 'custom' ).initListeners();
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.data = cmg.data || {};

// == Controller Namespace ================

cmg.data.controllers = cmg.data.controllers || {};

// == Service Namespace ===================

cmg.data.services = cmg.data.services || {};

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of Data JSON.

.cmt-data-custom-crud {

	.cmt-data-custom-add {
		// Trigger to show the address form
	}

	.cmt-data-custom-collection {

		.cmt-data-custom {

		}
	}
}
 */

// == Custom Controller ===================

cmg.data.controllers.CustomController = function() {

	this.app = cmt.api.root.getApplication( 'data' );

	this.modelService = this.app.getService( 'custom' );
};

cmg.data.controllers.CustomController.inherits( cmt.api.controllers.RequestController );

cmg.data.controllers.CustomController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.data.controllers.CustomController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, custom, response.data );
}

cmg.data.controllers.CustomController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.data.controllers.CustomController.prototype.updateActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, custom, response.data );
}

cmg.data.controllers.CustomController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.data.controllers.CustomController.prototype.deleteActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Remove Data
	this.modelService.remove( container, custom );
}

// == Custom Service ======================

cmg.data.services.CustomService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addCustomDataTemplate';
	this.refreshTemplate	= 'refreshCustomDataTemplate';
};

cmg.data.services.CustomService.inherits( cmt.api.services.BaseService );

cmg.data.services.CustomService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-data-custom-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-data-custom-crud' );

		self.initAddForm( container );
	});
}

cmg.data.services.CustomService.prototype.initAddForm = function( container ) {

	var key = Math.random().toString( 36 ).substring( 2, 15 ) + Math.random().toString( 36 ).substring( 2, 15 );

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { key: key } );

	container.find( '.cmt-data-custom-collection' ).append( output );

	// Find data
	var custom = container.find( '.cmt-data-custom' ).last();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', custom );

	// Init Listeners
	custom.find( '.btn-remove' ).click( function() {

		custom.remove();
	});
}

cmg.data.services.CustomService.prototype.refresh = function( container, custom, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	custom.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', custom );
}

cmg.data.services.CustomService.prototype.remove = function( container, custom ) {

	var actions = custom.find( '.cmt-actions' );
	
	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Data
	custom.remove();
}

cmg.data.services.CustomService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-data-custom-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-data-custom-crud' );
		}
	}

	return container;
}

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'gallery', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'item', 'cmg.controllers.gallery.ItemController' );

	// Map Services
	app.mapService( 'item', 'cmg.services.gallery.ItemService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=gallery]' ) );

	// Event Listeners
	app.getService( 'item' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.gallery = cmg.controllers.gallery || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.gallery = cmg.services.gallery || {};

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of gallery items.

.cmt-gallery-item-crud {

	.cmt-gallery-item-add {
		// Trigger to show the model form
	}

	.cmt-gallery-item-form {
		// The form container to add/update model

		.cmt-gallery-item-close {
			// Hides the add/update form
		}
	}

	.cmt-gallery-item-collection {
		// Collection of existing models

		.cmt-gallery-item {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model

			.cmt-gallery-item-header {
				// Header
			}

			.cmt-gallery-item-data {
				// Data
			}
		}
	}
}
*/

// == Item Controller =====================

cmg.controllers.gallery.ItemController = function() {

	this.app = cmt.api.root.getApplication( 'gallery' );

	this.modelService = this.app.getService( 'item' );
};

cmg.controllers.gallery.ItemController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.gallery.ItemController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= requestElement.closest( '.cmt-gallery-item' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, item, response.data );
};

cmg.controllers.gallery.ItemController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.controllers.gallery.ItemController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.id + ']' );

	this.modelService.refresh( container, item, response.data );
};

cmg.controllers.gallery.ItemController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.id + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, item );
};

// == Item Service ========================

cmg.services.gallery.ItemService = function() {

	this.addTemplate		= 'addItemTemplate';
	this.updateTemplate		= 'updateItemTemplate';
	this.viewTemplate		= 'itemViewTemplate';
	this.refreshTemplate	= 'itemRefreshTemplate';
};

cmg.services.gallery.ItemService.inherits( cmt.api.services.BaseService );

cmg.services.gallery.ItemService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-gallery-item-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-gallery-item-crud' );

		self.initAddForm( container );
	});
}

cmg.services.gallery.ItemService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', form );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.services.gallery.ItemService.prototype.initUpdateForm = function( container, item, data ) {

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', form );

	// Copy image data
	form.find( '.file-data' ).html( item.find( '.cmt-gallery-item-data' ).html() );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
	
	// Show View
	form.fadeIn( 'slow' );
}

cmg.services.gallery.ItemService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-gallery-item-collection' );
	var item		= null;

	// Add at first
	switch( container.attr( 'ldata-layout' ) ) {

		case 'cmt-gallery': {

			collection.cmtSlider( 'addSlide', output );
			
			item = collection.find( '.cmt-gallery-item[ldata-id=0]' );

			break;
		}
		default: {

			collection.prepend( output );

			item = collection.find( '.cmt-gallery-item' ).first();
		}
	}

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', item );

	// Init Actions
	cmt.utils.ui.initActionsElement( item.find( '.cmt-actions' ) );

	// Clear Image and Hide Form
	container.find( '.cmt-gallery-item-uploader .file-data' ).html( '' );
	container.find( '.cmt-gallery-item-form' ).slideUp( 'slow' );
}

cmg.services.gallery.ItemService.prototype.refresh = function( container, item, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	item.find( '.cmt-gallery-item-header .title' ).html( data.title );
	item.find( '.cmt-gallery-item-data' ).replaceWith( output );

	// Clear Image and Hide Form
	container.find( '.cmt-gallery-item-uploader .file-data' ).html( '' );
	container.find( '.cmt-gallery-item-form' ).slideUp( 'slow' );
}

cmg.services.gallery.ItemService.prototype.remove = function( container, item ) {

	var actions		= item.find( '.cmt-actions' );
	var collection	= container.find( '.cmt-gallery-item-collection' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	switch( container.attr( 'ldata-layout' ) ) {

		case 'cmt-gallery': {

			collection.cmtSlider( 'removeSlide', parseInt( item.attr( 'ldata-id' ) ) );

			break;
		}
		default: {

			item.remove();
		}
	}
}

cmg.services.gallery.ItemService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-gallery-item-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-gallery-item-crud' );
		}
	}

	return container;
}

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {
	
	// Register App
	var app	= cmt.api.root.registerApplication( 'grid', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'crud', 'cmg.controllers.grid.CrudController' );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=grid]' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.grid = cmg.controllers.grid || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.grid = cmg.services.grid || {};

// == CRUD Controller =====================

cmg.controllers.grid.CrudController = function() {};

cmg.controllers.grid.CrudController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.grid.CrudController.prototype.bulkActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.bulkActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

cmg.controllers.grid.CrudController.prototype.genericActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.genericActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

cmg.controllers.grid.CrudController.prototype.deleteActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.deleteActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'mapper', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'auto', 'cmg.controllers.mapper.AutoController' );
	app.mapController( 'model', 'cmg.controllers.mapper.ModelController' );
	app.mapController( 'csv', 'cmg.controllers.mapper.CsvController' );

	// Map Services
	app.mapService( 'auto', 'cmg.services.mapper.AutoService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=mapper]' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.mapper = cmg.controllers.mapper || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.mapper = cmg.services.mapper || {};

// == Auto Controller =====================

cmg.controllers.mapper.AutoController = function() {

	this.singleRequest		= true;
	this.previousLocation	= null;
};

cmg.controllers.mapper.AutoController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mapper.AutoController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill = requestElement.closest( '.auto-fill' );

	var name = autoFill.find( '.search-name' ).val();
	var type = autoFill.find( '.search-type' );

	if( name.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.auto-fill-target .target' ).val( '' );

		return false;
	}

	if( type.length == 1 ) {

		this.requestData = "name=" + name + "&type=" + type.val();
	}
	else {

		this.requestData = "name=" + name;
	}

	return true;
};

cmg.controllers.mapper.AutoController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	//var wrapItemList	= requestElement.find( '.auto-fill-items-wrap' );
	var itemList		= requestElement.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class='auto-fill-item' data-id='" + obj.id + "'>" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class='auto-fill-message'>No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= requestElement.closest( '.auto-fill' ).find( '.auto-fill-target' );
			var id		= jQuery( this ).attr( 'data-id' );
			var name	= jQuery( this ).html();

			itemList.slideUp();

			// Update Id and Name
			target.find( '.target' ).val( id );
			requestElement.find( '.auto-fill-text' ).val( name );
		});
	}

	itemList.slideDown();
};

// == Mapper Controller ===================

cmg.controllers.mapper.ModelController = function() {};

cmg.controllers.mapper.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mapper.ModelController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill	= requestElement.closest( '.auto-fill' );
	var type 		= autoFill.find( 'input[name=type]' );
	var keyword 	= autoFill.find( '.auto-fill-text' ).val();

	var itemsLength	= requestElement.closest( '.mapper-auto-items' ).find( '.mapper-items' ).find( '.mapper-item' ).length;
	var itemsLimit	= requestElement.closest( '.mapper-auto-items' ).attr( 'limit' );

	if( keyword.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.trigger-map-item input[name=itemId]' ).val( '' );

		return false;
	}
	
	if( null !== itemsLimit && parseInt( itemsLimit ) <= itemsLength ) {
		
		alert( "No more mappings allowed." );
	}

	if( type.length == 1 ) {

		this.requestData = "name=" + keyword + "&type=" + type.val();
	}
	else {

		this.requestData = "name=" + keyword;
	}

	return true;
};

cmg.controllers.mapper.ModelController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data		= response.data;
	var listHtml	= '';
	var autoFill	= requestElement.closest( '.auto-fill' );
	var itemList	= requestElement.find( '.auto-fill-items' );
	var autoSubmit	= requestElement.attr( 'autoSubmit' ) || 'yes';
	var template	= requestElement.attr( 'template' ) || '';
	
	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\">" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml	= "<li class=\"auto-fill-message\">No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var id = jQuery( this ).attr( 'data-id' );
			var name = jQuery( this ).html();

			itemList.slideUp();

			if( autoSubmit === 'yes' ) {
				
				autoFill.find( '.trigger-map-item input[name=itemId]' ).val( id );
				autoFill.find( '.trigger-map-item .cmt-click' )[ 0 ].click();
			}
			else {

				cmt.api.root.getApplication( 'mapper' ).getService( 'auto' ).processAutoSearch( id, name, template );
			}
		});
	}

	itemList.slideDown();
};

cmg.controllers.mapper.ModelController.prototype.mapItemActionPre = function( requestElement ) {

	var itemId	= requestElement.find( 'input[name=itemId]' ).val();
	itemId		= parseInt( itemId );

	if( itemId > 0 ) {

		return true;
	}

	return false;
};

cmg.controllers.mapper.ModelController.prototype.mapItemActionSuccess = function( requestElement, response ) {

	var autoItems	= requestElement.closest( '.mapper-auto-items' );

	// Template
	var source 		= document.getElementById( autoItems.attr( 'template' ) ).innerHTML;
	var template 	= Handlebars.compile( source );

	// Map
	var mapperItems	= autoItems.find( '.mapper-items' );
	var itemsArr	= mapperItems.find( '.mapper-item' );
	var itemsLength	= itemsArr.length;

	var cid			= response.data.cid;
	var name		= response.data.name;

	// Reset search field
	autoItems.find( '.search-name' ).val( '' );

	var create	= true;

	for( var i = 0; i < itemsLength; i++ ) {

		var test = jQuery( itemsArr[ i ] ).find( '.cid' ).val();

		if( cid == test ) {

			create = false;

			break;
		}
	}

	if( create ) {

		// Generate View
		var data	= { cid: cid, name: name };
		var output 	= template( data );

		mapperItems.append( output );

		itemsArr	= mapperItems.find( '.mapper-item' );
		itemsLength	= itemsArr.length;

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'mapper' ), itemsArr.last() );
	}
};

cmg.controllers.mapper.ModelController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

cmg.controllers.mapper.ModelController.prototype.toggleItemActionSuccess = function( requestElement, response ) {

	// Handle response
};

// == Csv Controller ======================

cmg.controllers.mapper.CsvController = function() {};

cmg.controllers.mapper.CsvController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mapper.CsvController.prototype.mapItemActionSuccess = function( requestElement, response ) {

	var submitItems	= jQuery( '.mapper-submit-items' );
	var mapperItems	= submitItems.find( '.mapper-items' );

	var source 		= document.getElementById( submitItems.attr( 'template' ) ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { list: response.data };
	var output 		= template( data );

	mapperItems.html( output );

	cmt.api.utils.request.register( cmt.api.root.getApplication( 'mapper' ), mapperItems.find( '[cmt-app=mapper]' ) );
};

cmg.controllers.mapper.CsvController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

// == Auto Service ========================

cmg.services.mapper.AutoService = function() {};

cmg.services.mapper.AutoService.inherits( cmt.api.services.BaseService );

cmg.services.mapper.AutoService.prototype.processAutoSearch = function( id, name, template ) {

	// Template
	var source 		= document.getElementById( template ).innerHTML;
	var template 	= Handlebars.compile( source );
	// Map
	var mapperItems	= jQuery( '.mapper-auto-categories' ).find( '.mapper-items' );
	var itemsArr	= mapperItems.find( '.mapper-item' );
	var itemsLength	= itemsArr.length;

	// Reset search field
	jQuery( '.mapper-auto-categories .search-name' ).val( '' );

	if( itemsLength >= 5 ) {

		alert( "No more mappings allowed." );

		return;
	}

	var create	= true;

	for( var i = 0; i < itemsLength; i++ ) {

		var test = jQuery( itemsArr[ i ] ).find( '.id' ).val();

		if( id == test ) {

			create = false;

			break;
		}
	}

	if( create ) {

		// Generate View
		var data	= { id: id, name: name };
		var output 	= template( data );

		mapperItems.append( output );

		itemsArr	= mapperItems.find( '.mapper-item' );
		itemsLength	= itemsArr.length;

		itemsArr.last().find( '.mapper-item-remove' ).click( function() {

			jQuery( this ).closest( '.mapper-item' ).remove();
		});
	}
}

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'data' );

	// Map Controllers
	app.mapController( 'social', 'cmg.data.controllers.SocialController' );

	// Map Services
	app.mapService( 'social', 'cmg.data.services.SocialService' );

	// Event Listeners
	app.getService( 'social' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of Data JSON.

.cmt-data-social-crud {
	
	.cmt-data-social-options {
		// Option Chooser
	}

	.cmt-data-social-add {
		// Trigger to show the add/update form
	}

	.cmt-data-social-collection {

		.cmt-data-social {

		}
	}
}
 */

// == Social Controller ===================

cmg.data.controllers.SocialController = function() {

	this.app = cmt.api.root.getApplication( 'data' );

	this.modelService = this.app.getService( 'social' );
};

cmg.data.controllers.SocialController.inherits( cmt.api.controllers.RequestController );

cmg.data.controllers.SocialController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.data.controllers.SocialController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.updateActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.data.controllers.SocialController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.deleteActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Remove Data
	this.modelService.remove( container, social );
}

// == Social Service ======================

cmg.data.services.SocialService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addSocialDataTemplate';
	this.refreshTemplate	= 'refreshSocialDataTemplate';
};

cmg.data.services.SocialService.inherits( cmt.api.services.BaseService );

cmg.data.services.SocialService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-data-social-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-data-social-crud' );

		self.initAddForm( container );
	});
}

cmg.data.services.SocialService.prototype.initAddForm = function( container ) {

	var select	= container.find( '.cmt-data-social-options' );
	var icon	= select.val();
	var sns		= select.find( 'option:selected' ).text();

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { sns: sns, icon: icon } );

	container.find( '.cmt-data-social-collection' ).append( output );

	// Find data
	var social = container.find( '.cmt-data-social' ).last();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', social );

	// Init Listeners
	social.find( '.btn-remove' ).click( function() {

		social.remove();
	});
}

cmg.data.services.SocialService.prototype.refresh = function( container, social, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	social.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', social );
}

cmg.data.services.SocialService.prototype.remove = function( container, social ) {

	var actions = social.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Data
	social.remove();
}

cmg.data.services.SocialService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-data-social-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-data-social-crud' );
		}
	}

	return container;
}

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {
	
	// Register App
	var app = cmt.api.root.registerApplication( 'forms', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=forms]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.forms = cmg.forms || {};

// == Controller Namespace ================

cmg.forms.controllers = cmg.forms.controllers || {};

// == Service Namespace ===================

cmg.forms.services = cmg.forms.services || {};

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.getApplication( 'forms' );

	app.mapController( 'form', 'cmg.forms.controllers.FormController' );
});

// == Form Controller =====================

cmg.forms.controllers.FormController = function() { };

cmg.forms.controllers.FormController.inherits( cmt.api.controllers.RequestController );

cmg.forms.controllers.FormController.prototype.defaultActionSuccess = function( requestElement, response ) {

	console.log( 'form processed successfully.' );
};

cmg.forms.controllers.FormController.prototype.defaultActionFailure = function( requestElement, response ) {

	console.log( 'form processing failed.' );
};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'notify', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=notify]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.notify = cmg.notify || {};

// == Controller Namespace ================

cmg.notify.controllers = cmg.notify.controllers || {};

// == Service Namespace ===================

cmg.notify.services = cmg.notify.services || {};

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app = cmt.api.root.getApplication( 'notify' );

	// Map Controllers
	app.mapController( 'notification', 'cmg.notify.controllers.NotificationController' );

	if( jQuery('[cmt-app=notify]').length > 0 ) {

		cmt.api.utils.request.triggerDirect( cmt.api.root.getApplication('notify'), 'notification', 'stats', "notify/stats/stats", 'get' );
	}
});

// == Notification Controller =============

cmg.notify.controllers.NotificationController = function() {};

cmg.notify.controllers.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.notify.controllers.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

	var clickBtn	= requestElement.find( '.cmt-click' );
	var type		= clickBtn.attr( 'type' );
	var count		= response.data.unread;

	if( response.data.consumed ) {

		jQuery( ".count-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).html( count );

		if( count == 0 ) {

			jQuery( ".count-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).fadeOut( 'fast' );
		}
	}

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
};

cmg.notify.controllers.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

cmg.notify.controllers.NotificationController.prototype.statsActionSuccess = function( response ) {

	var data  = response.data;

	if( data.hasOwnProperty( 'notificationCount' )) {

		jQuery('.count-notification').html( data[ 'notificationCount' ] );
	}

	if( data.hasOwnProperty( 'remonderCount' )) {
	
		jQuery('.count-reminder').html( data[ 'remonderCount' ] );
	}
	
	if( data.hasOwnProperty( 'activityCount' )) {

		jQuery('.count-activity').html( data[ 'activityCount' ] );
	}
}

cmg.notify.controllers.NotificationController.prototype.notificationDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'notificationData' ).innerHTML;
	
	if( data.hasOwnProperty( 'notifications' )) {

		var output = '';

		var template 	= Handlebars.compile( source );

		jQuery.each( data.notifications , function( index, value ) {
			
			output +=	template( { data : value, siteUrl: siteUrl } );
		});
		
		
		if( data.notifications.length > 0 ) {
		
			output += "<li class='align align-center'><a href='"+siteUrl+"notify/notification/all'>View All</a></li>";
			
		}else {
			output = "No Data Found";
		}

		output = "<ul>" + output +"</ul>";
		
		jQuery("#popout-notification" ).find( ".popout-content").html( output );
		
		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-notification').find( '[cmt-app=notify]' ) );
	}

}

cmg.notify.controllers.NotificationController.prototype.reminderDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'reminderData' ).innerHTML;
	
	if( data.hasOwnProperty( 'reminders' )) {

		var output = '';

		var template 	= Handlebars.compile( source );

		jQuery.each( data.reminders , function( index, value ) {
			
			output +=	template( { data : value, siteUrl: siteUrl } );
		});
		
		
		if( data.reminders.length > 0 ) {
		
			output += "<li class='align align-center'><a href='"+siteUrl+"notify/reminder/all'>View All</a></li>";
			
		}
		else {
			output = "No Data Found";
		}
		
		output = "<ul>" + output +"</ul>";
		
		jQuery("#popout-reminder" ).find( ".popout-content").html( output );
		
		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-reminder').find( '[cmt-app=notify]' ) );	
	}

}

cmg.notify.controllers.NotificationController.prototype.activityDataActionSuccess = function( requestElement, response ) {

	var data = response.data;
	var source 	= document.getElementById( 'activityData' ).innerHTML;

	if( data.hasOwnProperty( 'activities' )) {

		var output = '';

		var template 	= Handlebars.compile( source );

		jQuery.each( data.activities , function( index, value ) {
			
			output +=	template( { data : value, siteUrl: siteUrl } );
		});
		
		
		if( data.activities.length > 0 ) {
		
			output += "<li class='align align-center'><a href='"+siteUrl+"notify/activity/all'>View All</a></li>";

		}else {
			output = "No Data Found";
		}
		
		output = "<ul>" + output +"</ul>";
		
		jQuery("#popout-activity" ).find( ".popout-content").html( output );
		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-activity').find( '[cmt-app=notify]' ) );	
	}

}

cmg.notify.controllers.NotificationController.prototype.toggleTrashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Direct Calls ========================

// == Additional Methods ==================

