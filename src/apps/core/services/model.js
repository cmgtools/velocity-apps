// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'model', 'cmg.core.services.ModelService' );

	// Event Listeners
	app.getService( 'model' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of models.

.cmt-model-crud {

	.cmt-model-add {
		// Trigger to show the address form
	}

	.cmt-model-form {
		// The form container to add/update model

		.cmt-model-close {
			// Hides the add/update form
		}
	}

	.cmt-model-collection {
		// Collection of existing models

		.cmt-model {
			// Renders all the models either using PHP or viewTemplate by making call to get models and iterating the result set
			// Renders the model using viewTemplate after adding an model
			// Refresh and partial render the model using refreshTemplate after updating an model
		}
	}
}
*/

// == Model Service =======================

cmg.core.services.ModelService = function() {

	this.addTemplate		= 'addModelTemplate';
	this.updateTemplate		= 'updateModelTemplate';
	this.viewTemplate		= 'modelViewTemplate';
	this.refreshTemplate	= 'modelRefreshTemplate';
};

cmg.core.services.ModelService.inherits( cmt.api.services.BaseService );

cmg.core.services.ModelService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-model-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-model-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.ModelService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-model-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.ModelService.prototype.initUpdateForm = function( container, model, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-model-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.ModelService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-model-collection' );

	// Add at first
	collection.prepend( output );

	var model = collection.find( '.cmt-model' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', model );

	// Init Actions
	cmt.utils.ui.initActionsElement( model.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.refresh = function( container, model, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	model.find( '.cmt-model-header .title' ).html( data.title );
	model.find( '.cmt-model-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.remove = function( container, model ) {

	var actions = model.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	model.remove();
}

cmg.core.services.ModelService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-model-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier	= listData.attr( 'ldata-id' );
			var list		= jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-model-crud' );
		}
	}
	
	return container;
}

// == Additional Methods ==================
