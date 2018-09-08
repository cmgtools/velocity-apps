// == Application =========================

jQuery( document ).ready( function() {
	
	// Register Service Triggers
	cmt.api.utils.request.registerServiceTriggers( jQuery( '.cmt-request' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

// == Direct Calls ========================

// == Additional Methods ==================
