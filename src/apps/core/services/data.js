// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'customData', 'cmg.core.data.services.CustomService' );

	// Event Listeners
	app.getService( 'customData' ).initListeners();
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.core = cmg.core || {};

cmg.core.data = cmg.core.data || {};

// == Service Namespace ===================

cmg.core.data.services = cmg.core.data.services || {};

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

// == Custom Service ======================

cmg.core.data.services.CustomService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addCustomDataTemplate';
	this.refreshTemplate	= 'refreshCustomDataTemplate';
};

cmg.core.data.services.CustomService.inherits( cmt.api.services.BaseService );

cmg.core.data.services.CustomService.prototype.initListeners = function() {

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

cmg.core.data.services.CustomService.prototype.initAddForm = function( container ) {

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

cmg.core.data.services.CustomService.prototype.refresh = function( container, custom, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	custom.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', custom );
}

cmg.core.data.services.CustomService.prototype.remove = function( container, custom ) {

	var actions = custom.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Data
	custom.remove();
}

cmg.core.data.services.CustomService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-data-custom-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-data-custom-crud' );
		}
	}

	return container;
}

// == Additional Methods ==================
