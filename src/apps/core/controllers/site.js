// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'site', 'cmg.core.controllers.SiteController' );
});

// == Site Controller =====================

cmg.core.controllers.SiteController = function() {};

cmg.core.controllers.SiteController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.SiteController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill	= requestElement.closest( '.auto-fill' );
	var name		= autoFill.find( '.auto-fill-text' ).val();
	var limit		= autoFill.find( '.limit' );
	var autoCache	= autoFill.find( '.auto-cache' );

	if( name.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.target' ).val( '' );

		return false;
	}

	// Only one request at a time
	this.singleRequest = true;

	this.requestData = "name=" + name;

	if( limit.length > 0 ) {

		this.requestData += "&limit=" + limit.val();
	}

	if( autoCache.length > 0 ) {

		this.requestData += "&autoCache=" + autoCache.val();
	}

	return true;
};

cmg.core.controllers.SiteController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\">" + obj.name + "</li>";
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

			itemList.slideUp();

			// Update Id & Name
			target.val( id );
			requestElement.find( '.auto-fill-text' ).val( name );
			autoFill.find( '.error' ).html( '' );
			autoFill.find( '.error' ).hide();
		});
	}

	itemList.slideDown();
};

// == Direct Calls ========================

// == Additional Methods ==================
