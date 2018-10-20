// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'org' );

	// Map Controllers
	app.mapController( 'organization', 'cmg.org.controllers.OrganizationController' );
});

// == Organization Controller =============

cmg.org.controllers.OrganizationController = function() {};

cmg.org.controllers.OrganizationController.inherits( cmt.api.controllers.RequestController );

cmg.org.controllers.OrganizationController.prototype.assignAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.post-action' ).hide();
};

cmg.org.controllers.OrganizationController.prototype.clearAvatarActionSuccess = function( requestElement, response ) {

	var uploader = requestElement.closest( '.file-uploader' );

	// Update Uploader
	uploader.find( '.file-wrap .file-data' ).html( '<i class="cmti cmti-5x cmti-user"></i>');
	uploader.find( '.file-clear' ).hide();
	uploader.find( '.post-action' ).hide();
};

// == Direct Calls ========================

function setOrganizationData( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/set-data", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeOrganizationData( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/remove-data", "Meta[key]=" + key );
}

function setOrganizationAttribute( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/set-attribute", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeOrganizationAttribute( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/remove-attribute", "Meta[key]=" + key );
}

function setOrganizationConfig( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/set-config", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeOrganizationConfig( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/remove-config", "Meta[key]=" + key );
}

function setOrganizationSetting( key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/set-setting", "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeOrganizationSetting( key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + "org/organization/remove-setting", "Meta[key]=" + key );
}

// == Additional Methods ==================
