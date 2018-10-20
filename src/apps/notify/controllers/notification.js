// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app = cmt.api.root.getApplication( 'notify' );

	// Map Controllers
	app.mapController( 'notification', 'cmg.notify.controllers.NotificationController' );
});

// == Notification Controller =============

cmg.notify.controllers.NotificationController = function() {};

cmg.notify.controllers.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.notify.controllers.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

	var clickBtn	= requestElement.find( '.cmt-click' );
	var type		= clickBtn.attr( 'type' );
	var count		= response.data.unread;

	if( response.data.consumed ) {

		jQuery( ".count-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).html( count );

		if( count == 0 ) {

			jQuery( ".count-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).fadeOut( 'fast' );
		}
	}

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
};

cmg.notify.controllers.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

cmg.notify.controllers.NotificationController.prototype.toggleTrashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Direct Calls ========================

// == Additional Methods ==================
