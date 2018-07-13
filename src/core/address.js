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
