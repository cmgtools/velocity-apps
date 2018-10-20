// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'org', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=org]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.org = cmg.org || {};

// == Controller Namespace ================

cmg.org.controllers = cmg.org.controllers || {};

// == Service Namespace ===================

cmg.org.services = cmg.org.services || {};

// == Additional Methods ==================
