// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'address', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'crud', 'cmg.controllers.address.CrudController' );

	// Map Services
	app.mapService( 'crud', 'cmg.services.address.CrudService' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=address]' ) );

	// Event Listeners
	app.getService( 'crud' ).initListeners();

	app.getService( 'crud' ).refreshGoogleMap( jQuery( '.frm-address' ) );
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.address = cmg.controllers.address || {};

// == Service Namespace ===================

cmg.services = cmg.services || {};

cmg.services.address = cmg.services.address || {};

// == CRUD Controller =====================

cmg.controllers.address.CrudController = function() {};

cmg.controllers.address.CrudController.inherits( cmt.api.controllers.RequestController );

cmg.controllers.address.CrudController.prototype.getActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'address' ).getService( 'crud' );
	var container	= service.findContainer( requestElement );	
	var address		= requestElement.closest( '.cmt-address' );

	// Show Update Form
	cmt.api.root.getApplication( 'address' ).getService( 'crud' ).initUpdateForm( container, address, response.data );
};

cmg.controllers.address.CrudController.prototype.addActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'address' ).getService( 'crud' );
	var container	= service.findContainer( requestElement );

	// Add Item to List
	cmt.api.root.getApplication( 'address' ).getService( 'crud' ).add( container, response.data );
};

cmg.controllers.address.CrudController.prototype.updateActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'address' ).getService( 'crud' );
	var container	= service.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	cmt.api.root.getApplication( 'address' ).getService( 'crud' ).refresh( container, address, response.data );
};

cmg.controllers.address.CrudController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var service		= cmt.api.root.getApplication( 'address' ).getService( 'crud' );
	var container	= service.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	cmt.api.root.getApplication( 'address' ).getService( 'crud' ).remove( container, address );
};

// == CRUD Service ========================

cmg.services.address.CrudService = function() {

	this.addTemplate		= 'addAddressTemplate';
	this.updateTemplate		= 'updateAddressTemplate';
	this.viewTemplate		= 'addressViewTemplate';
	this.refreshTemplate	= 'addressRefreshTemplate';
};

cmg.services.address.CrudService.inherits( cmt.api.services.BaseService );

cmg.services.address.CrudService.prototype.initListeners = function() {

	var self = this;

	if( jQuery( '.cmt-address-add' ).length == 0 ) {

		return;
	}

	jQuery( '.cmt-address-add' ).click( function() {

		var container = jQuery( this ).closest( '.cmt-address-crud' );

		self.initAddForm( container );
	});
}

cmg.services.address.CrudService.prototype.initAddForm = function( container ) {

	var source 		= document.getElementById( this.addTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { };
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', form );
	cmt.api.utils.request.registerTargetApp( 'location', form );

	// Custom Select
	form.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );
	
	// City Listener
	this.clearCity( form );
}

cmg.services.address.CrudService.prototype.initUpdateForm = function( container, address, data ) {
	
	var self		= this;
	var source 		= document.getElementById( this.updateTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	var form = container.find( '.cmt-address-form' );

	form.hide();

	form.html( output );

	form.fadeIn( 'slow' );

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
alert( data.type );
	form.find( '.cmt-address-type' ).val( data.type );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', form );
	cmt.api.utils.request.registerTargetApp( 'location', form );

	// Custom Select
	form.find( '.cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );

	// Init Listeners
	form.find( '.cmt-address-close' ).click( function() {

		form.fadeOut( 'fast' );
	});

	// Refresh Map
	this.refreshGoogleMap( form );
	
	// City Listener
	this.clearCity( form );

	// TODO: Check the timings and overlapping of response
	this.refreshProvinces( form, province.attr( 'pid' ) );

	this.refreshRegions( form, region.attr( 'rid' ) );
}

cmg.services.address.CrudService.prototype.add = function( container, data ) {

	var source 		= document.getElementById( this.viewTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );
	var collection	= container.find( '.cmt-address-collection' );

	// Add at first
	collection.prepend( output );

	var address = collection.find( '.cmt-address' ).first();
	var actions	= address.find( '.cmt-actions' );

	// Init Request
	cmt.api.utils.request.registerTargetApp( 'address', address );

	// Actions
	actions.cmtActions();
	actions.find( '.cmt-auto-hide' ).cmtAutoHide();

	// Clear Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.services.address.CrudService.prototype.refresh = function( container, address, data ) {

	var source 		= document.getElementById( this.refreshTemplate ).innerHTML;
	var template 	= Handlebars.compile( source );
	var output 		= template( data );

	address.find( '.cmt-address-header .title' ).html( data.title );
	address.find( '.cmt-address-data' ).replaceWith( output );

	// Init Request
	// cmt.api.utils.request.register( cmt.api.root.getApplication( 'address' ), address.find( '[cmt-app=address]' ) );

	// Clear Form
	container.find( '.cmt-address-form' ).slideUp( 'slow' );
}

cmg.services.address.CrudService.prototype.remove = function( container, address ) {

	// Remove Actions
	var actions = address.find( '.cmt-actions' );

	if( actions.length > 0 ) {

		var index = actions.attr( 'data-id' );

		// Remove Actions List
		jQuery( '#actions-list-data-' + index ).remove();
	}

	// Remove Item
	address.remove();
}

cmg.services.address.CrudService.prototype.findContainer = function( requestElement ) {

	var container = requestElement.closest( '.cmt-address-crud' );

	// Find in Actions
	if( container.length == 0 ) {

		var listData = requestElement.closest( '.actions-list-data' );

		if( listData.length == 1 ) {

			var identifier	= listData.attr( 'data-id' );
			var list		= jQuery( '#actions-list-' + identifier );
			
			container = list.closest( '.cmt-address-crud' );
		}
	}
	
	return container;
}

cmg.services.address.CrudService.prototype.refreshProvinces = function( target, provinceId ) {

	target.find( '.cmt-location-country' ).attr( 'data-province', provinceId );

	target.find( '.cmt-location-country' ).closest( '.cmt-location-countries' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.services.address.CrudService.prototype.refreshRegions = function( target, regionId ) {

	target.find( '.cmt-location-province' ).attr( 'data-region', regionId );

	target.find( '.cmt-location-province' ).closest( '.cmt-location-provinces' ).find( '.cmt-click' ).trigger( 'click' );
}

cmg.services.address.CrudService.prototype.clearCity = function( target ) {

	target.find( '.cmt-location-province, .cmt-location-region' ).change( function() {

		var cityFill = jQuery( this ).closest( '.cmt-location' ).find( '.cmt-location-city-fill' );

		cityFill.find( '.target' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
}

cmg.services.address.CrudService.prototype.refreshGoogleMap = function( target ) {

	// CMT JS - Google Map
	jQuery( target ).find( '.lat-long-picker' ).latLongPicker();

	// Address Map
	jQuery( target ).find( '.cmt-location-ll-picker .line1, .cmt-location-ll-picker .line2, .cmt-location-ll-picker .line3, .cmt-location-ll-picker .city, .cmt-location-ll-picker .zip' ).keyup( function() {

		var line1 	= jQuery( '.cmt-location-ll-picker .line1' ).val();
		var line2 	= jQuery( '.cmt-location-ll-picker .line2' ).val();
		var city 	= jQuery( '.cmt-location-ll-picker .city' ).val();
		var zip 	= jQuery( '.cmt-location-ll-picker .zip' ).val();
		var address	= line1 + ',' + line2 + ',' + city + ',' + zip;

		if( address.length > 10 ) {

			jQuery( '.cmt-location-ll-picker .search-box' ).val( address ).trigger( 'change' );
		}
	});
}

// == Direct Calls ========================

// == Additional Methods ==================
