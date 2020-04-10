// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app = cmt.api.root.registerApplication( 'identity', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=identity]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.identity = cmg.identity || {};

// == Controller Namespace ================

cmg.identity.controllers = cmg.identity.controllers || {};

// == Service Namespace ===================

cmg.identity.services = cmg.identity.services || {};

// == Additional Methods ==================
