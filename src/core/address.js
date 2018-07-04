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
