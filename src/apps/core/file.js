// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'file', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'crud', 'cmg.controllers.file.CrudController' );

	// Map Services
	app.mapService( 'crud', 'cmg.services.file.CrudService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=file]' ) );

	// Event Listeners
	app.getService( 'crud' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.file = cmg.controllers.file || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.file = cmg.services.file || {};

// == Mapper Controller ===================

cmg.controllers.file.CrudController = function() {};

cmg.controllers.file.CrudController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.file.CrudController.prototype.assignActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.controllers.file.CrudController.prototype.clearActionSuccess = function( requestElement, response ) {

	var uploader	= requestElement.closest( '.file-uploader' );
	var type		= uploader.attr( 'type' );

	// Update Uploader
	switch( type ) {
		
		case 'image': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-image"></i>' );
			
			break;
		}
		case 'video': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-video"></i>' );
			
			break;
		}
		case 'compressed': {

			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-archive"></i>' );
			
			break;
		}
		default: {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="icon cmti cmti-5x cmti-file"></i>' );
			
			break;
		}
	}

	uploader.find( '.file-clear' ).hide();
};

// == Mapper Service ======================

cmg.services.file.CrudService = function() {};

cmg.services.file.CrudService.inherits( cmt.api.services.BaseService );

cmg.services.file.CrudService.prototype.initListeners = function() {

	var self = this;
}

// == Direct Calls ========================

// == Additional Methods ==================
