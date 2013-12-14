// ==UserScript==
// @name           GameFAQs User Page in Search Bar
// @namespace      OTACON120
// @author         OTACON120
// @version        1.1
// @description    Adds "User Page" option to GameFAQs search bar
// @updateURL      http://userscripts.org/scripts/source/149779.meta.js
// @downloadURL    http://userscripts.org/scripts/source/149779.user.js
// @website        http://otacon120.com/scripts/user-page-in-search-bar/
// @include        http://www.gamefaqs.com/*
// @match          http://www.gamefaqs.com/*
// @exclude        http://www.gamefaqs.com/users
// @exclude        http://www.gamefaqs.com/users/
// @grant          GM_addStyle
// ==/UserScript==

/**
 * Fallback for Chrome which doesn't support GM_addStyle
 */
if ( !this.GM_addStyle ) {
	this.GM_addStyle = function( css ) {
		var newStyle = document.createElement( 'style' );

		newStyle.type        = 'text/css';
		newStyle.textContent = css;

		document.head.appendChild( newStyle );
	};
}

/**
 * Get specified CSS property value
 * @param  {node}   el        HTML Element from which to grab CSS
 * @param  {string} styleProp CSS property to grab
 * @return {string}           Value of CSS property
 */
function getStyle(el, styleProp) {
	return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
}

/**
 * Toggle search form between game search and user search
 */
function changeSearch() {
	var sfAction, sfMethod, sfPlaceholder;

	switch ( this.value ) {
		case 'find':
			sfAction      = '/users/';
			sfMethod      = 'post';
			sfPlaceholder = 'Search Users';
			break;

		case 'game':
			sfAction      = '/search/index.html';
			sfMethod      = 'get';
			sfPlaceholder = 'Search GameFAQs';
			break;
	}

		searchForm.action       = sfAction;
		searchForm.method       = sfMethod;
		searchField.name        = this.value;
		searchField.placeholder = sfPlaceholder;
}

function sdOnFocus() {
	searchDrawer.className += 'active';
}

function sdOnBlur() {
	searchDrawer.className = searchDrawer.className.replace( 'active', '' );
}

var i, searchDrawerDD, searchDrawerRD, leftPos, rightPos, bottomPos, sdHeight, sdBorderColor,
	v12Style        = document.head.querySelector( 'link[href^="/css_wide/v12"]' ), // Check if using v12 style
	isMinimal       = document.head.querySelector( 'link[href^="/css_wide/cus_minimal"]' ), // Check if using Minimalist style
	is800           = document.head.querySelector( 'link[href^="/css_wide/v12_new_800px"]' ), // Check if using v12 800px style
	mastheadStrip   = document.getElementsByClassName('masthead_strip')[0],
	searchForm      = document.getElementsByClassName( 'masthead_search' )[0].getElementsByClassName( 'search' )[0],
	searchField     = document.getElementById( 'searchtextbox' ),
	searchSubmit    = searchForm.getElementsByClassName( 'icon icon-search' )[0],
	getKey          = new XMLHttpRequest(),
	searchDrawer    = document.createElement( 'div' ),
	formKey         = document.createElement( 'div' ),
	inputKey        = document.createElement( 'input' );

if ( isMinimal )
	throw "stop execution";

searchDrawer.id        = 'o120-user-page-drawer';

if ( v12Style ) {
	searchDrawer.innerHTML = '<select id="o120-search-select" size="1" class="o120-search-select"><option value="game">Search GameFAQs</option><option value="find">Search Users</option></select>';

	searchDrawerDD          = searchDrawer.getElementsByClassName( 'o120-search-select' )[0];
	searchDrawerDD.onchange = changeSearch;
	searchDrawerDD.onfocus  = sdOnFocus;
	searchDrawerDD.onblur   = sdOnBlur;
} else {
	searchDrawer.innerHTML = '<div id="o120-games-rd-contain" class="o120-rd-contain"><input type="radio" id="o120-games-rd" class="o120-uprd" name="o120-uprd" value="game" checked="checked" /> <label for="o120-games-rd"> Search GameFAQs</label></div><div id="o120-user-page-rd-contain" class="o120-rd-contain"><input type="radio" id="o120-user-page-rd" class="o120-uprd" name="o120-uprd" value="find" /> <label for="o120-user-page-rd">Search Users</label></div>';

	searchDrawerRD         = searchDrawer.getElementsByClassName( 'o120-uprd' );

for ( i = 0; i < searchDrawerRD.length; i++ ) {
	searchDrawerRD[ i ].onclick = changeSearch;
	searchDrawerRD[ i ].onfocus = sdOnFocus;
	searchDrawerRD[ i ].onblur  = sdOnBlur;
}
}

// Grab hidden key from regular user page search on Users page
getKey.open( 'POST', '/users/', false );
getKey.setRequestHeader( 'Connection', 'close' );
getKey.send();
formKey.id				= 'o120-formKey';
formKey.innerHTML		= getKey.responseText;
formKey.style.display	= 'none';
document.body.appendChild( formKey );
formKey					= formKey.getElementsByClassName( 'span4' )[0].firstChild.getElementsByTagName( 'form' )[0].firstChild.value;
document.body.removeChild(document.getElementById( 'o120-formKey' ));
inputKey.type			= 'hidden';
inputKey.value			= formKey;
inputKey.name			= 'key';
searchForm.getElementsByTagName( 'fieldset' )[0].appendChild( inputKey );

searchForm.getElementsByTagName( 'fieldset' )[0].insertBefore( searchDrawer, inputKey );

sdHeight = getStyle( searchDrawer, 'height' );

if ( v12Style ) {
	leftPos   = ( is800 ? 0 : 45 ) + 'px';
	rightPos  = 0;
	bottomPos = 'calc(((' + getStyle( mastheadStrip, 'height' ) + ' - ' + getStyle( searchDrawer.parentNode, 'height' ) + ') / 2) - ' + sdHeight + ' - 10px)';
	sdBorder  = getStyle( mastheadStrip, 'border-bottom' );
} else {
	leftPos   = rightPos = '25px';
	bottomPos = 'calc((' + sdHeight + ' - ' + getStyle( searchDrawer.parentNode, 'height' ) + ') - 10px)';
	sdBorder  = getStyle( document.documentElement, 'background-color' );
}


GM_addStyle('\
.masthead {\
	position: relative;\
	z-index: 1;\
}\
\
.masthead_strip,\
.masthead_main {\
	position: relative;\
	z-index: initial;\
}\ ' + ( ! v12Style ? '\
\
.masthead_main {\
	background: ' + getStyle( document.getElementsByClassName( 'masthead' )[0], 'background-color' ) + ';\
}\ ' : '' ) + '\
\
#o120-user-page-drawer {\
	background: ' + getStyle( mastheadStrip, 'background-color' ) + ';\
	position: absolute;\
	left: ' + leftPos + ';\
	right: ' + rightPos + ';\
	bottom: 0;\
	padding: 3px 0;\
	border: 1px solid ' + sdBorder + ';\
	border-top: 0;\
	border-radius: 0 0 15px 15px;\
	text-align: center;\
	z-index: -1;\
	-webkit-transition: bottom 0.4s ease-out;\
	-moz-transition:    bottom 0.4s ease-out;\
	-o-transition:      bottom 0.4s ease-out;\
	transition:         bottom 0.4s ease-out;\
}\
#searchtextbox:focus + #o120-user-page-drawer,\
#o120-user-page-drawer:hover,\
#o120-user-page-drawer.active {\
	bottom: ' + bottomPos + ';\
}\
\
	.o120-rd-contain {\
		display: inline-block;\
		font-size: 1.1em;\
	}\
\
	#o120-games-rd-contain {\
		margin: 0 8px 0 0;\
	}\
\
	#o120-user-page-rd-contain {\
		margin: 0 0 0 8px;\
	}\
\
#leader_top-wrap,\
#leader_plus_top-wrap {\
	position: relative;\
	z-index: 0;\
}\
 ' + ( v12Style ? '\
 .masthead_systems {\
 	z-index: 0;\
 }\
 \
 .masthead_search {\
 	z-index: initial;\
 }\
  ' : '') );