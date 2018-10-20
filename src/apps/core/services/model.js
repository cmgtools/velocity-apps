// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'model', 'cmg.core.services.ModelService' );

	// Event Listeners
	app.getService( 'model' ).initListeners();
});

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

	if( jQuery( '.cmt-model-add' ).length == 0 ) {

		return;
	}

	jQuery( '.cmt-model-add' ).click( function() {

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

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'base', form );

	// Init Form Elements
	form.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
}

cmg.core.services.ModelService.prototype.initUpdateForm = function( container, model, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-model-form' );

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'base', form );

	// Init Form Elements
	form.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	form.find( '.cmt-model-close' ).click( function() {

		form.fadeOut( 'fast' );
	});
}

cmg.core.services.ModelService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-model-collection' );

	// Add at first
	collection.prepend( output );

	var model	= collection.find( '.cmt-model' ).first();
	var actions	= model.find( '.cmt-actions' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'base', model );

	// Actions
	actions.cmtActions();
	actions.find( '.cmt-auto-hide' ).cmtAutoHide();

	// Clear Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.refresh = function( container, model, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	model.find( '.cmt-model-header .title' ).html( data.title );
	model.find( '.cmt-model-data' ).replaceWith( output );

	// Clear Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.core.services.ModelService.prototype.remove = function( container, model ) {

	// Remove Actions
	var actions = model.find( '.cmt-actions' );

	if( actions.length > 0 ) {

		var index = actions.attr( 'data-id' );

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

			var identifier	= listData.attr( 'data-id' );
			var list		= jQuery( '#actions-list-' + identifier );
			
			container = list.closest( '.cmt-model-crud' );
		}
	}
	
	return container;
}

// == Additional Methods ==================
