// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'org' );

	// Map Controllers
	app.mapController( 'organization', 'cmg.org.controllers.OrganizationController' );
	app.mapController( 'department', 'cmg.org.controllers.DepartmentController' );
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

// == Department Controller ===============

cmg.org.controllers.DepartmentController = function() {};

cmg.org.controllers.DepartmentController.inherits( cmt.api.controllers.RequestController );

cmg.org.controllers.DepartmentController.prototype.orgSearchActionPre = function( requestElement ) {

	var autoFill = requestElement.closest( '.auto-fill' );

	var name = autoFill.find( '.search-name' ).val();
	var type = autoFill.find( '.search-type' );

	if( name.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.auto-fill-target .target' ).val( '' );

		return false;
	}

	var orgId = requestElement.closest( '.wrap-org-dept' ).find( '.org' ).val();

	if( orgId.length > 0 ) {

		this.requestData = 'oid=' + orgId;

		if( type.length == 1 ) {

			this.requestData += "&name=" + name + "&type=" + type.val();
		}
		else {

			this.requestData += "&name=" + name;
		}

		return true;
	}

	return false;
};

cmg.org.controllers.DepartmentController.prototype.orgSearchActionSuccess = function( requestElement, response ) {

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
