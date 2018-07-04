/**
 * Velocity Apps - v1.0.0-alpha1 - 2018-07-04
 * Description: Velocity Apps is application and controllers library for CMSGears.
 * License: GPL-3.0-or-later
 * Author: Bhagwat Singh Chouhan
 */

// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'address', 'cmt.api.Application', { basePath: ajaxUrl } );

	app.mapController( 'address', 'cmg.controllers.AddressController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=address]' ) );

	initAddress();
});

// == Controller Namespace ================

// == Address Controller ==================

cmg.controllers.AddressController = function() {};

cmg.controllers.AddressController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.AddressController.prototype.getActionSuccess = function( requestElement, response ) {

	var cid = requestElement.closest( '.mapper-item' ).attr( 'cid' );

	updateAddress( cid, response.data );
}

cmg.controllers.AddressController.prototype.addActionSuccess = function( requestElement, response ) {

	requestElement.fadeOut( 'fast' );

	requestElement.remove();

	addAddressCard( response.data );
}

cmg.controllers.AddressController.prototype.updateActionSuccess = function( requestElement, response ) {

	refreshAddressCard( response.data );
}

cmg.controllers.AddressController.prototype.deleteActionSuccess = function( requestElement, response ) {

	requestElement.closest( '.mapper-item' ).remove();
}

// == Direct Calls ========================

// == Additional Methods ==================

function initAddress() {

	jQuery( '#btn-add-address' ).click( function() {

		addAddress( '#' + jQuery( this ).attr( 'data-target' ) );
	});
}

function addAddress( target ) {

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

	// Init Map
	initGoogleMap( target );
}

function updateAddress( cid, address ) {

	var source 		= document.getElementById( 'updateAddressTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { cid: cid, address: address } );

	var target		= jQuery( '#box-crud-address' ).find( '.frm-address' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), target.find( '[cmt-app=address]' ) );

	// Custom Select
	target.find( '.address-province' ).val( target.find( '.address-province' ).attr( 'pid' ) );
	target.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Map
	initListingRegMap();
}

function addAddressCard( address ) {

	var source 		= document.getElementById( 'addressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { address: address } );

	var target		= jQuery( '#box-crud-address' ).find( '.mapper-items' );

	target.append( output );

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), target.find( '[cmt-app=address]' ) );
}

function refreshAddressCard( address ) {

	var source 		= document.getElementById( 'refreshAddressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { address: address } );

	var target		= jQuery( '#box-crud-address' ).find( '.mapper-items' );
	var card		= target.find( '#mapper-item-' + address.cid );

	card.html( output );

	var form		= jQuery( '#box-crud-address' ).find( '.frm-address' );

	form.fadeOut();

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), card.find( '[cmt-app=address]' ) );
}


// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'comment', 'cmt.api.Application', { basePath: ajaxUrl } );

	app.mapController( 'comment', 'cmg.controllers.CommentController' );
	app.mapController( 'review', 'cmg.controllers.ReviewController' );
	app.mapController( 'feedback', 'cmg.controllers.FeedbackController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=comment]' ) );

	//initCommentListeners();
});

// == Controller Namespace ================

// == Comment Controller ==================

cmg.controllers.CommentController = function() {};

cmg.controllers.CommentController.inherits( cmt.api.controllers.RequestController );

// == Review Controller ===================

cmg.controllers.ReviewController = function() {};

cmg.controllers.ReviewController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.ReviewController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.review-items-wrap' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Feedback Controller =================

cmg.controllers.FeedbackController = function() {};

cmg.controllers.FeedbackController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.FeedbackController.prototype.createActionSuccess = function( requestElement, response ) {

	// Empty Images
	requestElement.find( '.feedback-items-wrap' ).html( '' );

	// Reset rating
	requestElement.find( '.cmt-rating' ).cmtRate( 'reset' );
};

// == Direct Calls ========================

// == Additional Methods ==================

// == Additional Methods ==================

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

/*

// cmg.controllers.CommentController ------------------------------------------

cmg.controllers.CommentController	= function() {};

cmg.controllers.CommentController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.CommentController.prototype.likeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentLike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.controllers.CommentController.prototype.dislikeActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentDislike( requestElement, response.data );
	}
	else {

		if( !response.errors.userExist ) {

			showLoginBox();
		}
	}
};

cmg.controllers.CommentController.prototype.followerActionPost = function( success, requestElement, response ) {

	if( success ) {

		handleCommentFollower( requestElement, response.data );
	}
};


cmg.controllers.ReviewController.prototype.approveActionPost = function( success, requestElement, response ) {

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

cmg.controllers.ReviewController.prototype.deleteActionPost = function( success, requestElement, response ) {

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

cmg.controllers.ReviewController.prototype.spamRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to mark it as spam ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.controllers.ReviewController.prototype.spamRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-ban'></i><span class='width width-5 inline-block'></span>Requested For Spam </a>" );
	}
};

cmg.controllers.ReviewController.prototype.deleteRequestActionPre = function( requestElement, response ) {

	var result = confirm( 'Are you sure you want to submit admin request to delete it ?' );

	if( result ) {

	    return true;
	}

	return false;
};

cmg.controllers.ReviewController.prototype.deleteRequestActionPost = function( success, requestElement, response ) {

	if( success ) {

		jQuery( requestElement ).html( "<a class='btn disabled'><i class='fa fa-close'></i><span class='width width-5 inline-block'></span>Requested For Delete </a>" );
	}
};
*/


// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'grid', 'cmt.api.Application', { basePath: ajaxUrl } );

	app.mapController( 'crud', 'cmg.controllers.grid.CrudController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=grid]' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.grid = cmg.controllers.grid || {};

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

	app.mapController( 'province', 'cmg.controllers.location.ProvinceController' );
	app.mapController( 'city', 'cmg.controllers.location.CityController' );

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

	app.mapController( 'auto', 'cmg.controllers.mappers.AutoController' );
	app.mapController( 'model', 'cmg.controllers.mappers.ModelController' );
	app.mapController( 'csv', 'cmg.controllers.mappers.CsvController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=mapper]' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.mappers = cmg.controllers.mappers || {};

// == Auto Controller =====================

cmg.controllers.mappers.AutoController = function() {

	this.singleRequest		= true;
	this.previousLocation	= null;
};

cmg.controllers.mappers.AutoController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mappers.AutoController.prototype.autoSearchActionPre = function( requestElement ) {

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

cmg.controllers.mappers.AutoController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

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

cmg.controllers.mappers.ModelController = function() {};

cmg.controllers.mappers.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mappers.ModelController.prototype.autoSearchActionPre = function( requestElement ) {

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

cmg.controllers.mappers.ModelController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

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

				processAutoSearch( id, name, template );
			}
		});
	}

	itemList.slideDown();
};

cmg.controllers.mappers.ModelController.prototype.mapItemActionPre = function( requestElement ) {

	var itemId	= requestElement.find( 'input[name=itemId]' ).val();
	itemId		= parseInt( itemId );

	if( itemId > 0 ) {

		return true;
	}

	return false;
};

cmg.controllers.mappers.ModelController.prototype.mapItemActionSuccess = function( requestElement, response ) {

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

cmg.controllers.mappers.ModelController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

// == Csv Controller ======================

cmg.controllers.mappers.CsvController = function() {};

cmg.controllers.mappers.CsvController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.mappers.CsvController.prototype.mapItemActionSuccess = function( requestElement, response ) {

	var submitItems	= jQuery( '.mapper-submit-items' );
	var mapperItems	= submitItems.find( '.mapper-items' );

	var source 		= document.getElementById( submitItems.attr( 'template' ) ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { list: response.data };
	var output 		= template( data );

	mapperItems.html( output );

	cmt.api.utils.request.register( cmt.api.root.getApplication( 'mapper' ), mapperItems.find( '[cmt-app=mapper]' ) );
};

cmg.controllers.mappers.CsvController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

// == Direct Calls ========================

// == Additional Methods ==================

function processAutoSearch( id, name, template ) {

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

		var test	= jQuery( itemsArr[ i ] ).find( '.id' ).val();

		if( id == test ) {

			create = false;

			break;
		}
	}

	if( create ) {

		// Generate View
		var data		= { id: id, name: name };
		var output 		= template( data );

		mapperItems.append( output );

		itemsArr	= mapperItems.find( '.mapper-item' );
		itemsLength	= itemsArr.length;

		itemsArr.last().find( '.mapper-item-remove' ).click( function() {

			jQuery( this ).closest( '.mapper-item' ).remove();
		});
	}
}


// == Application =========================

jQuery( document ).ready( function() {

	cmt.api.root.registerApplication( 'notify', 'cmt.api.Application', { basePath: ajaxUrl } );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.notify = cmg.controllers.notify || {};

// == Direct Calls ========================

// == Additional Methods ==================


// == Application =========================

jQuery( document ).ready( function() {

	var app = cmt.api.root.getApplication( 'notify' );

	app.mapController( 'notification', 'cmg.controllers.notify.NotificationController' );

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
