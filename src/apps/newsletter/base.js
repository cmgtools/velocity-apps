// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'newsletter', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=newsletter]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.newsletter = cmg.newsletter || {};

// == Controller Namespace ================

cmg.newsletter.controllers = cmg.newsletter.controllers || {};

// == Service Namespace ===================

cmg.newsletter.services = cmg.newsletter.services || {};

// == Additional Methods ==================
