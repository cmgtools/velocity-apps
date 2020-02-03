// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'follower', 'cmg.core.services.FollowerService' );

	// Event Listeners
	app.getService( 'follower' ).initListeners();
});

// == File Service ========================

cmg.core.services.FollowerService = function() {};

cmg.core.services.FollowerService.inherits( cmt.api.services.BaseService );

cmg.core.services.FollowerService.prototype.initListeners = function() {

	var self = this;
}

cmg.core.services.FollowerService.prototype.processClasses = function( requestElement, follower, counts ) {

	var upClass		= requestElement.attr( 'data-class-up' );
	var downClass	= requestElement.attr( 'data-class-down' );
	var modelClass	= requestElement.attr( 'data-class-model' );

	var models = jQuery( '.' + modelClass + '-' + follower.parentId + ' .icon' );

	if( follower.active ) {

		models.removeClass( downClass );
		models.addClass( upClass );
	}
	else {

		models.removeClass( upClass );
		models.addClass( downClass );
	}
}

// == Additional Methods ==================
