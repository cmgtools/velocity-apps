// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'newsletter' );

	// Map Controllers
	app.mapController( 'newsletter', 'cmg.newsletter.controllers.NewsletterController' );
	app.mapController( 'edition', 'cmg.newsletter.controllers.EditionController' );
});

// == Newsletter Controller ===============

cmg.newsletter.controllers.NewsletterController = function() {};

cmg.newsletter.controllers.NewsletterController.inherits( cmt.api.controllers.BaseController );

cmg.newsletter.controllers.NewsletterController.prototype.autoSearchActionPre = function( requestElement ) {

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

cmg.newsletter.controllers.NewsletterController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

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

			// Update Edition
			var parent = requestElement.closest( '.cmt-newsletter-wrap' );

			if( parent.length == 1 ) {

				var editionFill = parent.find( '.cmt-edition-fill' );

				if( editionFill.length == 1 ) {

					editionFill.find( '.search-name' ).val( '' );
					editionFill.find( '.target' ).val( '' );
					editionFill.find( '.search-nid' ).val( id );
				}
			}
		});
	}

	itemList.slideDown();
};

// == Edition Controller ==================

cmg.newsletter.controllers.EditionController = function() {};

cmg.newsletter.controllers.EditionController.inherits( cmt.api.controllers.BaseController );

cmg.newsletter.controllers.EditionController.prototype.autoSearchActionPre = function( requestElement ) {

	var autoFill = requestElement.closest( '.auto-fill' );

	var name	= autoFill.find( '.search-name' ).val();
	var type	= autoFill.find( '.search-type' );
	var nid		= autoFill.find( '.search-nid' );

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

	if( nid.length == 1 ) {

		this.requestData += "&nid=" + nid.val();
	}

	return true;
};

cmg.newsletter.controllers.EditionController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

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

// == Direct Calls ========================

// == Additional Methods ==================
