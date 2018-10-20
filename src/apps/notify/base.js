// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'notify', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=notify]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.notify = cmg.notify || {};

// == Controller Namespace ================

cmg.notify.controllers = cmg.notify.controllers || {};

// == Service Namespace ===================

cmg.notify.services = cmg.notify.services || {};

// == Additional Methods ==================
