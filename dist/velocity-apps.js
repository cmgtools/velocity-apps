/**
 * Velocity Apps - v1.0.0-alpha1 - 2018-07-19
 * Description: Velocity Apps is application and controllers library for CMSGears.
 * License: GPL-3.0-or-later
 * Author: Bhagwat Singh Chouhan
 */

// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'address', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Map Controllers
	app.mapController( 'address', 'cmg.controllers.address.AddressController' );

	// Map Services
	app.mapService( 'address', 'cmg.services.address.AddressService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=address]' ) );

	// Listeners
	app.getService( 'address' ).initAddress();
	
	app.getService( 'address' ).refreshGoogleMap( jQuery( '.frm-address' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.address = cmg.controllers.address || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.address = cmg.services.address || {};

// == Address Controller ==================

cmg.controllers.address.AddressController = function() {};

cmg.controllers.address.AddressController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.address.AddressController.prototype.getActionSuccess = function( requestElement, response ) {
	
	var addressService = cmt.api.root.getApplication( 'address' ).getService( 'address' );

	var container	= requestElement.closest( '.data-crud-address' );
	var cid			= requestElement.closest( '.card-address' ).attr( 'cid' );

	addressService.updateAddress( container, cid, response.data );
}

cmg.controllers.address.AddressController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var addressService = cmt.api.root.getApplication( 'address' ).getService( 'address' );

	var container = requestElement.closest( '.data-crud-address' );

	requestElement.fadeOut( 'fast' );

	requestElement.remove();

	addressService.addAddressCard( container, response.data );
}

cmg.controllers.address.AddressController.prototype.updateActionSuccess = function( requestElement, response ) {

	var addressService = cmt.api.root.getApplication( 'address' ).getService( 'address' );

	var container = requestElement.closest( '.data-crud-address' );

	addressService.refreshAddressCard( container, response.data );
}

cmg.controllers.address.AddressController.prototype.deleteActionSuccess = function( requestElement, response ) {

	requestElement.closest( '.card-address' ).remove();
}

// == Address Service =============

cmg.services.address.AddressService = function() {};

cmg.services.address.AddressService.inherits( cmt.api.services.BaseService );

cmg.services.address.AddressService.prototype.initAddress = function() {

	var self = this;

	jQuery( '#btn-add-address' ).click( function() {

		self.addAddress( '#' + jQuery( this ).attr( 'data-target' ) );
	});
}

cmg.services.address.AddressService.prototype.addAddress = function( target ) {

	var source 		= document.getElementById( 'addAddressTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { } );

	var target = jQuery( target ).find( '.address-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', target );
	cmt.api.utils.request.registerTargetApp( 'location', target );

	// Custom Select
	target.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Close Address
	target.find( '.address-form-close' ).click( function() {
		
		target.hide();
	});

	// Refresh Map
	this.refreshGoogleMap( target );
}

cmg.services.address.AddressService.prototype.updateAddress = function( container, cid, address ) {

	var source 		= document.getElementById( 'updateAddressTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { cid: cid, address: address.address } );

	var target = container.find( '.address-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Custom Select
	var country		= target.find( '.address-country' );
	var province	= target.find( '.address-province' );
	var region		= target.find( '.address-region' );

	//country.find( "option[value='" + country.attr( 'cid' ) + "']" ).prop( 'selected', true );

	country.val( country.attr( 'cid' ) );
	province.val( province.attr( 'pid' ) );

	if( region.length === 1 ) {

		region.val( region.attr( 'rid' ) );
	}

	target.find( '.address-select' ).val( address.type );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', target );
	cmt.api.utils.request.registerTargetApp( 'location', target );

	// Custom Select
	target.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Close Address
	target.find( '.address-form-close' ).click( function() {
		
		target.hide();
	});

	// Refresh Map
	this.refreshGoogleMap( target );
	
	this.refreshRegions( target, region.attr( 'rid' ) );
}

cmg.services.address.AddressService.prototype.addAddressCard = function( container, address ) {

	var source 		= document.getElementById( 'addressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { address: address } );

	var target = container.find( '.address-cards' );

	target.append( output );

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), target.find( '[cmt-app=address]' ) );
}

cmg.services.address.AddressService.prototype.refreshAddressCard = function( container, address ) {

	var source 		= document.getElementById( 'refreshAddressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { address: address } );

	var target	= container.find( '.address-cards' );
	var card	= target.find( '#card-address-' + address.cid );

	card.html( output );

	container.find( '.address-form-wrap' ).fadeOut();

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), card.find( '[cmt-app=address]' ) );
}

cmg.services.address.AddressService.prototype.refreshRegions = function( target, regionId ) {

}

cmg.services.address.AddressService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.frm-ll-picker .line1, .frm-ll-picker .line2, .frm-ll-picker .line3, .frm-ll-picker .city, .frm-ll-picker .zip' ).keyup( function() {

		var line1 	= jQuery( '.frm-ll-picker .line1' ).val();
		var line2 	= jQuery( '.frm-ll-picker .line2' ).val();
		var city 	= jQuery( '.frm-ll-picker .city' ).val();
		var zip 	= jQuery( '.frm-ll-picker .zip' ).val();
		var address	= line1 + ',' + line2 + ',' + city + ',' + zip;

		if( address.length > 10 ) {

			jQuery( '.frm-ll-picker .search-box' ).val( address ).trigger( 'change' );
		}
	});
}

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'comment', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Map Controllers
	app.mapController( 'comment', 'cmg.controllers.comment.CommentController' );
	app.mapController( 'review', 'cmg.controllers.comment.ReviewController' );
	app.mapController( 'feedback', 'cmg.controllers.comment.FeedbackController' );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=comment]' ) );

	//initCommentListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.comment = cmg.controllers.comment || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.comment = cmg.services.comment || {};

// == Comment Controller ==================

cmg.controllers.comment.CommentController = function() {};

cmg.controllers.comment.CommentController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.comment.CommentController.prototype.createActionSuccess = function( requestElement, response ) {

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Review Controller ===================

cmg.controllers.comment.ReviewController = function() {};

cmg.controllers.comment.ReviewController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.comment.ReviewController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.gallery-review' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Feedback Controller =================

cmg.controllers.comment.FeedbackController = function() {};

cmg.controllers.comment.FeedbackController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.comment.FeedbackController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.gallery-feedback' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Direct Calls ========================

// == Additional Methods ==================

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

// cmg.controllers.comment.CommentController ------------------------------------------

cmg.controllers.comment.CommentController	= function() {};

cmg.controllers.comment.CommentController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.comment.CommentController.prototype.likeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentLike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.controllers.comment.CommentController.prototype.dislikeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentDislike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.controllers.comment.CommentController.prototype.followerActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentFollower( requestElement, response.data );
	}
};


cmg.controllers.comment.ReviewController.prototype.approveActionPost = function( success, requestElement, response ) {

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

cmg.controllers.comment.ReviewController.prototype.deleteActionPost = function( success, requestElement, response ) {

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

cmg.controllers.comment.ReviewController.prototype.spamRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to mark it as spam ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.controllers.comment.ReviewController.prototype.spamRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-ban'></i><span class='width width-5 inline-block'></span>Requested For Spam </a>" );
	}
};

cmg.controllers.comment.ReviewController.prototype.deleteRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to delete it ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.controllers.comment.ReviewController.prototype.deleteRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-close'></i><span class='width width-5 inline-block'></span>Requested For Delete </a>" );
	}
};
*/


// == Application =========================

jQuery( document ).ready( function() {

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

	var app	= cmt.api.root.registerApplication( 'location', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Map Controllers
	app.mapController( 'province', 'cmg.controllers.location.ProvinceController' );
	app.mapController( 'city', 'cmg.controllers.location.CityController' );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=location]' ) );

	// Listeners
	jQuery( '.address-province' ).change( function() {

		var cityFill = jQuery( this ).closest( '.frm-address' ).find( '.city-fill' );

		cityFill.find( '.id' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.location = cmg.controllers.location || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.location = cmg.services.location || {};

// == Province Controller =================

cmg.controllers.location.ProvinceController	= function() {};

cmg.controllers.location.ProvinceController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.ProvinceController.prototype.provinceActionPre = function( requestElement ) {

	this.requestData = { countryId: requestElement.find( 'select' ).val() };

	return true;
};

cmg.controllers.location.ProvinceController.prototype.provinceActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.parent().find( '.wrap-province .cmt-select-wrap' );

	if( response.data.length <= 0 ) {

		response.data = '<option value="0">Choose Province</option>';
	}

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == City Controller =====================

cmg.controllers.location.CityController	= function() {};

cmg.controllers.location.CityController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.CityController.prototype.autoSearchActionPre = function( requestElement ) {

	var form		= requestElement.closest( '.frm-address' );
	var autoFill	= requestElement.closest( '.auto-fill' );

	var provinceId 	= form.find( '.address-province' ).val();
	var cityName 	= form.find( '.auto-fill-text' ).val();

	if( cityName.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.auto-fill-target .target' ).val( '' );

		return false;
	}

	this.requestData = "province-id=" + provinceId + "&name=" + cityName;

	return true;
};

cmg.controllers.location.CityController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class='auto-fill-item' data-id='" + obj.id + "' data-lat='" + obj.latitude + "' data-lon='" + obj.longitude + "' data-zip='" + obj.postal + "'>" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class='auto-fill-message'>No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= autoFill.find( '.auto-fill-target .target' );
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
			var parent		= jQuery( this ).closest( '.frm-address' );
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

	cmt.api.root.registerApplication( 'notify', 'cmt.api.Application', { basePath: ajaxUrl } );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.notify = cmg.controllers.notify || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.notify = cmg.services.notify || {};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	var app = cmt.api.root.getApplication( 'notify' );

	// Map Controllers
	app.mapController( 'notification', 'cmg.controllers.notify.NotificationController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=notify]' ) );
});

// == Controller Namespace ================

// == Notification Controller =============

cmg.controllers.notify.NotificationController = function() {};

cmg.controllers.notify.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.notify.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.controllers.notify.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

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

cmg.controllers.notify.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

cmg.controllers.notify.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.controllers.notify.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Direct Calls ========================

// == Additional Methods ==================
