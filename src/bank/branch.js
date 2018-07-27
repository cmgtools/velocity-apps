// == Application =========================

jQuery( document ).ready( function() {

	var app = cmt.api.root.getApplication( 'bank' );

	// Map Controllers
	app.mapController( 'branch', 'cmg.controllers.bank.BranchController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=bank]' ) );
});

// == Controller Namespace ================

// == Branch Controller ===================

cmg.controllers.bank.BranchController = function() {};

cmg.controllers.bank.BranchController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.bank.BranchController.prototype.optionsListActionPre = function( requestElement ) {

	var bank = requestElement.find( 'select' );

	this.requestData = "bank-id=" + bank.val();

	if( cmt.utils.data.hasAttribute( bank, 'branch' ) ) {

		this.requestData += "&branch-id=" + bank.attr( 'branch' );
	}

	return true;
};

cmg.controllers.bank.BranchController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.frm-account' ).find( '.wrap-branch .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================
