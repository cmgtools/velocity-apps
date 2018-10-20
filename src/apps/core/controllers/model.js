// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'model', 'cmg.core.controllers.ModelController' );
});

// == Model Controller ====================

cmg.core.controllers.ModelController = function() {};

cmg.core.controllers.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.ModelController.prototype.getActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );	
	var model		= requestElement.closest( '.cmt-model' );

	// Show Update Form
	cmt.api.root.getApplication( 'base' ).getService( 'model' ).initUpdateForm( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.addActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );

	// Add Item to List
	cmt.api.root.getApplication( 'base' ).getService( 'model' ).add( container, response.data );
};

cmg.core.controllers.ModelController.prototype.updateActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'base' ).getService( 'model' ).refresh( container, model, response.data );
};

cmg.core.controllers.ModelController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'base' ).getService( 'model' ).remove( container, model );
};

// == Direct Calls ========================

// == Additional Methods ==================
