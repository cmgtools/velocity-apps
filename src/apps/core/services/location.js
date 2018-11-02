// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'location', 'cmg.core.services.LocationService' );

	// Event Listeners
	app.getService( 'location' ).initListeners();

	app.getService( 'location' ).refreshGoogleMap( jQuery( '.frm-location' ) );
});

// == UI Guide ============================

/*
// An independent component to perform CRUD operations using Location and ModelLocation models.

.cmt-location-crud {

	.cmt-location-add {
		// Trigger to show the location form
	}

	.cmt-location-form {
		// The form container to add/update location
		// Render the from available in addTemplate and updateTemplate

		.cmt-location-close {
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
			.title { }
			.city { }
			.zip { }
			.search-box { }
		}
	}

	.cmt-location-collection {
		// Collection of existing locations

		.cmt-location {
			// Renders all the locations either using PHP or viewTemplate by making call to get locations and iterating the result set
			// Renders the location using viewTemplate after adding an location
			// Refresh and partial render the location using refreshTemplate after updating an location
		}
	}
}
 */

// == Address Service =====================

cmg.core.services.LocationService = function() {

	// Default Handlebar Templates
	this.addTemplate		= 'addLocationTemplate';
	this.updateTemplate		= 'updateLocationTemplate';
	this.viewTemplate		= 'locationViewTemplate';
	this.refreshTemplate	= 'locationRefreshTemplate';
};

cmg.core.services.LocationService.inherits( cmt.api.services.BaseService );

cmg.core.services.LocationService.prototype.initListeners = function() {

	var self = this;
	
	var triggers = jQuery( '.cmt-location-add' );

	if( triggers.length == 0 ) {

		return;
	}

	triggers.click( function() {

		var container = jQuery( this ).closest( '.cmt-location-crud' );

		self.initAddForm( container );
	});
}

cmg.core.services.LocationService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-location-form' );

	// Hide View
	form.hide();

	// Append View
	form.html( output );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', form );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-location-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );
}

cmg.core.services.LocationService.prototype.initUpdateForm = function( container, location, data ) {

	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-location-form' );

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

	form.find( '.cmt-location-type' ).val( data.type );

	// Init Select
	cmt.utils.ui.initSelectElement( form.find( '.cmt-select' ) );

	// Init Listeners
	form.find( '.cmt-location-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );

	// City Listener
	this.clearCity( form );

	// Show View
	form.fadeIn( 'slow' );

	// TODO: Check the timings and overlapping of response
	this.refreshProvinces( form, province.attr( 'pid' ) );

	this.refreshRegions( form, region.attr( 'rid' ) );
}

cmg.core.services.LocationService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-location-collection' );

	// Add at first
	collection.prepend( output );

	var location = collection.find( '.cmt-location' ).first();

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'core', location );

	// Init Actions
	cmt.utils.ui.initActionsElement( location.find( '.cmt-actions' ) );

	// Hide Form
	container.find( '.cmt-location-form' ).slideUp( 'slow' );
}

cmg.core.services.LocationService.prototype.refresh = function( container, location, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	location.find( '.cmt-location-header .title' ).html( data.title );
	location.find( '.cmt-location-data' ).replaceWith( output );

	// Hide Form
	container.find( '.cmt-location-form' ).slideUp( 'slow' );
}

cmg.core.services.LocationService.prototype.remove = function( container, location ) {

	var actions = location.find( '.cmt-actions' );
	
	// Remove Actions
	if( actions.length > 0 ) {

		var index = actions.attr( 'ldata-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	location.remove();
}

cmg.core.services.LocationService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-location-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier = listData.attr( 'ldata-id' );

			var list = jQuery( '#actions-list-' + identifier );

			container = list.closest( '.cmt-location-crud' );
		}
	}

	return container;
}

cmg.core.services.LocationService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.cmt-location-country' ).attr( 'data-province', provinceId );

	target.find( '.cmt-location-country' ).closest( '.cmt-location-countries' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.LocationService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.cmt-location-province' ).attr( 'data-region', regionId );

	target.find( '.cmt-location-province' ).closest( '.cmt-location-provinces' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.core.services.LocationService.prototype.clearCity = function( target ) {

	target.find( '.cmt-location-province, .cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}

cmg.core.services.LocationService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.cmt-location-ll-picker .title, .cmt-location-ll-picker .line1, .cmt-location-ll-picker .line2, .cmt-location-ll-picker .line3, .cmt-location-ll-picker .city, .cmt-location-ll-picker .zip' ).keyup( function() {
		
		var title		= jQuery( '.cmt-location-ll-picker .title' );
		var location	= '';

		if( title.length > 0 ) {

			location = title.val();
		}

		var city	= jQuery( '.cmt-location-ll-picker .city' ).val();
		var zip		= jQuery( '.cmt-location-ll-picker .zip' ).val();

		location += location + ',' + city + ',' + zip;

		if( location.length > 10 ) {

			jQuery( '.cmt-location-ll-picker .search-box' ).val( location ).trigger( 'change' );
		}
	});
}

// == Additional Methods ==================
