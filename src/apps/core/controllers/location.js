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
