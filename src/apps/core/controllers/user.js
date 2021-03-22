// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'user', 'cmg.core.controllers.UserController' );

});

// == User Controller =====================

cmg.core.controllers.UserController = function() {};

cmg.core.controllers.UserController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.UserController.prototype.assignAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Header Popuout
	jQuery( '.popout-group-main .wrap-user .icon' ).remove();
	jQuery( '.popout-group-main .wrap-user .user-avatar' ).remove();
	jQuery( '.popout-group-main .wrap-user' ).prepend( '<img class="user-avatar" src="' + response.data.thumbUrl + '" />' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.UserController.prototype.clearAvatarActionSuccess = function( requestElement, response ) {

	var uploader	= requestElement.closest( '.file-uploader' );
	var wrapper		= jQuery( '.popout-group-main .wrap-user' );
	var icon		= wrapper.attr( 'data-icon' );

	// Update Header Popuout
	wrapper.find( '.icon' ).remove();
	wrapper.find( '.user-avatar' ).remove();
	wrapper.prepend( '<span class="icon ' + icon + '"></span>' );

	// Update Uploader
	uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-user"></i>');

	uploader.find( '.id' ).val( '' );
	uploader.find( '.change' ).val( '' );
	uploader.find( '.name' ).val( '' );
	uploader.find( '.file-clear' ).hide();
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.UserController.prototype.profileActionSuccess = function( requestElement, response ) {

	// Profile success
};

cmg.core.controllers.UserController.prototype.accountActionSuccess = function( requestElement, response ) {

	// Show old password field
	requestElement.find( '.data-crud-wrap .hidden-easy' ).removeClass( 'hidden-easy' );
};

cmg.core.controllers.UserController.prototype.addressActionSuccess = function( requestElement, response ) {

	// Address success
};

cmg.core.controllers.UserController.prototype.settingsActionSuccess = function( requestElement, response ) {

	// Settings success
};

cmg.core.controllers.UserController.prototype.autoSearchActionPre = function( requestElement ) {

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

cmg.core.controllers.UserController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var itemList		= requestElement.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class=\"auto-fill-item\" data-id=\"" + obj.id + "\">" + obj.name + ", " + obj.email + "</li>";
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
			var name	= jQuery( this ).attr( 'data-name' );
			var email	= jQuery( this ).attr( 'data-email' );
			var value	= jQuery( this ).html();

			itemList.slideUp();

			// Update Id and Name
			target.find( '.target' ).val( id );
			requestElement.find( '.auto-fill-text' ).val( value );
		});
	}

	itemList.slideDown();
};

// == Direct Calls ========================

function setUserData( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-data", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserData( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-data", "Meta[key]=" + key );
}

function setUserAttribute( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-attribute", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserAttribute( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-attribute", "Meta[key]=" + key );
}

function setUserConfig( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-config", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserConfig( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-config", "Meta[key]=" + key );
}

function setUserSetting( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/set-setting", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeUserSetting( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "user/remove-setting", "Meta[key]=" + key );
}

// == Additional Methods ==================
