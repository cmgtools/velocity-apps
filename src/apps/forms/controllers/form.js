// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.getApplication( 'forms' );

	app.mapController( 'form', 'cmg.forms.controllers.FormController' );
});

// == Form Controller =====================

cmg.forms.controllers.FormController = function() { };

cmg.forms.controllers.FormController.inherits( cmt.api.controllers.RequestController );

cmg.forms.controllers.FormController.prototype.defaultActionSuccess = function( requestElement, response ) {

	cmg.logger.log( 'Form processed successfully.' );
};

cmg.forms.controllers.FormController.prototype.defaultActionFailure = function( requestElement, response ) {

	cmg.logger.log( 'Form processing failed.' );
};

// == Direct Calls ========================

// == Additional Methods ==================
