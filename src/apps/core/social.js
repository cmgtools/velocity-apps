// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'data' );

	// Map Controllers
	app.mapController( 'social', 'cmg.data.controllers.SocialController' );

	// Map Services
	app.mapService( 'social', 'cmg.data.services.SocialService' );

	// Event Listeners
	app.getService( 'social' ).initListeners();
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations of Data JSON.

.cmt-data-social-crud {
	
	.cmt-data-social-options {
		// Option Chooser
	}

	.cmt-data-social-add {
		// Trigger to show the add/update form
	}

	.cmt-data-social-collection {

		.cmt-data-social {

		}
	}
}
 */

// == Social Controller ===================

cmg.data.controllers.SocialController = function() {

	this.app = cmt.api.root.getApplication( 'data' );

	this.modelService = this.app.getService( 'social' );
};

cmg.data.controllers.SocialController.inherits( cmt.api.controllers.RequestController );

cmg.data.controllers.SocialController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.data.controllers.SocialController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.updateActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.data.controllers.SocialController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.data.controllers.SocialController.prototype.deleteActionSuccess = function( requestElement, response ) {
	
	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Remove Data
	this.modelService.remove( container, social );
}

// == Social Service ======================

cmg.data.services.SocialService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addSocialDataTemplate';
	this.refreshTemplate	= 'refreshSocialDataTemplate';
};

cmg.data.services.SocialService.inherits( cmt.api.services.BaseService );

cmg.data.services.SocialService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-data-social-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-data-social-crud' );

		self.initAddForm( container );
	});
}

cmg.data.services.SocialService.prototype.initAddForm = function( container ) {

	var select	= container.find( '.cmt-data-social-options' );
	var icon	= select.val();
	var sns		= select.find( 'option:selected' ).text();

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { sns: sns, icon: icon } );

	container.find( '.cmt-data-social-collection' ).append( output );

	// Find data
	var social = container.find( '.cmt-data-social' ).last();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', social );

	// Init Listeners
	social.find( '.btn-remove' ).click( function() {

		social.remove();
	});
}

cmg.data.services.SocialService.prototype.refresh = function( container, social, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	social.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', social );
}

cmg.data.services.SocialService.prototype.remove = function( container, social ) {

	var actions = social.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Data
	social.remove();
}

cmg.data.services.SocialService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-data-social-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-data-social-crud' );
		}
	}

	return container;
}

// == Direct Calls ========================

// == Additional Methods ==================
