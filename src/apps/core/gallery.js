// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'gallery', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'item', 'cmg.controllers.gallery.ItemController' );

	// Map Services
	app.mapService( 'item', 'cmg.services.gallery.ItemService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=gallery]' ) );

	// Event Listeners
	app.getService( 'item' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.gallery = cmg.controllers.gallery || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.gallery = cmg.services.gallery || {};

// == Item Controller =====================

cmg.controllers.gallery.ItemController = function() {};

cmg.controllers.gallery.ItemController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.gallery.ItemController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= requestElement.closest( '.cmt-gallery-item-crud' );
	var item		= requestElement.closest( '.cmt-gallery-item' );

	// Show Update Item Form
	cmt.api.root.getApplication( 'gallery' ).getService( 'item' ).initUpdateForm( container, item, response.data );
};

cmg.controllers.gallery.ItemController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = requestElement.closest( '.cmt-gallery-item-crud' );

	// Add Card Item to List
	cmt.api.root.getApplication( 'gallery' ).getService( 'item' ).add( container, response.data );
};

cmg.controllers.gallery.ItemController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= requestElement.closest( '.cmt-gallery-item-crud' );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'gallery' ).getService( 'item' ).refresh( container, item, response.data );
};

cmg.controllers.gallery.ItemController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= requestElement.closest( '.cmt-gallery-item-crud' );
	var item		= container.find( '.cmt-gallery-item[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'gallery' ).getService( 'item' ).remove( container, item );
};

// == Item Service ========================

cmg.services.gallery.ItemService = function() {

	this.addTemplate		= 'addItemTemplate';
	this.updateTemplate		= 'updateItemTemplate';
	this.viewTemplate		= 'itemViewTemplate';
	this.refreshTemplate	= 'itemRefreshTemplate';
};

cmg.services.gallery.ItemService.inherits( cmt.api.services.BaseService );

cmg.services.gallery.ItemService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.cmt-gallery-item-add' ).length == 0 ) {

		return;
	}

	jQuery( '.cmt-gallery-item-add' ).click( function() {

		var container = jQuery( this ).closest( '.cmt-gallery-item-crud' );

		self.initAddForm( container );
	});
}

cmg.services.gallery.ItemService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
	
	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', form );
}

cmg.services.gallery.ItemService.prototype.initUpdateForm = function( container, item, data ) {

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-gallery-item-form' );

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

	// Copy image data
	form.find( '.file-data' ).html( item.find( '.cmt-gallery-item-data' ).html() );

	// Init Uploader
	form.find( '.cmt-gallery-item-uploader' ).cmtFileUploader();

	// Init Listeners
	form.find( '.cmt-gallery-item-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
	
	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', form );
}

cmg.services.gallery.ItemService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-gallery-item-collection' );

	// Add at first
	switch( container.attr( 'ldata-layout' ) ) {

		case 'cmt-gallery': {

			collection.cmtSlider( 'addSlide', output );

			break;
		}
		default: {

			collection.prepend( output );
		}
	}

	var item = collection.find( '.cmt-gallery-item' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', item );

	// Clear Form and Image
	container.find( '.cmt-gallery-item-uploader .file-data' ).html( '' );
	container.find( '.cmt-gallery-item-form' ).slideUp( 'slow' );
}

cmg.services.gallery.ItemService.prototype.refresh = function( container, item, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	item.find( '.cmt-gallery-item-header .title' ).html( data.title );
	item.find( '.cmt-gallery-item-data' ).replaceWith( output );

	// Clear Form and Image
	container.find( '.cmt-gallery-item-uploader .file-data' ).html( '' );
	container.find( '.cmt-gallery-item-form' ).slideUp( 'slow' );
}

cmg.services.gallery.ItemService.prototype.remove = function( container, item ) {

	var collection = container.find( '.cmt-gallery-item-collection' );

	// Add at first
	switch( container.attr( 'ldata-layout' ) ) {

		case 'cmt-gallery': {

			collection.cmtSlider( 'removeSlide', parseInt( item.attr( 'ldata-id' ) ) );

			break;
		}
		default: {

			item.remove();
		}
	}
}

// == Direct Calls ========================

// == Additional Methods ==================
