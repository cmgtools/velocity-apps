// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'region', 'cmg.core.controllers.RegionController' );

	// Listeners
	jQuery( '.cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Region Controller ===================

cmg.core.controllers.RegionController = function() {};

cmg.core.controllers.RegionController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.RegionController.prototype.optionsListActionPre = function( requestElement ) {

	var province = requestElement.find( 'select' );

	this.requestData = "province-id=" + province.val();

	if( cmt.utils.data.hasAttribute( province, 'data-region' ) ) {

		this.requestData += "&region-id=" + province.attr( 'data-region' );
	}

	return true;
};

cmg.core.controllers.RegionController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.cmt-location' ).find( '.cmt-location-regions .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================
