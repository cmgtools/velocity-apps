// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app	= cmt.api.root.getApplication( 'core' );

	// Map Controllers
	app.mapController( 'address', 'cmg.core.controllers.AddressController' );
});

// == Address Controller ==================

cmg.core.controllers.AddressController = function() {

	this.app = cmt.api.root.getApplication( 'core' );

	this.modelService = this.app.getService( 'address' );
};

cmg.core.controllers.AddressController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.AddressController.prototype.getActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );	
	var address		= requestElement.closest( '.cmt-address' );

	// Show Update Form
	this.modelService.initUpdateForm( container, address, response.data );
};

cmg.core.controllers.AddressController.prototype.addActionSuccess = function( requestElement, response ) {

	var container = this.modelService.findContainer( requestElement );

	// Add Item to List
	this.modelService.add( container, response.data );
};

cmg.core.controllers.AddressController.prototype.updateActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	this.modelService.refresh( container, address, response.data );
};

cmg.core.controllers.AddressController.prototype.deleteActionSuccess = function( requestElement, response ) {

	var container	= this.modelService.findContainer( requestElement );
	var address		= container.find( '.cmt-address[data-id=' + response.data.cid + ']' );

	this.modelService.remove( container, address );
};

// == Direct Calls ========================

// == Additional Methods ==================
