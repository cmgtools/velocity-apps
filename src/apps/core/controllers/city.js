// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'city', 'cmg.core.controllers.CityController' );
});

// == City Controller =====================

cmg.core.controllers.CityController	= function() {};

cmg.core.controllers.CityController.inherits( cmt.api.controllers.BaseController );

cmg.core.controllers.CityController.prototype.autoSearchActionPre = function( requestElement ) {

	var form		= requestElement.closest( '.cmt-location' );
	var autoFill	= requestElement.closest( '.auto-fill' );
	var cityName 	= autoFill.find( '.auto-fill-text' ).val();

	if( cityName.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.target' ).val( '' );

		return false;
	}

	if( form.length > 0 ) {

		var province	= form.find( '.cmt-location-province' );
		var region		= form.find( '.cmt-location-region' );

		var params = [];

		if( province.length > 0 ) {

			params.push( "province-id=" + province.val() );
		}

		if( region.length > 0 ) {

			params.push( "region-id=" + region.val() );
		}

		params.push( "name=" + cityName );

		this.requestData = params.join( '&' );
	}
	else {

		this.requestData = "name=" + cityName;
	}

	return true;
};

cmg.core.controllers.CityController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\" data-lat=\"" + obj.latitude + "\" data-lon=\"" + obj.longitude + "\" data-zip=\"" + obj.postal + "\">" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class=\"auto-fill-message\">No matching results found.</li>";

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
			var parent		= jQuery( this ).closest( '.cmt-location' );
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
