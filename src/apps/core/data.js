// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'data', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'custom', 'cmg.controllers.data.CustomController' );

	// Map Services
	app.mapService( 'custom', 'cmg.services.data.CustomService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=data]' ) );

	// Event Listeners
	app.getService( 'custom' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.data = cmg.controllers.data || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.data = cmg.services.data || {};

// == Custom Controller ===================

cmg.controllers.data.CustomController = function() {};

cmg.controllers.data.CustomController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.data.CustomController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.data-custom' );

	return true;
}

cmg.controllers.data.CustomController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var customService = cmt.api.root.getApplication( 'data' ).getService( 'custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	customService.refresh( requestElement.closest( '.data-custom' ), response.data );
}

cmg.controllers.data.CustomController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.data-custom' );

	return true;
}

cmg.controllers.data.CustomController.prototype.updateActionSuccess = function( requestElement, response ) {
	
	var customService = cmt.api.root.getApplication( 'data' ).getService( 'custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Link
	customService.refresh( requestElement.closest( '.data-custom' ), response.data );
}

cmg.controllers.data.CustomController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.data-custom' );

	return true;
}

cmg.controllers.data.CustomController.prototype.deleteActionSuccess = function( requestElement, response ) {

	requestElement.closest( '.data-custom' ).remove();
}

// == Custom Service ======================

cmg.services.data.CustomService = function() {};

cmg.services.data.CustomService.inherits( cmt.api.services.BaseService );

cmg.services.data.CustomService.prototype.initListeners = function() {
	
	var self		= this;
	var triggers	= jQuery( '.btn-custom-data-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var target	= jQuery( this ).closest( '.data-custom-wrap' );

		self.add( target );
	});
}

cmg.services.data.CustomService.prototype.add = function( target ) {
	
	var key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	var source 		= document.getElementById( 'addCustomDataTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { key: key } );

	target.find( '.data-custom-all' ).append( output );

	// Find data
	var custom = target.find( '.data-custom' ).last();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', custom );

	// Init Listeners
	custom.find( '.btn-remove' ).click( function() {

		custom.remove();
	});
}

cmg.services.data.CustomService.prototype.refresh = function( custom, data ) {

	var source 		= document.getElementById( 'refreshCustomDataTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	custom.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', custom );
}

// == Direct Calls ========================

// == Additional Methods ==================
