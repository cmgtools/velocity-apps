// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'province', 'cmg.core.controllers.ProvinceController' );

	// Listeners
	jQuery( '.cmt-location-province' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Province Controller =================

cmg.core.controllers.ProvinceController	= function() {};

cmg.core.controllers.ProvinceController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.ProvinceController.prototype.optionsListActionPre = function( requestElement ) {

	var country = requestElement.find( 'select' );

	this.requestData = "countryId=" + country.val();

	if( cmt.utils.data.hasAttribute( country, 'data-province' ) ) {

		this.requestData += "&provinceId=" + country.attr( 'data-province' );
	}

	return true;
};

cmg.core.controllers.ProvinceController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.cmt-location' ).find( '.cmt-location-provinces .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================
