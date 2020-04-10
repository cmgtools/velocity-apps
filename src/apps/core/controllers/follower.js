// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'follower', 'cmg.core.controllers.FollowerController' );
});

// == Follower Controller =================

cmg.core.controllers.FollowerController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'follower' );
};

cmg.core.controllers.FollowerController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.FollowerController.prototype.likeActionPre = function( requestElement, response ) {

	return true;
};

cmg.core.controllers.FollowerController.prototype.likeActionSuccess = function( requestElement, response ) {

	var follower	= response.data.follower;
	var counts		= response.data.counts;

	this.modelService.processClasses( requestElement, follower, counts );

	// TODO: Handle dislike icons
};

cmg.core.controllers.FollowerController.prototype.dislikeActionPre = function( requestElement, response ) {

	return true;
};

cmg.core.controllers.FollowerController.prototype.dislikeActionSuccess = function( requestElement, response ) {

	var follower	= response.data.follower;
	var counts		= response.data.counts;

	this.modelService.processClasses( requestElement, follower, counts );

	// TODO: Handle like icons
};

cmg.core.controllers.FollowerController.prototype.followActionPre = function( requestElement, response ) {

	return true;
};

cmg.core.controllers.FollowerController.prototype.followActionSuccess = function( requestElement, response ) {

	var follower	= response.data.follower;
	var counts		= response.data.counts;

	this.modelService.processClasses( requestElement, follower, counts );
};

cmg.core.controllers.FollowerController.prototype.wishActionPre = function( requestElement, response ) {

	return true;
};

cmg.core.controllers.FollowerController.prototype.wishActionSuccess = function( requestElement, response ) {

	var follower	= response.data.follower;
	var counts		= response.data.counts;

	this.modelService.processClasses( requestElement, follower, counts );
};
