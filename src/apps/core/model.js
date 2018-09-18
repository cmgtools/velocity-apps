// == Application =========================

jQuery( document ).ready( function() {

	// Base App
	var app	= cmt.api.root.getApplication( 'base' );

	// Map Controllers
	app.mapController( 'model', 'cmg.controllers.base.ModelController' );

	// Map Services
	app.mapService( 'model', 'cmg.services.base.ModelService' );

	// Event Listeners
	app.getService( 'model' ).initListeners();
});

// == Controller Namespace ================

// == Service Namespace ===================

// == Model Controller ====================

cmg.controllers.base.ModelController = function() {};

cmg.controllers.base.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.base.ModelController.prototype.getActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );	
	var model		= requestElement.closest( '.cmt-model' );

	// Show Update Form
	cmt.api.root.getApplication( 'base' ).getService( 'model' ).initUpdateForm( container, model, response.data );
};

cmg.controllers.base.ModelController.prototype.addActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );

	// Add Item to List
	cmt.api.root.getApplication( 'base' ).getService( 'model' ).add( container, response.data );
};

cmg.controllers.base.ModelController.prototype.updateActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'base' ).getService( 'model' ).refresh( container, model, response.data );
};

cmg.controllers.base.ModelController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'base' ).getService( 'model' );
	var container	= service.findContainer( requestElement );
	var model		= container.find( '.cmt-model[data-id=' + response.data.id + ']' );

	cmt.api.root.getApplication( 'base' ).getService( 'model' ).remove( container, model );
};

// == Model Service =======================

cmg.services.base.ModelService = function() {

	this.addTemplate		= 'addModelTemplate';
	this.updateTemplate		= 'updateModelTemplate';
	this.viewTemplate		= 'modelViewTemplate';
	this.refreshTemplate	= 'modelRefreshTemplate';
};

cmg.services.base.ModelService.inherits( cmt.api.services.BaseService );

cmg.services.base.ModelService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.cmt-model-add' ).length == 0 ) {

		return;
	}

	jQuery( '.cmt-model-add' ).click( function() {

		var container = jQuery( this ).closest( '.cmt-model-crud' );

		self.initAddForm( container );
	});
}

cmg.services.base.ModelService.prototype.initAddForm = function( container ) {

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

cmg.services.base.ModelService.prototype.initUpdateForm = function( container, model, data ) {

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

cmg.services.base.ModelService.prototype.add = function( container, data ) {

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

cmg.services.base.ModelService.prototype.refresh = function( container, model, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	model.find( '.cmt-model-header .title' ).html( data.title );
	model.find( '.cmt-model-data' ).replaceWith( output );

	// Clear Form
	container.find( '.cmt-model-form' ).slideUp( 'slow' );
}

cmg.services.base.ModelService.prototype.remove = function( container, model ) {

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

cmg.services.base.ModelService.prototype.findContainer = function( requestElement ) {

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

// == Direct Calls ========================

// == Additional Methods ==================
