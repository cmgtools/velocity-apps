// == Application =========================

jQuery( document ).ready( function() {

	// Access App
	var app = cmt.api.root.getApplication( 'notify' );

	// Map Controllers
	app.mapController( 'notification', 'cmg.notify.controllers.NotificationController' );

	if( jQuery( '[cmt-app=notify]' ).length > 0 ) {

		cmt.api.utils.request.triggerDirect( cmt.api.root.getApplication( 'notify' ), 'notification', 'stats', 'notify/stats/stats', 'get' );
	}

	jQuery( document.body ).append( jQuery( '#notificationData' ).detach() );
	jQuery( document.body ).append( jQuery( '#reminderData' ).detach() );
	jQuery( document.body ).append( jQuery( '#activityData' ).detach() );
	jQuery( document.body ).append( jQuery( '#announcementData' ).detach() );
});

// == Notification Controller =============

cmg.notify.controllers.NotificationController = function() {};

cmg.notify.controllers.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.notify.controllers.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// Single read
cmg.notify.controllers.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

// Header read
cmg.notify.controllers.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

	var clickBtn = requestElement.find( '.cmt-click' );

	var type	= clickBtn.attr( 'type' );
	var count	= response.data.unread;

	if( response.data.consumed ) {

		jQuery( ".count-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).html( count );

		if( count == 0 ) {

			jQuery( ".count-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).fadeOut( 'fast' );
		}
	}

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
};

cmg.notify.controllers.NotificationController.prototype.toggleTrashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.notify.controllers.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Stats Calls =========================

cmg.notify.controllers.NotificationController.prototype.statsActionSuccess = function( response ) {

	var data = response.data;

	if( data.hasOwnProperty( 'notificationCount' ) ) {

		jQuery( '.count-notification' ).html( data[ 'notificationCount' ] );
	}

	if( data.hasOwnProperty( 'reminderCount' ) ) {
	
		jQuery( '.count-reminder' ).html( data[ 'reminderCount' ] );
	}
	
	if( data.hasOwnProperty( 'activityCount' ) ) {

		jQuery( '.count-activity' ).html( data[ 'activityCount' ] );
	}
	
	if( data.hasOwnProperty( 'announcementCount' ) ) {

		jQuery( '.count-announcement' ).html( data[ 'announcementCount' ] );
	}
}

cmg.notify.controllers.NotificationController.prototype.notificationDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'notificationData' ).innerHTML;

	if( data.hasOwnProperty( 'notifications' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.notifications , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.notifications.length > 0 ) {

			output += "<li class='align align-center'><a href='" + siteUrl + "notify/notification/all'>View All</a></li>";
		} 
		else {

			output = "Notifications not found.";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-notification" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-notification').find( '[cmt-app=notify]' ) );
	}
}

cmg.notify.controllers.NotificationController.prototype.reminderDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'reminderData' ).innerHTML;
	
	if( data.hasOwnProperty( 'reminders' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.reminders , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.reminders.length > 0 ) {

			output += "<li class='align align-center'><a href='"+siteUrl+"notify/reminder/all'>View All</a></li>";
		}
		else {

			output = "Reminders not found.";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-reminder" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-reminder').find( '[cmt-app=notify]' ) );	
	}
}

cmg.notify.controllers.NotificationController.prototype.activityDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'activityData' ).innerHTML;

	if( data.hasOwnProperty( 'activities' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.activities , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.activities.length > 0 ) {

			output += "<li class='align align-center'><a href='"+siteUrl+"notify/activity/all'>View All</a></li>";

		}
		else {

			output = "Activites not found.";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-activity" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery( '#popout-activity' ).find( '[cmt-app=notify]' ) );	
	}
}

cmg.notify.controllers.NotificationController.prototype.announcementDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'announcementData' ).innerHTML;

	if( data.hasOwnProperty( 'announcements' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.announcements, function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.announcements.length > 0 ) {

			output += "<li class='align align-center'><a href='" + siteUrl + "notify/announcement/all'>View All</a></li>";

		}
		else {

			output = "Announcements not found.";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-announcement" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery( '#popout-announcement' ).find( '[cmt-app=notify]' ) );	
	}
}

// == Direct Calls ========================

// == Additional Methods ==================
