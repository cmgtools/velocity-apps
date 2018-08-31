// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'meta', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'card', 'cmg.controllers.meta.CardController' );

	// Map Services
	app.mapService( 'card', 'cmg.services.meta.CardService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=meta]' ) );

	// Event Listeners
	app.getService( 'card' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.meta = cmg.controllers.meta || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.meta = cmg.services.meta || {};

// == Card Controller =====================

cmg.controllers.meta.CardController = function() {};

cmg.controllers.meta.CardController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.meta.CardController.prototype.addActionSuccess = function( requestElement, response ) {

	var source 		= document.getElementById( 'attributeCardTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( response.data );

	jQuery( '.data-crud-attribute-card .attribute-cards' ).append( output );

	var card = jQuery( '.data-crud-attribute-card .card-attribute' ).last();

	cmt.api.root.getApplication( 'meta' ).getService( 'card' ).initCard( card );

	closePopup( '#popup-attribute-add' );
}

cmg.controllers.meta.CardController.prototype.updateActionSuccess = function( requestElement, response ) {

	var card = jQuery( '.data-crud-attribute-card .card-attribute[data-id=' + response.data.id + ']' );

	card.find( '.title' ).html( response.data.name );
	card.find( '.card-data .mCSB_container' ).html( response.data.value );

	closePopup( '#popup-attribute-update' );
}

cmg.controllers.meta.CardController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var card = jQuery( '.data-crud-attribute-card .card-attribute[data-id=' + response.data.id + ']' );

	card.remove();

	closePopup( '#popup-attribute-delete' );
}

// == Address Service =====================

cmg.services.meta.CardService = function() {};

cmg.services.meta.CardService.inherits( cmt.api.services.BaseService );

cmg.services.meta.CardService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.btn-add-attribute-card' ).length == 0 ) {

		return;
	}

	jQuery( '.btn-add-attribute-card' ).click( function() {

		showPopup( '#popup-attribute-add' );

		cmt.utils.data.bindEditor( '#popup-attribute-add .late-editor' );
	});

	jQuery( '.data-crud-attribute-card .card-attribute .btn-edit' ).click( function() {

		showPopup( '#popup-attribute-update' );

		self.copyCardData( jQuery( this ).closest( '.card-attribute' ), '#popup-attribute-update' );
		
		cmt.utils.data.bindEditor( '#popup-attribute-update .late-editor' );
	});

	jQuery( '.data-crud-attribute-card .card-attribute .btn-delete' ).click( function() {

		showPopup( '#popup-attribute-delete' );
		
		self.copyCardData( jQuery( this ).closest( '.card-attribute' ), '#popup-attribute-delete' );
		
		cmt.utils.data.bindEditor( '#popup-attribute-delete .late-editor' );
	});
}

cmg.services.meta.CardService.prototype.initCard = function( card ) {

	var self = this;
	
	card.find( '.btn-edit' ).click( function() {

		showPopup( '#popup-attribute-update' );

		self.copyCardData( card, '#popup-attribute-update' );

		cmt.utils.data.bindEditor( '#popup-attribute-update .late-editor' );
	});

	card.find( '.btn-delete' ).click( function() {

		showPopup( '#popup-attribute-delete' );
		
		self.copyCardData( card, '#popup-attribute-delete' );

		cmt.utils.data.bindEditor( '#popup-attribute-delete .late-editor' );
	});
	
	// Reset Scroller
	card.find( '.cscroller' ).mCustomScrollbar( { autoHideScrollbar: true } );
}

cmg.services.meta.CardService.prototype.copyCardData = function( card, selector ) {

	var id		= card.attr( 'data-id' );
	var name	= card.find( '.title' ).html();
	var value	= card.find( '.card-data .mCSB_container' ).html();
	
	// Reset Form
	var form = jQuery( selector ).find( 'form' );

	form.find( '.name' ).val( name );
	form.find( '.description' ).val( value );
	form.find( '.message.success' ).val();
	form.find( '.message.error' ).val();

	var url = cmt.utils.data.updateUriParam( form.attr( 'action' ), 'cid', id );

	form.attr( 'action', url );
}

// == Direct Calls ========================

// == Additional Methods ==================
