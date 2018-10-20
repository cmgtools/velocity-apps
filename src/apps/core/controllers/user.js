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
	jQuery( '.popout-group-main .wrap-user .fa-user' ).remove();
	jQuery( '.popout-group-main .wrap-user .user-avatar' ).remove();
	jQuery( '.popout-group-main .wrap-user' ).prepend( '<img class="user-avatar" src="' + response.data.thumbUrl + '" />' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.core.controllers.UserController.prototype.clearAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Header Popuout
	jQuery( '.popout-group-main .wrap-user .fa-user' ).remove();
	jQuery( '.popout-group-main .wrap-user .user-avatar' ).remove();
	jQuery( '.popout-group-main .wrap-user' ).prepend( '<span class="fa fa-user icon"></span>' );

	// Update Uploader
	uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-user"></i>');
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
