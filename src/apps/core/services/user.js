// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'user', 'cmg.core.services.UserService' );

	// Event Listeners
	app.getService( 'user' ).initListeners();
});

// == User Service ========================

cmg.core.services.UserService = function() {};

cmg.core.services.UserService.inherits( cmt.api.services.BaseService );

cmg.core.services.UserService.prototype.initListeners = function() {

	// Init User Service
}

// == Additional Methods ==================
