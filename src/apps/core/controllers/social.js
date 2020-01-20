// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'socialData', 'cmg.core.data.controllers.SocialController' );
});

// == Social Controller ===================

cmg.core.data.controllers.SocialController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'socialData' );
};

cmg.core.data.controllers.SocialController.inherits( cmt.api.controllers.RequestController );

cmg.core.data.controllers.SocialController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.core.data.controllers.SocialController.prototype.addActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.core.data.controllers.SocialController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.core.data.controllers.SocialController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, social, response.data );
}

cmg.core.data.controllers.SocialController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-social' );

	return true;
}

cmg.core.data.controllers.SocialController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var social		= requestElement.closest( '.cmt-data-social' );

	// Unset Form
	this.requestForm = null;

	// Remove Data
	this.modelService.remove( container, social );
}

// == Direct Calls ========================

// == Additional Methods ==================
