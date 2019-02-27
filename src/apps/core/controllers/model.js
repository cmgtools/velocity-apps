// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'model', 'cmg.core.controllers.ModelController' );
});

// == Model Controller ====================

cmg.core.controllers.ModelController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'model' );
};

cmg.core.controllers.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.ModelController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= requestElement.closest( '.cmt-model' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.ModelController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	this.modelService.refresh( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, model );
};

// == Direct Calls ========================

// == Additional Methods ==================
