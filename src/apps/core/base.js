// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'core', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=core]' ) );

	// Register Service Triggers
	//cmt.api.utils.request.registerServiceTriggers( jQuery( '.cmt-request' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.core = cmg.core || {};

cmg.logger = cmg.logger || {};

// == Controller Namespace ================

cmg.core.controllers = cmg.core.controllers || {};

// == Service Namespace ===================

cmg.core.services = cmg.core.services || {};

// == Settings ============================

cmg.log = true;

// == Direct Calls ========================

// == Additional Methods ==================

cmg.logger.log = function( message ) {

	if( cmg.log ) {

		console.log( message );
	}
}
