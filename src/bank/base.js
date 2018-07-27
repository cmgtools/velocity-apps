// == Application =========================

jQuery( document ).ready( function() {

	cmt.api.root.registerApplication( 'bank', 'cmt.api.Application', { basePath: ajaxUrl } );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.bank = cmg.controllers.bank || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.bank = cmg.services.bank || {};

// == Direct Calls ========================

// == Additional Methods ==================
