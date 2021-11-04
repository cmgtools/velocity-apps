// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'address', 'cmg.core.services.AddressService' );

	// Event Listeners
	app.getService( 'address' ).initListeners();

	app.getService( 'address' ).refreshGoogleMap( jQuery( '.frm-address' ) );
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations using Address and ModelAddress models.

.cmt-address-crud {

	.cmt-address-add {
		// Trigger to show the address form
	}

	.cmt-address-form {
		// The form container to add/update address
		// Render the from available in addTemplate and updateTemplate

		.cmt-address-close {
			// Hides the add/update form
		}

		// The location component
		.cmt-location {

			.cmt-location-country { }
			.cmt-location-countries { }
			.cmt-location-province { }
			.cmt-location-provinces { }
			.cmt-location-region { }

			.cmt-location-city-fill {

				.target { }
				.auto-fill-text { }
			}
		}

		.lat-long-picker {
			// Latitude and Longitude Picker
		}

		.cmt-location-ll-picker {
			.line1 { }
			.line2 { }
			.line3 { }
			.city { }
			.zip { }
			.search-box { }
		}
	}

	.cmt-address-collection {
		// Collection of existing addresses

		.cmt-address {
			// Renders all the addresses either using PHP or viewTemplate by making call to get addresses and iterating the result set
			// Renders the address using viewTemplate after adding an address
			// Refresh and partial render the address using refreshTemplate after updating an address
		}
	}
}
 */

// == Address Service =====================

cmg.core.services.AddressService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addAddressTemplate';
	this.updateTemplate		= 'updateAddressTemplate';
	this.viewTemplate		= 'viewAddressTemplate';
	this.refreshTemplate	= 'refreshAddressTemplate';
};

cmg.core.services.AddressService.inherits( cmt.api.services.BaseService );

cmg.core.services.AddressService.prototype.initListeners = function() {

	var self = this;

	var triggers = jQuery( '.cmt-address-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-address-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.AddressService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Intl Tel
	form.find( '.intl-tel-field' ).each( function() {

		cmt.utils.intltel.initIntlTelField( jQuery( this ) );
	});

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.AddressService.prototype.initUpdateForm = function( container, address, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Custom Select
	var country		= form.find( '.cmt-location-country' );
	var province	= form.find( '.cmt-location-province' );
	var region		= form.find( '.cmt-location-region' );

	//country.find( "option[value='" + country.attr( 'cid' ) + "']" ).prop( 'selected', true );

	country.val( country.attr( 'cid' ) );
	province.val( province.attr( 'pid' ) );

	if( region.length === 1 ) {

		region.val( region.attr( 'rid' ) );
	}

	form.find( '.cmt-address-type' ).val( data.ctype );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Intl Tel
	form.find( '.intl-tel-field' ).each( function() {

		cmt.utils.intltel.initIntlTelField( jQuery( this ) );
	});

	// Show View
	form.fadeIn( 'slow' );

	// TODO: Check the timings and overlapping of response
	this.refreshProvinces( form, province.attr( 'pid' ) );

	this.refreshRegions( form, region.attr( 'rid' ) );

	// Clear attributes
	form.find( '.cmt-location-country' ).removeAttr( 'data-province' );
	form.find( '.cmt-location-province' ).removeAttr( 'data-region' );
}

cmg.core.services.AddressService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-address-collection' );

	// Add at first
	collection.prepend( output );

	var address = collection.find( '.cmt-address' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', address );

	// Init Actions
	cmt.utils.ui.initActionsElement( address.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.core.services.AddressService.prototype.refresh = function( container, address, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	address.find( '.cmt-address-header .title' ).html( data.title );
	address.find( '.cmt-address-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.core.services.AddressService.prototype.remove = function( container, address ) {

	var actions = address.find( '.cmt-actions' );

	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'data-idx' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	address.remove();
}

cmg.core.services.AddressService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-address-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'data-idx' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-address-crud' );
		}
	}

	return container;
}

cmg.core.services.AddressService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.cmt-location-country' ).attr( 'data-province', provinceId );

	target.find( '.cmt-location-country' ).closest( '.cmt-location-countries' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.AddressService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.cmt-location-province' ).attr( 'data-region', regionId );

	target.find( '.cmt-location-province' ).closest( '.cmt-location-provinces' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.AddressService.prototype.clearCity = function( target ) {

	target.find( '.cmt-location-country, .cmt-location-province, .cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}

cmg.core.services.AddressService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.cmt-location-ll-picker .line1, .cmt-location-ll-picker .line2, .cmt-location-ll-picker .line3, .cmt-location-ll-picker .city, .cmt-location-ll-picker .zip' ).keyup( function() {

		var location = jQuery( this ).closest( '.frm-address' );

		var country		= location.find( '.cmt-location-country' ).find( ':selected' ).text();
		var province	= location.find( '.cmt-location-province' ).find( ':selected' ).text();

		var line1 	= jQuery( '.cmt-location-ll-picker .line1' ).val();
		var line2 	= jQuery( '.cmt-location-ll-picker .line2' ).val();
		var city 	= jQuery( '.cmt-location-ll-picker .city' ).val();
		var zip 	= jQuery( '.cmt-location-ll-picker .zip' ).val();

		var address	= [];

		line1.length > 0 ? address.push( line1 ) : null;
		line2.length > 0 ? address.push( line2 ) : null;
		city.length > 0 ? address.push( city ) : null;
		country.length > 0 ? address.push( country ) : null;
		province.length > 0 ? address.push( province ) : null;
		zip.length > 0 ? address.push( zip ) : null;

		var addressStr = address.join();

		if( addressStr.length > 10 ) {

			jQuery( '.cmt-location-ll-picker .search-box' ).val( addressStr ).trigger( 'change' );
		}
	});
}

// == Additional Methods ==================
