// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'gallery', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'card', 'cmg.controllers.gallery.CardController' );

	// Map Services
	app.mapService( 'card', 'cmg.services.gallery.CardService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=gallery]' ) );

	// Event Listeners
	app.getService( 'card' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.gallery = cmg.controllers.gallery || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.gallery = cmg.services.gallery || {};

// == Card Controller =====================

cmg.controllers.gallery.CardController = function() {};

cmg.controllers.gallery.CardController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.gallery.CardController.prototype.getItemActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-gallery-card' );
	var card		= requestElement.closest( '.card-gallery-item' );

	// Show Update Item Form
	cmt.api.root.getApplication( 'gallery' ).getService( 'card' ).initUpdateItemForm( collection, card, response.data );
};

cmg.controllers.gallery.CardController.prototype.createItemActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-gallery-card' );

	// Add Card Item to List
	cmt.api.root.getApplication( 'gallery' ).getService( 'card' ).appendItem( collection, response.data );
};

cmg.controllers.gallery.CardController.prototype.updateItemActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-gallery-card' );
	var card		= collection.find( '.card-gallery-item[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'gallery' ).getService( 'card' ).refreshItem( collection, card, response.data );
};

cmg.controllers.gallery.CardController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	var collection	= requestElement.closest( '.data-crud-gallery-card' );
	var card		= requestElement.closest( '.card-gallery-item' );

	cmt.api.root.getApplication( 'gallery' ).getService( 'card' ).removeItem( collection, card );
};

// == Card Service ========================

cmg.services.gallery.CardService = function() {};

cmg.services.gallery.CardService.inherits( cmt.api.services.BaseService );

cmg.services.gallery.CardService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.btn-add-gallery-card' ).length == 0 ) {

		return;
	}

	jQuery( '.btn-add-gallery-card' ).click( function() {

		var collection = jQuery( this ).closest( '.data-crud-gallery-card' );

		self.initAddItemForm( collection );
	});
}

cmg.services.gallery.CardService.prototype.initAddItemForm = function( collection ) {

	var source 		= document.getElementById( 'addGalleryCardItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var target = collection.find( '.gallery-form-wrap' );

	target.hide();

	target.html( output );

	target.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', target );

	// Init Uploader
	target.find( '.gallery-uploader' ).cmtFileUploader();
	
	// Init Listeners
	collection.find( '.btn-close-form' ).click( function() {

		target.fadeOut( 'fast' );
	});
}

cmg.services.gallery.CardService.prototype.initUpdateItemForm = function( collection, card, data ) {

	var self		= this;
	var source 		= document.getElementById( 'updateGalleryCardItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var target = collection.find( '.gallery-form-wrap' );

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
	collection.find( '.btn-close-form' ).click( function() {

		target.fadeOut( 'fast' );
	});
}

cmg.services.gallery.CardService.prototype.appendItem = function( collection, data ) {

	var source 		= document.getElementById( 'galleryCardItemTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var cardsWrap	= collection.find( '.gallery-cards' );

	cardsWrap.append( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'gallery', cardsWrap.find( '.card-gallery-item' ).last() );

	// Clear Form and Image
	collection.find( '.gallery-uploader .file-data' ).html( '' );
	collection.find( '.gallery-form-wrap' ).slideUp( 'slow' );
}

cmg.services.gallery.CardService.prototype.refreshItem = function( collection, card, data ) {

	// Update Card Item
	card.find( '.title' ).html( data.title );
	card.find( '.card-data img' ).attr( 'src', data.thumbUrl );

	// Clear Form and Image
	collection.find( '.gallery-uploader .file-data' ).html( '' );
	collection.find( '.gallery-form-wrap' ).slideUp( 'slow' );
}

cmg.services.gallery.CardService.prototype.removeItem = function( collection, card ) {

	// Remove Card Item
	card.remove();
}

// == Direct Calls ========================

// == Additional Methods ==================
