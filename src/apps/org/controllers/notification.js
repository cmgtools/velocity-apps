// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'orgNotify', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=orgNotify]' ) );

	// Map Controllers
	app.mapController( 'notification', 'cmg.org.controllers.NotificationController' );

	jQuery( document.body ).append( jQuery( '#orgNotificationData' ).detach() );
	jQuery( document.body ).append( jQuery( '#orgReminderData' ).detach() );
	jQuery( document.body ).append( jQuery( '#orgActivityData' ).detach() );
	jQuery( document.body ).append( jQuery( '#orgAnnouncementData' ).detach() );

	if( jQuery( '[cmt-app=orgNotify]' ).length > 0 ) {

		cmt.api.utils.request.triggerDirect( app, 'notification', 'stats', 'org/notify/stats/stats', 'get' );
	}
});

// == Notification Controller =============

cmg.org.controllers.NotificationController = function() {};

cmg.org.controllers.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.org.controllers.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// Single read
cmg.org.controllers.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

// Header read
cmg.org.controllers.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

	var clickBtn = requestElement.find( '.cmt-click' );

	var type	= clickBtn.attr( 'type' );
	var count	= response.data.unread;

	if( response.data.consumed ) {

		var headerCounter = jQuery( ".count-header.count-header-all" );

		if( headerCounter.length > 0 ) {

			var val = parseInt( headerCounter.html() ) - 1;

			headerCounter.html( val );
		}

		jQuery( ".count-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).html( count );

		if( count == 0 ) {

			jQuery( ".count-header.count-header-all" ).fadeOut( 'fast' );
			jQuery( ".count-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).fadeOut( 'fast' );
		}

		clickBtn.removeClass( 'link' );
		clickBtn.addClass( 'text text-gray' );
	}

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
};

cmg.org.controllers.NotificationController.prototype.toggleTrashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.org.controllers.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.org.controllers.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Stats Calls =========================

cmg.org.controllers.NotificationController.prototype.statsActionSuccess = function( response ) {

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

cmg.org.controllers.NotificationController.prototype.notificationDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'orgNotificationData' ).innerHTML;
	var action	= jQuery( '#popuout-action-notify-notification' );

	if( data.hasOwnProperty( 'notifications' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.notifications , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.notifications.length > 0 ) {

			if( action.length > 0 && cmt.utils.data.hasAttribute( action, 'data-status' ) ) {

				output += '<li class="align align-center"><a href="' + siteUrl + 'organization/notification/all?status=' + action.attr( 'data-status' ) + '">View All</a></li>';
			}
			else {

				output += '<li class="align align-center"><a href="' + siteUrl + 'organization/notification/all">View All</a></li>';
			}
		}
		else {

			output = "<li>Notifications not found.</li>";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-notification" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-notification').find( '[cmt-app=notify]' ) );
	}
}

cmg.org.controllers.NotificationController.prototype.reminderDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'orgReminderData' ).innerHTML;
	var action	= jQuery( '#popuout-action-notify-reminder' );

	if( data.hasOwnProperty( 'reminders' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.reminders , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.reminders.length > 0 ) {

			if( action.length > 0 && cmt.utils.data.hasAttribute( action, 'data-status' ) ) {

				output += '<li class="align align-center"><a href="' + siteUrl + 'organization/reminder/all?status=' + action.attr( 'data-status' ) + '">View All</a></li>';
			}
			else {

				output += '<li class="align align-center"><a href="' + siteUrl + 'organization/reminder/all">View All</a></li>';
			}
		}
		else {

			output = "<li>Reminders not found.</li>";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-reminder" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery('#popout-reminder').find( '[cmt-app=notify]' ) );
	}
}

cmg.org.controllers.NotificationController.prototype.activityDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'orgActivityData' ).innerHTML;

	if( data.hasOwnProperty( 'activities' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.activities , function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.activities.length > 0 ) {

			output += '<li class="align align-center"><a href="' + siteUrl + 'organization/activity/all">View All</a></li>';

		}
		else {

			output = "<li>Activites not found.</li>";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-activity" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery( '#popout-activity' ).find( '[cmt-app=notify]' ) );
	}
}

cmg.org.controllers.NotificationController.prototype.announcementDataActionSuccess = function( requestElement, response ) {

	var data	= response.data;
	var source 	= document.getElementById( 'orgAnnouncementData' ).innerHTML;

	if( data.hasOwnProperty( 'announcements' ) ) {

		var output = '';

		var template = Handlebars.compile( source );

		jQuery.each( data.announcements, function( index, value ) {

			output += template( { data : value, siteUrl: siteUrl } );
		});

		if( data.announcements.length > 0 ) {

			output += '<li class="align align-center"><a href="' + siteUrl + 'organization/announcement/all">View All</a></li>';

		}
		else {

			output = "<li>Announcements not found.</li>";
		}

		output = "<ul>" + output +"</ul>";

		jQuery( "#popout-announcement" ).find( ".popout-content" ).html( output );

		cmt.api.utils.request.register( cmt.api.root.getApplication( 'notify' ), jQuery( '#popout-announcement' ).find( '[cmt-app=notify]' ) );
	}
}

// == Direct Calls ========================

// == Additional Methods ==================
