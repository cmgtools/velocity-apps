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
