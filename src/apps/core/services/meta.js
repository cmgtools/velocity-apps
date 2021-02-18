// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'meta', 'cmg.core.services.MetaService' );

	// Event Listeners
	app.getService( 'meta' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of model attributes.

.cmt-meta-crud {

	.cmt-meta-add {
		// Trigger to show the model form
	}

	.cmt-meta-form {
		// The form container to add/update model

		.cmt-meta-close {
			// Hides the add/update form
		}
	}

	.cmt-meta-collection {
		// Collection of existing models

		.cmt-meta {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model

			.cmt-meta-header {
				// Header

				.btn-edit {
					// Copy meta values and show update popup
				}

				.btn-delete {
					// Copy meta values and show delete popup
				}
			}

			.cmt-meta-data {
				// Data
			}
		}
	}
}
*/

// == Meta Service ========================

cmg.core.services.MetaService = function() {

	this.addTemplate		= 'addMetaTemplate';
	this.updateTemplate		= 'updateMetaTemplate';
	this.viewTemplate		= 'metaViewTemplate';
	this.refreshTemplate	= 'metaRefreshTemplate';
};

cmg.core.services.MetaService.inherits( cmt.api.services.BaseService );

cmg.core.services.MetaService.prototype.initListeners = function() {

	var self = this;

	var containers = jQuery( '.cmt-meta-crud' );

	if( containers.length == 0 ) {

		return;
	}

	containers.each( function() {

		var container	= jQuery( this );
		var layout		= container.attr( 'data-layout' );

		switch( layout ) {

			case 'popup': {

				self.initPopups( container );

				break;
			}
			default: {

				container.find( '.cmt-meta-add' ).click( function() {

					self.initAddForm( container );
				});
			}
		}
	});
}

cmg.core.services.MetaService.prototype.initPopups = function( container ) {

	container.find(  '.cmt-meta-add' ).click( function() {

		jQuery( '#popup-attribute-add .message' ).hide();
		jQuery( '#popup-attribute-add .error' ).html( '' );

		showPopup( '#popup-attribute-add' );

		cmt.utils.data.bindEditor( '#popup-attribute-add .late-editor' );
	});

	this.initPopupTriggers( container.find( '.cmt-meta' ) );
}

cmg.core.services.MetaService.prototype.initPopupTriggers = function( meta ) {

	var self = this;

	meta.find( '.btn-edit' ).click( function() {

		jQuery( '#popup-attribute-update .message' ).hide();
		jQuery( '#popup-attribute-update .error' ).html( '' );

		showPopup( '#popup-attribute-update' );

		self.copyData( jQuery( this ).closest( '.cmt-meta' ), '#popup-attribute-update' );

		cmt.utils.data.bindEditor( '#popup-attribute-update .late-editor' );
	});

	meta.find( '.btn-delete' ).click( function() {

		showPopup( '#popup-attribute-delete' );

		self.copyData( jQuery( this ).closest( '.cmt-meta' ), '#popup-attribute-delete' );

		cmt.utils.data.bindEditor( '#popup-attribute-delete .late-editor' );
	});
}

cmg.core.services.MetaService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-meta-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Listeners
	form.find( '.cmt-meta-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.MetaService.prototype.initUpdateForm = function( container, meta, data ) {

	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-meta-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Listeners
	form.find( '.cmt-meta-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.MetaService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-meta-collection' );
	var layout		= container.attr( 'data-layout' );

	// Add at first
	collection.prepend( output );

	var meta = collection.find( '.cmt-meta' ).first();

	switch( layout ) {

		case 'popup': {

			closePopup( '#popup-attribute-add' );

			this.initPopupTriggers( meta );

			// Init Scroller
			meta.find( '.cscroller' ).mCustomScrollbar( { autoHideScrollbar: true } );

			break;
		}
		default: {

			// Init Request
			cmt.api.utils.request.registerTargetApp( 'core', meta );

			// Init Actions
			cmt.utils.ui.initActionsElement( meta.find( '.cmt-actions' ) );

			// Hide Form
			container.find( '.cmt-meta-form' ).slideUp( 'slow' );
		}
	}
}

cmg.core.services.MetaService.prototype.refresh = function( container, meta, data ) {

	var layout = container.attr( 'data-layout' );

	switch( layout ) {

		case 'popup': {

			meta.find( '.title' ).html( data.name );
			meta.find( '.cmt-meta-data .mCSB_container' ).html( data.value );

			closePopup( '#popup-attribute-update' );

			break;
		}
		default: {

			var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
			var template 	= Handlebars.compile( source );
			var output 		= template( data );

			meta.find( '.cmt-meta-header .title' ).html( data.title );
			meta.find( '.cmt-meta-data' ).replaceWith( output );

			// Hide Form
			container.find( '.cmt-meta-form' ).slideUp( 'slow' );
		}
	}
}

cmg.core.services.MetaService.prototype.remove = function( container, meta ) {

	var actions = meta.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove meta
	switch( container.attr( 'data-layout' ) ) {

		case 'popup': {

			meta.remove();

			closePopup( '#popup-attribute-delete' );

			break;
		}
		default: {

			meta.remove();
		}
	}
}

cmg.core.services.MetaService.prototype.copyData = function( meta, selector ) {

	var id		= meta.attr( 'data-id' );
	var name	= meta.find( '.title' ).html();
	var value	= meta.find( '.cmt-meta-data .mCSB_container' ).html();

	// Reset Form
	var form = jQuery( selector ).find( 'form' );

	form.find( '.name' ).val( name.trim() );
	form.find( '.description' ).val( value.trim() );
	form.find( '.message.success' ).val();
	form.find( '.message.error' ).val();

	var url = cmt.utils.data.updateUriParam( form.attr( 'action' ), 'cid', id );

	form.attr( 'action', url );
}

cmg.core.services.MetaService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-meta-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData	= requestElement.closest( '.actions-list-data' );
		var popupData	= requestElement.closest( '.popup-content-wrap' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-meta-crud' );
		}

		if( popupData.length == 1 ) {

			var id		= popupData.attr( 'data-id' );
			var type	= popupData.attr( 'data-type' );

			container = jQuery( '.cmt-meta-crud[data-id=' + id + '][data-type=' + type + ']' );
		}
	}

	return container;
}

// == Additional Methods ==================
