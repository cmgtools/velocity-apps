// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'file', 'cmg.core.controllers.FileController' );
});

// == File Controller =====================

cmg.core.controllers.FileController = function() {};

cmg.core.controllers.FileController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.FileController.prototype.assignActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.FileController.prototype.clearActionSuccess = function( requestElement, response ) {

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
	uploader.find( '.post-action' ).hide();
};

// == Direct Calls ========================

// == Additional Methods ==================
