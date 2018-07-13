// == Application =========================

jQuery( document ).ready( function() {

	cmt.api.root.registerApplication( 'notify', 'cmt.api.Application', { basePath: ajaxUrl } );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.notify = cmg.controllers.notify || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.notify = cmg.services.notify || {};

// == Direct Calls ========================

// == Additional Methods ==================
