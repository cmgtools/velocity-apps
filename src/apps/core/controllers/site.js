// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'site', 'cmg.core.controllers.SiteController' );
});

// == Site Controller =====================

cmg.core.controllers.SiteController = function() {};

cmg.core.controllers.SiteController.inherits( cmt.api.controllers.RequestController );

// == Direct Calls ========================

// == Additional Methods ==================
