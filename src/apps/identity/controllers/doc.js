// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'identity' );

	// Map Controllers
	app.mapController( 'doc', 'cmg.identity.controllers.DocController' );
});

// == Doc Controller ======================

cmg.identity.controllers.DocController = function() {};

cmg.identity.controllers.DocController.inherits( cmt.api.controllers.BaseController );

cmg.identity.controllers.DocController.prototype.optionsListActionPre = function( requestElement ) {

	var country = requestElement.find( 'select' );

	this.requestData = "countryId=" + country.val();

	if( cmt.utils.data.hasAttribute( country, 'data-docId' ) ) {

		this.requestData += "&docId=" + country.attr( 'data-docId' );
	}

	return true;
};

cmg.identity.controllers.DocController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.cmt-identity' ).find( '.cmt-identity-docs .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================
