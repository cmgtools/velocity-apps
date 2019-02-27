// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.getApplication( 'forms' );

	app.mapController( 'form', 'cmg.forms.controllers.FormController' );
});

// == Form Controller =====================

cmg.forms.controllers.FormController = function() { };

cmg.forms.controllers.FormController.inherits( cmt.api.controllers.RequestController );

cmg.forms.controllers.FormController.prototype.defaultActionSuccess = function( requestElement, response ) {

	console.log( 'form processed successfully.' );
};

cmg.forms.controllers.FormController.prototype.defaultActionFailure = function( requestElement, response ) {

	console.log( 'form processing failed.' );
};

// == Direct Calls ========================

// == Additional Methods ==================
