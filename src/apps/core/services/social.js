// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'social', 'cmg.core.services.SocialService' );

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

// == Social Service ======================

cmg.core.services.SocialService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addSocialDataTemplate';
	this.refreshTemplate	= 'refreshSocialDataTemplate';
};

cmg.core.services.SocialService.inherits( cmt.api.services.BaseService );

cmg.core.services.SocialService.prototype.initListeners = function() {

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

cmg.core.services.SocialService.prototype.initAddForm = function( container ) {

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

cmg.core.services.SocialService.prototype.refresh = function( container, social, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	social.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'data', social );
}

cmg.core.services.SocialService.prototype.remove = function( container, social ) {

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

cmg.core.services.SocialService.prototype.findContainer = function( requestElement ) {

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

// == Additional Methods ==================
