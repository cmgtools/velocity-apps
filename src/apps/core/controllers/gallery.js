// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'galleryItem', 'cmg.core.gallery.controllers.ItemController' );
});

// == Controller Namespace ================

cmg.core.gallery.controllers = cmg.core.gallery.controllers || {};

// == Item Controller =====================

cmg.core.gallery.controllers.ItemController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'galleryItem' );
};

cmg.core.gallery.controllers.ItemController.inherits( cmt.api.controllers.RequestController );

cmg.core.gallery.controllers.ItemController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= requestElement.closest( '.cmt-gallery-item' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, item, response.data );
};

cmg.core.gallery.controllers.ItemController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.gallery.controllers.ItemController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.mid + ']' );

	this.modelService.refresh( container, item, response.data );
};

cmg.core.gallery.controllers.ItemController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.mid + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, item );
};

// == Direct Calls ========================

// == Additional Methods ==================
