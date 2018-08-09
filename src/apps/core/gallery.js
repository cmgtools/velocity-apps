// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'gallery', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'gallery', 'cmg.controllers.gallery.GalleryController' );

	// Map Services
	app.mapService( 'gallery', 'cmg.services.gallery.GalleryService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=gallery]' ) );
	
	// Event Listeners
	app.getService( 'gallery' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.gallery = cmg.controllers.gallery || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.gallery = cmg.services.gallery || {};

// == Gallery Controller ==================

cmg.controllers.gallery.GalleryController = function() {};

cmg.controllers.gallery.GalleryController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.gallery.GalleryController.prototype.getItemActionSuccess = function( requestElement, response ) {
	
	var card = requestElement.closest( '.card-gallery' );

	cmt.api.root.getApplication( 'gallery' ).getService( 'gallery' ).refresh( '#data-crud-gallery', card, response.data );
};

cmg.controllers.gallery.GalleryController.prototype.createItemActionSuccess = function( requestElement, response ) {

	requestElement.closest( '.gallery-uploader' ).find( '.file-data' ).html();
	
	cmt.api.root.getApplication( 'gallery' ).getService( 'gallery' ).append( response.data );
};

cmg.controllers.gallery.GalleryController.prototype.updateItemActionSuccess = function( requestElement, response ) {
	
	var card = jQuery( '#card-gallery-' + response.data.id );

	card.find( '.title' ).html( response.data.title );
	card.find( '.card-data img' ).attr( 'src', response.data.thumbUrl );

	cmt.api.root.getApplication( 'gallery' ).getService( 'gallery' ).add( '#data-crud-gallery' );
};

cmg.controllers.gallery.GalleryController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	jQuery( '#card-gallery-' + response.data ).remove();
};

// == Gallery Service =====================

cmg.services.gallery.GalleryService = function() {};

cmg.services.gallery.GalleryService.inherits( cmt.api.services.BaseService );

cmg.services.gallery.GalleryService.prototype.initListeners = function() {

	if( jQuery( '#data-crud-gallery' ).length > 0 ) {
		
		this.add( '#data-crud-gallery' );
	}
}

cmg.services.gallery.GalleryService.prototype.add = function( target ) {

	var source 		= document.getElementById( 'addGalleryItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var target = jQuery( target ).find( '.gallery-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', target );

	// Init Uploader
	target.find( '.gallery-uploader' ).cmtFileUploader();
}

cmg.services.gallery.GalleryService.prototype.refresh = function( target, card, data ) {
	
	var self		= this;
	var source 		= document.getElementById( 'updateGalleryItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var target = jQuery( target ).find( '.gallery-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Copy image data
	target.find( '.file-data' ).html( card.find( '.card-data' ).html() );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', target );
	
	// Init Uploader
	target.find( '.gallery-uploader' ).cmtFileUploader();

	// Init Listeners
	jQuery( '.gallery-form-clear' ).click( function() {

		self.add( '#data-crud-gallery' );
	});
}

cmg.services.gallery.GalleryService.prototype.append = function( data ) {

	var source 		= document.getElementById( 'galleryItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var itemsWrap	= jQuery( '.gallery-cards' );

	itemsWrap.append( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', itemsWrap.find( '.card-gallery' ).last() );
}

// == Direct Calls ========================

// == Additional Methods ==================
