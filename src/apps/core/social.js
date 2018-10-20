// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'social', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'link', 'cmg.controllers.social.LinkController' );

	// Map Services
	app.mapService( 'link', 'cmg.services.social.LinkService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=social]' ) );
	
	// Event Listeners
	app.getService( 'link' ).initListeners();
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.social = cmg.controllers.social || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.social = cmg.services.social || {};

// == Link Controller =====================

cmg.controllers.social.LinkController = function() {};

cmg.controllers.social.LinkController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.social.LinkController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.social-link' );

	return true;
}

cmg.controllers.social.LinkController.prototype.addActionSuccess = function( requestElement, response ) {
	
	var linkService = cmt.api.root.getApplication( 'social' ).getService( 'link' );

	// Unset Form
	this.requestForm = null;

	// Refresh Link
	linkService.refresh( requestElement.closest( '.social-link' ), response.data );
}

cmg.controllers.social.LinkController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.social-link' );

	return true;
}

cmg.controllers.social.LinkController.prototype.updateActionSuccess = function( requestElement, response ) {
	
	var linkService = cmt.api.root.getApplication( 'social' ).getService( 'link' );

	// Unset Form
	this.requestForm = null;

	// Refresh Link
	linkService.refresh( requestElement.closest( '.social-link' ), response.data );
}

cmg.controllers.social.LinkController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.social-link' );

	return true;
}

cmg.controllers.social.LinkController.prototype.deleteActionSuccess = function( requestElement, response ) {

	requestElement.closest( '.social-link' ).remove();
}

// == Link Service ========================

cmg.services.social.LinkService = function() {};

cmg.services.social.LinkService.inherits( cmt.api.services.BaseService );

cmg.services.social.LinkService.prototype.initListeners = function() {
	
	var self = this;

	jQuery( '#btn-add-social' ).click( function() {

		var select	= jQuery( '#select-link' );
		var icon	= select.val();
		var sns		= jQuery( '#select-link>option:selected' ).text();
		var target	= jQuery( this ).closest( '.data-crud-social' );

		self.add( target, sns, icon );
	});
}

cmg.services.social.LinkService.prototype.add = function( target, sns, icon ) {

	var source 		= document.getElementById( 'addSocialTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { sns: sns, icon: icon } );

	target.find( '.social-links' ).append( output );

	// Find Link
	var link = target.find( '.social-link' ).last();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'social', link );

	// Init Listeners
	link.find( '.btn-remove' ).click( function() {

		link.remove();
	});
}

cmg.services.social.LinkService.prototype.refresh = function( link, data ) {

	var source 		= document.getElementById( 'refreshSocialTemplate' ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( { data: data } );

	link.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'social', link );
}

// == Direct Calls ========================

// == Additional Methods ==================
