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
