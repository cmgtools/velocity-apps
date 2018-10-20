// == Application =========================

jQuery( document ).ready( function() {
	
	// Register App
	cmt.api.root.registerApplication( 'bank', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=bank]' ) );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.bank = cmg.bank || {};

// == Controller Namespace ================

cmg.bank.controllers = cmg.bank.controllers || {};

// == Service Namespace ===================

cmg.bank.services = cmg.bank.services || {};

// == Additional Methods ==================
