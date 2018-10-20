// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'file', 'cmg.core.services.FileService' );

	// Event Listeners
	app.getService( 'file' ).initListeners();
});

// == File Service ========================

cmg.core.services.FileService = function() {};

cmg.core.services.FileService.inherits( cmt.api.services.BaseService );

cmg.core.services.FileService.prototype.initListeners = function() {

	var self = this;
}

// == Additional Methods ==================
