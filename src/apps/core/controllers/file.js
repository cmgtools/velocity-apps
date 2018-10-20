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

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.FileController.prototype.clearActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Show Update Form
	this.modelService.clear( uploader );
};

cmg.core.controllers.FileController.prototype.clearActionFailure = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Show Update Form
	this.modelService.clear( uploader );
};

// == Direct Calls ========================

// == Additional Methods ==================
