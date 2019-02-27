// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'bank' );

	// Map Controllers
	app.mapController( 'branch', 'cmg.bank.controllers.BranchController' );
});

// == Branch Controller ===================

cmg.bank.controllers.BranchController = function() {};

cmg.bank.controllers.BranchController.inherits( cmt.api.controllers.BaseController );

cmg.bank.controllers.BranchController.prototype.optionsListActionPre = function( requestElement ) {

	var bank = requestElement.find( 'select' );

	this.requestData = "bank-id=" + bank.val();

	if( cmt.utils.data.hasAttribute( bank, 'branch' ) ) {

		this.requestData += "&branch-id=" + bank.attr( 'branch' );
	}

	return true;
};

cmg.bank.controllers.BranchController.prototype.optionsListActionSuccess = function( requestElement, response ) {

	var selectWrap = requestElement.closest( '.frm-account' ).find( '.wrap-branch .cmt-select-wrap' );

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );
};

// == Direct Calls ========================

// == Additional Methods ==================
