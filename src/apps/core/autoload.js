// == Application =========================

jQuery( document ).ready( function() {

	// Register App
	var app	= cmt.api.root.registerApplication( 'autoload', 'cmt.api.Application', { basePath: ajaxUrl } );

	// Map Controllers
	app.mapController( 'autoload', 'cmg.core.controllers.AutoloadController' );

	// Register Listeners
	cmt.api.utils.request.register( app, jQuery( '[cmt-app=autoload]' ) );
});

// == Controller Namespace ================

// == Autoload Controller =================

cmg.core.controllers.AutoloadController	= function() {};

cmg.core.controllers.AutoloadController.inherits( cmt.api.controllers.RequestController );

cmg.core.controllers.AutoloadController.prototype.autoloadActionSuccess = function( requestElement, response ) {

	if( cmt.utils.object.hasProperty( response.data, 'widgetId' ) && cmt.utils.object.hasProperty( response.data, 'widgetHtml' ) ) {

		var widget = jQuery( '#' + response.data.widgetId );
		
		if( widget.length > 0 ) {

			widget.html( response.data.widgetHtml );
		}
	}
};

// == Direct Calls ========================

// == Additional Methods ==================

document.addEventListener( "DOMContentLoaded", initLazyWidgetObserver );

function initLazyWidgetObserver() {

	var widgets = [].slice.call( document.querySelectorAll( '.cmt-lazy-widget' ) );

	// Insersection Observer support
	if( "IntersectionObserver" in window ) {

		intersectionObserver = new IntersectionObserver( function( entries, observer ) {

			entries.forEach( function( entry ) {

				if( entry.intersectionRatio > 0 || entry.isIntersecting ) {

					target = entry.target;

					processLazyWidget( target );

					observer.unobserve( target );
				}
			});
		});

		widgets.forEach( function( lazyImage ) {

			intersectionObserver.observe( lazyImage );
		});
	}
	else {

		// Use fallback using scroll listener
		initLazyWidgetListener( widgets );
	}
}

function initLazyWidgetListener( elements ) {

	// Flag to relax the listener from continuous checking
	var active = false;

	// The actual listener to listen for scroll, resize and change in viewport orientation
	var lazyLoadListener = function() {

		if( active === false ) {

			active = true;

			setTimeout( function() {

				// Iterate over the elements collection for lazy loading
				elements.forEach( function( element ) {

					// Window intersection test
					if( ( element.getBoundingClientRect().top <= window.innerHeight && element.getBoundingClientRect().bottom >= 0 ) && getComputedStyle( element ).display !== "none" ) {

						processLazyWidget( element );

						// Remove from collection
						elements = elements.filter( function( target ) {

							return element !== target;
						});

						// Stop lazy loading
						if( elements.length === 0 ) {

							document.removeEventListener( 'scroll', lazyLoadListener );
							window.removeEventListener( 'resize', lazyLoadListener );
							window.removeEventListener( 'orientationchange', lazyLoadListener );
						}
					}
				});

				active = false;
			}, 200 );
		}
	};

	document.addEventListener( 'scroll', lazyLoadListener );
	window.addEventListener( 'resize', lazyLoadListener );
	window.addEventListener( 'orientationchange', lazyLoadListener );
}

function processLazyWidget( element ) {
	
	cmt.api.utils.request.trigger( cmt.api.root.getApplication( 'autoload' ), element, false, element.find( '.cmt-click' ) );
}
