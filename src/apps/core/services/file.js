// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'file', 'cmg.core.services.FileService' );

	// Event Listeners
	app.getService( 'file' ).initListeners();
});

// == File Service ========================

cmg.core.services.FileService = function() {};

cmg.core.services.FileService.inherits( cmt.api.services.BaseService );

cmg.core.services.FileService.prototype.initListeners = function() {

	var self = this;
}

cmg.core.services.FileService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-file-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-file-crud' );
		}
	}

	return container;
}

cmg.core.services.FileService.prototype.clear = function( uploader ) {

	var type = uploader.attr( 'type' );
	
	type = uploader.attr( 'directory' ) == 'avatar' ? 'avatar' : type;

	// Update Uploader
	switch( type ) {

		case 'avatar': {

			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-user"></i>' );

			break;
		}
		case 'image': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-image"></i>' );
			
			break;
		}
		case 'video': {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-file-video"></i>' );
			
			break;
		}
		case 'compressed': {

			uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-file-archive"></i>' );

			break;
		}
		default: {
			
			uploader.find( '.file-wrap .file-data' ).html( '<i class="icon cmti cmti-5x cmti-file"></i>' );
			
			break;
		}
	}

	uploader.find( '.id' ).val( '' );
	uploader.find( '.change' ).val( '' );
	uploader.find( '.name' ).val( '' );
	uploader.find( '.file-clear' ).hide();
	uploader.find( '.post-action' ).hide();
}

// == Additional Methods ==================
