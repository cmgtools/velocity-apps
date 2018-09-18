// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'base', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'site', 'cmg.controllers.base.SiteController' );
	app.mapController( 'main', 'cmg.controllers.base.MainController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=base]' ) );

	// Register Service Triggers
	cmt.api.utils.request.registerServiceTriggers( jQuery( '.cmt-request' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.base = cmg.controllers.base || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.base = cmg.services.base || {};

// == Site Controller =====================

cmg.controllers.base.SiteController = function() {};

cmg.controllers.base.SiteController.inherits( cmt.api.controllers.RequestController );

// == Main Controller =====================

cmg.controllers.base.MainController = function() {};

cmg.controllers.base.MainController.inherits( cmt.api.controllers.RequestController );

// == Direct Calls ========================

// == Additional Methods ==================
