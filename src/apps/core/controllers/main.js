// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'main', 'cmg.core.controllers.MainController' );
});

// == Main Controller =====================

cmg.core.controllers.MainController = function() {};

cmg.core.controllers.MainController.inherits( cmt.api.controllers.RequestController );

// == Direct Calls ========================

// == Additional Methods ==================
