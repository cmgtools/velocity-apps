// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'grid', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'crud', 'cmg.controllers.grid.CrudController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=grid]' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.grid = cmg.controllers.grid || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.grid = cmg.services.grid || {};

// == CRUD Controller =====================

cmg.controllers.grid.CrudController = function() {};

cmg.controllers.grid.CrudController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.grid.CrudController.prototype.bulkActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.bulkActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

cmg.controllers.grid.CrudController.prototype.genericActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.genericActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

cmg.controllers.grid.CrudController.prototype.deleteActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.deleteActionFailure = function( requestElement, response ) {

	alert( 'Failed to process your request.' );
};

cmg.controllers.grid.CrudController.prototype.pageActionSuccess = function( requestElement, response ) {

	cmt.utils.data.refreshGrid();
};

cmg.controllers.grid.CrudController.prototype.pageActionFailure = function( requestElement, response ) {

	alert( 'Failed to load the page.' );
};

// == Direct Calls ========================

// == Additional Methods ==================
