// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'file', 'cmg.core.services.FileService' );

	// Event Listeners
	app.getService( 'file' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of model files.

.cmt-file-crud {

	.cmt-file-add {
		// Trigger to show the model form
	}

	.cmt-file-form {
		// The form container to add/update model

		.cmt-file-close {
			// Hides the add/update form
		}
	}

	.cmt-file-collection {
		// Collection of existing models

		.cmt-file {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model

			.cmt-file-header {
				// Header
			}

			.cmt-file-data {
				// Data
			}
		}
	}
}
*/

// == File Service ========================

cmg.core.services.FileService = function() {

	this.addTemplate		= 'addFileTemplate';
	this.updateTemplate		= 'updateFileTemplate';
	this.viewTemplate		= 'viewFileTemplate';
	this.refreshTemplate	= 'refreshFileTemplate';

	this.hiddenForm = true; // Keep form hidden when not in use
};

cmg.core.services.FileService.inherits( cmt.api.services.BaseService );

cmg.core.services.FileService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-file-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-file-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.FileService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-file-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Uploader
	form.find( '.cmt-file-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-file-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.FileService.prototype.initUpdateForm = function( container, item, data ) {

	var self = this;

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-file-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Copy file data
	form.find( '.file-data' ).html( item.find( '.cmt-file-data' ).html() );

	// Init Uploader
	form.find( '.cmt-file-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-file-close' ).click( function() {

		if( self.hiddenForm ) {

			form.fadeOut( 'fast' );
		}
		else {

			self.initAddForm( container );
		}
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.FileService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-file-collection' );

	// Add at first
	collection.prepend( output );

	var item = collection.find( '.cmt-file' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', item );

	// Init Actions
	cmt.utils.ui.initActionsElement( item.find( '.cmt-actions' ) );

	if( this.hiddenForm ) {

		container.find( '.cmt-file-form' ).fadeOut( 'fast' );
	}
	else {

		this.initAddForm( container );
	}
}

cmg.core.services.FileService.prototype.refresh = function( container, item, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	item.find( '.cmt-file-header .title' ).html( data.title );
	item.find( '.cmt-file-data' ).replaceWith( output );

	if( this.hiddenForm ) {

		container.find( '.cmt-file-form' ).fadeOut( 'fast' );
	}
	else {

		this.initAddForm( container );
	}
}

cmg.core.services.FileService.prototype.remove = function( container, item ) {

	var actions		= item.find( '.cmt-actions' );
	var collection	= container.find( '.cmt-file-collection' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	item.remove();
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
