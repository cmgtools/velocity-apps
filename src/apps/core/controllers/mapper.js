// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'autoMapper', 'cmg.core.mapper.controllers.AutoController' );
	app.mapController( 'modelMapper', 'cmg.core.mapper.controllers.ModelController' );
	app.mapController( 'csvMapper', 'cmg.core.mapper.controllers.CsvController' );
});

// == Controller Namespace ================

cmg.core.mapper.controllers = cmg.core.mapper.controllers || {};

// == Auto Controller =====================

cmg.core.mapper.controllers.AutoController = function() {

	this.singleRequest		= true;
	this.previousLocation	= null;
};

cmg.core.mapper.controllers.AutoController.inherits( cmt.api.controllers.RequestController );

cmg.core.mapper.controllers.AutoController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill = requestElement.closest( '.auto-fill' );

	var name = autoFill.find( '.search-name' ).val();
	var type = autoFill.find( '.search-type' );

	if( name.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.auto-fill-target .target' ).val( '' );

		return false;
	}

	if( type.length == 1 ) {

		this.requestData = "name=" + name + "&type=" + type.val();
	}
	else {

		this.requestData = "name=" + name;
	}

	return true;
};

cmg.core.mapper.controllers.AutoController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	//var wrapItemList	= requestElement.find( '.auto-fill-items-wrap' );
	var itemList		= requestElement.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class='auto-fill-item' data-id='" + obj.id + "'>" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class='auto-fill-message'>No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= requestElement.closest( '.auto-fill' ).find( '.auto-fill-target' );
			var id		= jQuery( this ).attr( 'data-id' );
			var name	= jQuery( this ).html();

			itemList.slideUp();

			// Update Id and Name
			target.find( '.target' ).val( id );
			requestElement.find( '.auto-fill-text' ).val( name );
		});
	}

	itemList.slideDown();
};

// == Mapper Controller ===================

cmg.core.mapper.controllers.ModelController = function() {};

cmg.core.mapper.controllers.ModelController.inherits( cmt.api.controllers.RequestController );

cmg.core.mapper.controllers.ModelController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill	= requestElement.closest( '.auto-fill' );
	var type 		= autoFill.find( 'input[name=type]' );
	var keyword 	= autoFill.find( '.auto-fill-text' ).val();

	var itemsLength	= requestElement.closest( '.mapper-auto-items' ).find( '.mapper-items' ).find( '.mapper-item' ).length;
	var itemsLimit	= requestElement.closest( '.mapper-auto-items' ).attr( 'limit' );

	if( keyword.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.trigger-map-item input[name=itemId]' ).val( '' );

		return false;
	}

	if( null !== itemsLimit && parseInt( itemsLimit ) <= itemsLength ) {

		alert( "No more mappings allowed." );
	}

	if( type.length == 1 ) {

		this.requestData = "name=" + keyword + "&type=" + type.val();
	}
	else {

		this.requestData = "name=" + keyword;
	}

	return true;
};

cmg.core.mapper.controllers.ModelController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data		= response.data;
	var listHtml	= '';
	var autoFill	= requestElement.closest( '.auto-fill' );
	var itemList	= requestElement.find( '.auto-fill-items' );
	var autoSubmit	= requestElement.attr( 'autoSubmit' ) || 'yes';
	var template	= requestElement.attr( 'template' ) || '';

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\">" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml	= "<li class=\"auto-fill-message\">No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var id = jQuery( this ).attr( 'data-id' );
			var name = jQuery( this ).html();

			itemList.slideUp();

			if( autoSubmit === 'yes' ) {

				autoFill.find( '.trigger-map-item input[name=itemId]' ).val( id );
				autoFill.find( '.trigger-map-item .cmt-click' )[ 0 ].click();
			}
			else {

				cmt.api.root.getApplication( 'core' ).getService( 'autoMapper' ).processAutoSearch( id, name, template );
			}
		});
	}

	itemList.slideDown();
};

cmg.core.mapper.controllers.ModelController.prototype.mapItemActionPre = function( requestElement ) {

	var itemId	= requestElement.find( 'input[name=itemId]' ).val();
	itemId		= parseInt( itemId );

	if( itemId > 0 ) {

		return true;
	}

	return false;
};

cmg.core.mapper.controllers.ModelController.prototype.mapItemActionSuccess = function( requestElement, response ) {

	var autoItems = requestElement.closest( '.mapper-auto-items' );

	// Template
	var source 		= document.getElementById( autoItems.attr( 'template' ) ).innerHTML;
	var template 	= Handlebars.compile( source );

	// Map
	var mapperItems	= autoItems.find( '.mapper-items' );
	var itemsArr	= mapperItems.find( '.mapper-item' );
	var itemsLength	= itemsArr.length;

	var cid		= response.data.cid;
	var name	= response.data.name;

	// Reset search field
	autoItems.find( '.search-name' ).val( '' );

	var create	= true;

	for( var i = 0; i < itemsLength; i++ ) {

		var test = jQuery( itemsArr[ i ] ).find( '.cid' ).val();

		if( cid == test ) {

			create = false;

			break;
		}
	}

	if( create ) {

		// Generate View
		var data	= { cid: cid, name: name };
		var output 	= template( data );

		mapperItems.append( output );

		itemsArr	= mapperItems.find( '.mapper-item' );
		itemsLength	= itemsArr.length;

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'core' ), itemsArr.last() );
	}
};

cmg.core.mapper.controllers.ModelController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

cmg.core.mapper.controllers.ModelController.prototype.toggleItemActionSuccess = function( requestElement, response ) {

	// Handle response
};

// == Csv Controller ======================

cmg.core.mapper.controllers.CsvController = function() {};

cmg.core.mapper.controllers.CsvController.inherits( cmt.api.controllers.RequestController );

cmg.core.mapper.controllers.CsvController.prototype.mapItemActionSuccess = function( requestElement, response ) {

	var submitItems	= jQuery( '.mapper-submit-items' );
	var mapperItems	= submitItems.find( '.mapper-items' );

	var source 		= document.getElementById( submitItems.attr( 'template' ) ).innerHTML;
	var template 	= Handlebars.compile( source );
	var data		= { list: response.data };
	var output 		= template( data );

	mapperItems.html( output );

	cmt.api.utils.request.register( cmt.api.root.getApplication( 'core' ), mapperItems.find( '[cmt-app=core]' ) );
};

cmg.core.mapper.controllers.CsvController.prototype.deleteItemActionSuccess = function( requestElement, response ) {

	requestElement.remove();
};

// == Direct Calls ========================

// == Additional Methods ==================
