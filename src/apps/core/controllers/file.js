// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'file', 'cmg.core.controllers.FileController' );
});

// == File Controller =====================

cmg.core.controllers.FileController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'file' );
};

cmg.core.controllers.FileController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.FileController.prototype.assignActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.cmt-file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.FileController.prototype.clearActionPre = function( requestElement ) {

	var uploader	= requestElement.closest( '.cmt-file-uploader' );
	var idElement	= uploader.find( '.id' );

	if( idElement.length > 0 && idElement.val().length > 0 && parseInt( idElement.val() ) > 0 ) {

		return true;
	}

	// Clear Form
	this.modelService.clear( uploader );

	return false;
};

cmg.core.controllers.FileController.prototype.clearActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.cmt-file-uploader' );

	// Clear Form
	this.modelService.clear( uploader );
};

cmg.core.controllers.FileController.prototype.clearActionFailure = function( requestElement, response ) {

	var uploader = requestElement.closest( '.cmt-file-uploader' );

	// Clear Form
	this.modelService.clear( uploader );
};

// == Mapper Calls ========================

cmg.core.controllers.FileController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= requestElement.closest( '.cmt-file' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	// Show Update Form
	this.modelService.initUpdateForm( container, item, response.data );
};

cmg.core.controllers.FileController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.FileController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-file[data-id=' + response.data.mid + ']' );

	this.modelService.refresh( container, item, response.data );
};

cmg.core.controllers.FileController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var item		= container.find( '.cmt-file[data-id=' + response.data.mid + ']' );

	// Hide Actions
	requestElement.closest( '.actions-list-data' ).slideUp( 'fast' );

	this.modelService.remove( container, item );
};

// == Direct Calls ========================

// == Additional Methods ==================
