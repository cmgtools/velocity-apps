// == Application =========================

jQuery( document ).ready( function() {
	
	// Register App
	var app = cmt.api.root.registerApplication( 'forms', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=forms]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.forms = cmg.forms || {};

// == Controller Namespace ================

cmg.forms.controllers = cmg.forms.controllers || {};

// == Service Namespace ===================

cmg.forms.services = cmg.forms.services || {};

// == Additional Methods ==================
