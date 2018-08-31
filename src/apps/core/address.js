// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'address', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'card', 'cmg.controllers.address.CardController' );

	// Map Services
	app.mapService( 'card', 'cmg.services.address.CardService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=address]' ) );

	// Event Listeners
	app.getService( 'card' ).initListeners();

	app.getService( 'card' ).refreshGoogleMap( jQuery( '.frm-address' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.address = cmg.controllers.address || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.address = cmg.services.address || {};

// == Card Controller =====================

cmg.controllers.address.CardController = function() {};

cmg.controllers.address.CardController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.address.CardController.prototype.getActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-address-card' );
	var card		= requestElement.closest( '.card-address' );

	// Show Update Form
	cmt.api.root.getApplication( 'address' ).getService( 'card' ).initUpdateForm( collection, card, response.data );
};

cmg.controllers.address.CardController.prototype.addActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-address-card' );

	// Add Card Item to List
	cmt.api.root.getApplication( 'address' ).getService( 'card' ).append( collection, response.data );
};

cmg.controllers.address.CardController.prototype.updateActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-address-card' );
	var card		= collection.find( '.card-address[data-id=' + response.data.cid + ']' );

	cmt.api.root.getApplication( 'address' ).getService( 'card' ).refresh( collection, card, response.data );
};

cmg.controllers.address.CardController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-address-card' );
	var card		= requestElement.closest( '.card-address' );

	cmt.api.root.getApplication( 'address' ).getService( 'card' ).remove( collection, card );
};

// == Card Service ========================

cmg.services.address.CardService = function() {};

cmg.services.address.CardService.inherits( cmt.api.services.BaseService );

cmg.services.address.CardService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.btn-add-address-card' ).length == 0 ) {

		return;
	}

	jQuery( '.btn-add-address-card' ).click( function() {

		var collection = jQuery( this ).closest( '.data-crud-address-card' );

		self.initAddForm( collection );
	});
}

cmg.services.address.CardService.prototype.initAddForm = function( collection ) {

	var source 		= document.getElementById( 'addAddressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var target = collection.find( '.address-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', target );
	cmt.api.utils.request.registerTargetApp( 'location', target );

	// Custom Select
	target.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	collection.find( '.btn-close-form' ).click( function() {

		target.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( target );
	
	// City Listener
	this.clearCity( target );
}

cmg.services.address.CardService.prototype.initUpdateForm = function( collection, card, data ) {
	
	var self		= this;
	var source 		= document.getElementById( 'updateAddressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var target = collection.find( '.address-form-wrap' );

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

	target.find( '.address-select' ).val( data.type );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', target );
	cmt.api.utils.request.registerTargetApp( 'location', target );

	// Custom Select
	target.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	collection.find( '.btn-close-form' ).click( function() {

		target.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( target );
	
	// City Listener
	this.clearCity( target );

	this.refreshProvinces( target, province.attr( 'pid' ) );
	this.refreshRegions( target, region.attr( 'rid' ) );
}

cmg.services.address.CardService.prototype.append = function( collection, data ) {

	var source 		= document.getElementById( 'addressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var cardsWrap	= collection.find( '.address-cards' );

	cardsWrap.append( output );

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), cardsWrap.find( '[cmt-app=address]' ) );

	// Clear Form
	collection.find( '.address-form-wrap' ).slideUp( 'slow' );
}

cmg.services.address.CardService.prototype.refresh = function( collection, card, data ) {

	var source 		= document.getElementById( 'refreshAddressCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	//var cardsWrap	= collection.find( '.address-cards' );

	card.html( output );

	// Init Request
	cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), card.find( '[cmt-app=address]' ) );

	// Clear Form and Image
	collection.find( '.address-form-wrap' ).slideUp( 'slow' );
}

cmg.services.address.CardService.prototype.remove = function( collection, card ) {

	// Remove Card
	card.remove();
}

cmg.services.address.CardService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.address-country' ).attr( 'province', provinceId );

	target.find( '.address-country' ).closest( '.wrap-country' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.services.address.CardService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.address-province' ).attr( 'region', regionId );

	target.find( '.address-province' ).closest( '.wrap-province' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.services.address.CardService.prototype.clearCity = function( target ) {

	target.find( '.address-province, .address-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.frm-address' ).find( '.city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}
	
cmg.services.address.CardService.prototype.refreshGoogleMap = function( target ) {

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
