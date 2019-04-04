// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'autoload', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'autoload', 'cmg.core.controllers.AutoloadController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=autoload]' ) );
});

// == Controller Namespace ================

// == Autoload Controller =================

cmg.core.controllers.AutoloadController	= function() {};

cmg.core.controllers.AutoloadController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.AutoloadController.prototype.autoloadActionSuccess = function( requestElement, response ) {

	if( cmt.utils.object.hasProperty( response.data, 'widgetId' ) && cmt.utils.object.hasProperty( response.data, 'widgetHtml' ) ) {

		var widget = jQuery( '#' + response.data.widgetId );

		widget.html( response.data.widgetHtml );
	}
};

// == Direct Calls ========================

// == Additional Methods ==================
