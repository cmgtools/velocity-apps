// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Services
	app.mapService( 'autoMapper', 'cmg.core.mapper.services.AutoService' );
});

// == App Namespace =======================

var cmg = cmg || {};

cmg.core = cmg.core || {};

cmg.core.mapper = cmg.core.mapper || {};

// == Service Namespace ===================

cmg.core.mapper.services = cmg.core.mapper.services || {};

// == Auto Service ========================

cmg.core.mapper.services.AutoService = function() {};

cmg.core.mapper.services.AutoService.inherits( cmt.api.services.BaseService );

cmg.core.mapper.services.AutoService.prototype.processAutoSearch = function( id, name, template ) {

	// Template
	var source 		= document.getElementById( template ).innerHTML;
	var template 	= Handlebars.compile( source );
	// Map
	var mapperItems	= jQuery( '.mapper-auto-categories' ).find( '.mapper-items' );
	var itemsArr	= mapperItems.find( '.mapper-item' );
	var itemsLength	= itemsArr.length;

	// Reset search field
	jQuery( '.mapper-auto-categories .search-name' ).val( '' );

	if( itemsLength >= 5 ) {

		alert( "No more mappings allowed." );

		return;
	}

	var create	= true;

	for( var i = 0; i < itemsLength; i++ ) {

		var test = jQuery( itemsArr[ i ] ).find( '.id' ).val();

		if( id == test ) {

			create = false;

			break;
		}
	}

	if( create ) {

		// Generate View
		var data	= { id: id, name: name };
		var output 	= template( data );

		mapperItems.append( output );

		itemsArr	= mapperItems.find( '.mapper-item' );
		itemsLength	= itemsArr.length;

		itemsArr.last().find( '.mapper-item-remove' ).click( function() {

			jQuery( this ).closest( '.mapper-item' ).remove();
		});
	}
}

// == Additional Methods ==================
