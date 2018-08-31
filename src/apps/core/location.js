// == Application =========================

jQuery( document ).ready( function() {
	
	// Register App
	var app	= cmt.api.root.registerApplication( 'location', 'cmt.api.Application', { basePath: ajaxUrl } );
	
	// Map Controllers
	app.mapController( 'province', 'cmg.controllers.location.ProvinceController' );
	app.mapController( 'region', 'cmg.controllers.location.RegionController' );
	app.mapController( 'city', 'cmg.controllers.location.CityController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=location]' ) );

	// Listeners
	jQuery( '.address-province, .address-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.frm-address' ).find( '.city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.location = cmg.controllers.location || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.location = cmg.services.location || {};

// == Province Controller =================

cmg.controllers.location.ProvinceController	= function() {};

cmg.controllers.location.ProvinceController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.ProvinceController.prototype.optionsListActionPre = function( requestElement ) {

	var country = requestElement.find( 'select' );

	this.requestData = "country-id=" + country.val();

	if( cmt.utils.data.hasAttribute( country, 'province' ) ) {

		this.requestData += "&province-id=" + country.attr( 'province' );
	}

	return true;
};

cmg.controllers.location.ProvinceController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.frm-address' ).find( '.wrap-province .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Region Controller ===================

cmg.controllers.location.RegionController = function() {};

cmg.controllers.location.RegionController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.RegionController.prototype.optionsListActionPre = function( requestElement ) {

	var province = requestElement.find( 'select' );

	this.requestData = "province-id=" + province.val();

	if( cmt.utils.data.hasAttribute( province, 'region' ) ) {

		this.requestData += "&region-id=" + province.attr( 'region' );
	}

	return true;
};

cmg.controllers.location.RegionController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.frm-address' ).find( '.wrap-region .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == City Controller =====================

cmg.controllers.location.CityController	= function() {};

cmg.controllers.location.CityController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.CityController.prototype.autoSearchActionPre = function( requestElement ) {

	var form		= requestElement.closest( '.frm-address' );
	var autoFill	= requestElement.closest( '.auto-fill' );

	var provinceId 	= form.find( '.address-province' ).val();
	var regionId	= form.find( '.address-region' ).val();
	var cityName 	= form.find( '.auto-fill-text' ).val();

	if( cityName.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.target' ).val( '' );

		return false;
	}

	this.requestData = "province-id=" + provinceId + "&region-id=" + regionId + "&name=" + cityName;

	return true;
};

cmg.controllers.location.CityController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class='auto-fill-item' data-id='" + obj.id + "' data-lat='" + obj.latitude + "' data-lon='" + obj.longitude + "' data-zip='" + obj.postal + "'>" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class='auto-fill-message'>No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= autoFill.find( '.target' );
			var id		= jQuery( this ).attr( 'data-id' );
			var name	= jQuery( this ).html();

			var lat		= jQuery( this ).attr( 'data-lat' );
			var lon		= jQuery( this ).attr( 'data-lon' );
			var zip		= jQuery( this ).attr( 'data-zip' );
			zip			= zip.split( ' ' );

			itemList.slideUp();

			// Update City Id and Name
			target.val( id );
			requestElement.find( '.auto-fill-text' ).val( name );

			// Update Map
			var parent		= jQuery( this ).closest( '.frm-address' );
			var address		= lat + ',' + lon;

			parent.find( '.search-ll' ).val( address ).trigger( 'change' );

			// Update City Zip
			parent.find( '.address-zip' ).val( zip[ 0 ] );
		});
	}

	itemList.slideDown();
};

// == Direct Calls ========================

// == Additional Methods ==================
