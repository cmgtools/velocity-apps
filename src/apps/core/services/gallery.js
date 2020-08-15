// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'galleryItem', 'cmg.core.gallery.services.ItemService' );

	// Event Listeners
	app.getService( 'galleryItem' ).initListeners();
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.core = cmg.core || {};

cmg.core.gallery = cmg.core.gallery || {};

// == Service Namespace ===================

cmg.core.gallery.services = cmg.core.gallery.services || {};

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of gallery items.

.cmt-gallery-item-crud {

	.cmt-gallery-item-add {
		// Trigger to show the model form
	}

	.cmt-gallery-item-form {
		// The form container to add/update model

		.cmt-gallery-item-close {
			// Hides the add/update form
		}
	}

	.cmt-gallery-item-collection {
		// Collection of existing models

		.cmt-gallery-item {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model

			.cmt-gallery-item-header {
				// Header
			}

			.cmt-gallery-item-data {
				// Data
			}
		}
	}
}
*/

// == Item Service ========================

cmg.core.gallery.services.ItemService = function() {

	this.addTemplate		= 'addItemTemplate';
	this.updateTemplate		= 'updateItemTemplate';
	this.viewTemplate		= 'itemViewTemplate';
	this.refreshTemplate	= 'itemRefreshTemplate';

	this.hiddenForm = true; // Keep form hidden when not in use
};

cmg.core.gallery.services.ItemService.inherits( cmt.api.services.BaseService );

cmg.core.gallery.services.ItemService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-gallery-item-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-gallery-item-crud' );

		self.initAddForm( container );
	});
}

cmg.core.gallery.services.ItemService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Init Texture Picker
	form.find( '.icon-picker-wrap' ).cmtIconPicker();

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.gallery.services.ItemService.prototype.initUpdateForm = function( container, item, data ) {

	var self = this;

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Copy image data
	form.find( '.file-data' ).html( item.find( '.cmt-gallery-item-data' ).html() );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		if( self.hiddenForm ) {

			form.fadeOut( 'fast' );
		}
		else {

			self.initAddForm( container );
		}
	});

	// Init Texture Picker
	form.find( '.icon-picker-wrap' ).cmtIconPicker();

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.gallery.services.ItemService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-gallery-item-collection' );
	var item		= null;
	var layout		= cmt.utils.data.hasAttribute( container, 'data-layout' ) ? container.attr( 'data-layout' ) : null;

	// Add at first
	switch( layout ) {

		case 'cmt-layout-slider': {

			collection.cmtSlider( 'addSlide', output );

			item = collection.find( '.cmt-gallery-item[data-idx=0]' );

			break;
		}
		default: {

			collection.prepend( output );

			item = collection.find( '.cmt-gallery-item' ).first();
		}
	}

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', item );

	// Init Actions
	cmt.utils.ui.initActionsElement( item.find( '.cmt-actions' ) );

	if( this.hiddenForm ) {

		container.find( '.cmt-gallery-item-form' ).fadeOut( 'fast' );
	}
	else {

		this.initAddForm( container );
	}
}

cmg.core.gallery.services.ItemService.prototype.refresh = function( container, item, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	item.find( '.cmt-gallery-item-header .title' ).html( data.title );
	item.find( '.cmt-gallery-item-data' ).replaceWith( output );

	if( this.hiddenForm ) {

		container.find( '.cmt-gallery-item-form' ).fadeOut( 'fast' );
	}
	else {

		this.initAddForm( container );
	}
}

cmg.core.gallery.services.ItemService.prototype.remove = function( container, item ) {

	var actions		= item.find( '.cmt-actions' );
	var collection	= container.find( '.cmt-gallery-item-collection' );
	var layout		= cmt.utils.data.hasAttribute( container, 'data-layout' ) ? container.attr( 'data-layout' ) : null;

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	switch( layout ) {

		case 'cmt-layout-slider': {

			collection.cmtSlider( 'removeSlide', parseInt( item.attr( 'data-idx' ) ) );

			break;
		}
		default: {

			item.remove();
		}
	}
}

cmg.core.gallery.services.ItemService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-gallery-item-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-gallery-item-crud' );
		}
	}

	return container;
}

// == Additional Methods ==================
