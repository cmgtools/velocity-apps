// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'customData', 'cmg.core.data.controllers.CustomController' );
});

// == Controller Namespace ================

cmg.core.data.controllers = cmg.core.data.controllers || {};

// == Custom Controller ===================

cmg.core.data.controllers.CustomController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'customData' );
};

cmg.core.data.controllers.CustomController.inherits( cmt.api.controllers.RequestController );

cmg.core.data.controllers.CustomController.prototype.addActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.core.data.controllers.CustomController.prototype.addActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, custom, response.data );
}

cmg.core.data.controllers.CustomController.prototype.updateActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.core.data.controllers.CustomController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Refresh Data
	this.modelService.refresh( container, custom, response.data );
}

cmg.core.data.controllers.CustomController.prototype.deleteActionPre = function( requestElement ) {

	this.requestForm = requestElement.closest( '.cmt-data-custom' );

	return true;
}

cmg.core.data.controllers.CustomController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var custom		= requestElement.closest( '.cmt-data-custom' );

	// Unset Form
	this.requestForm = null;

	// Remove Data
	this.modelService.remove( container, custom );
}

// == Direct Calls ========================

function setDataByBase( base, id, key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/set-data?id=" + id, "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeDataByBase( base, id, key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/remove-data?id=" + id, "Meta[key]=" + key );
}

function setAttributeByBase( base, id, key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/set-attribute?id=" + id, "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeAttributeByBase( base, id, key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/remove-attribute?id=" + id, "Meta[key]=" + key );
}

function setConfigByBase( base, id, key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/set-config?id=" + id, "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeConfigByBase( base, id, key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/remove-config?id=" + id, "Meta[key]=" + key );
}

function setSettingByBase( base, id, key, value ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/set-setting?id=" + id, "Meta[key]=" + key + "&Meta[value]=" + value );
}

function removeSettingByBase( base, id, key ) {

	cmt.utils.ajax.triggerPost( ajaxUrl + base + "/remove-setting?id=" + id, "Meta[key]=" + key );
}

// == Additional Methods ==================

function initDataCmtDirect() {

	jQuery( '.cmt-data-direct' ).change( function() {

		var element = jQuery( this );
		var base	= element.attr( 'data-base' );
		var id		= element.attr( 'data-id' );
		var key		= element.attr( 'data-key' );
		var type	= element.attr( 'data-type' );

		switch( type ) {

			case 'data': {

				setDataByBase( base, id, key, element.val() );

				break;
			}
			case 'attribute': {

				setAttributeByBase( base, id, key, element.val() );

				break;
			}
			case 'config': {

				setConfigByBase( base, id, key, element.val() );

				break;
			}
			case 'setting': {

				setSettingByBase( base, id, key, element.val() );

				break;
			}
		}
	});
}
