// == Application =========================

jQuery( document ).ready( function() {
	
	// Access App
	var app = cmt.api.root.getApplication( 'org' );

	// Map Services
	app.mapService( 'organization', 'cmg.org.services.OrganizationService' );

	// Event Listeners
	app.getService( 'organization' ).initListeners();
});

// == Organization Service ================

cmg.org.services.OrganizationService = function() {};

cmg.org.services.OrganizationService.inherits( cmt.api.services.BaseService );

cmg.org.services.OrganizationService.prototype.initListeners = function() {

	// Init Organization Service
}

// == Additional Methods ==================
