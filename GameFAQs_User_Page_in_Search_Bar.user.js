// ==UserScript==
// @name           GameFAQs User Page in Search Bar
// @namespace      OTACON120
// @author         OTACON120
// @version        1.0
// @description    Adds "User Page" option to GameFAQs search bar
// @updateURL      http://userscripts.org/scripts/source/149779.meta.js
// @downloadURL    http://userscripts.org/scripts/source/149779.user.js
// @website        http://otacon120.com/user-scripts/gamefaqs-related/user-page-in-search-bar/
// @include        http://www.gamefaqs.com/*
// @match          http://www.gamefaqs.com/*
// @exclude        http://www.gamefaqs.com/users
// @exclude        http://www.gamefaqs.com/users/
// ==/UserScript==
'use strict';

var searchForm		= document.getElementsByClassName('search')[0],
	searchField		= searchForm.getElementsByTagName('input')[0],
	jumperInSearch	= (searchForm.getElementsByTagName('select')[0] ? true : false),
	searchSubmit	= (jumperInSearch ? searchForm.getElementsByClassName('field submit')[0] : searchForm.getElementsByTagName('button')[0]),
	userPageOption = document.createElement('option'),
	getKey = new XMLHttpRequest,
	formKey = document.createElement('div'),
	inputKey = document.createElement('input');

// Setup user page option for dropdowns
userPageOption.value		= 'user-page';
userPageOption.textContent	= 'User Page';

// Grab hidden key from regular user page search on Users page
getKey.open('POST', '/users/', false);
getKey.setRequestHeader('Connection', 'close');
getKey.send();
formKey.id				= 'formKey';
formKey.innerHTML		= getKey.responseText;
formKey.style.display	= 'none';
document.body.appendChild(formKey);
formKey					= formKey.getElementsByClassName('col')[1].firstChild.getElementsByTagName('form')[0].firstChild.value;
document.body.removeChild(document.getElementById('formKey'));
inputKey.type			= 'hidden';
inputKey.value			= formKey;
inputKey.name			= 'key';
searchForm.appendChild(inputKey);

function changeToUP() {
	searchForm.action	= '/users/';
	searchForm.method	= 'post';
	searchField.name	= 'find';
}

function changeToSearch() {
	searchForm.action	= '/search/index.html';
	searchForm.method	= 'get';
	searchField.name	= 'game';
}

function getLabelStyle(elem, prop) {
	return window.getComputedStyle(elem, null).getPropertyValue(prop);
}

// If using V11 or lower, add "User Page" as option to platform selector in search form
if (jumperInSearch && getLabelStyle(searchForm.getElementsByClassName('platform')[0], 'display') != 'none') {
	var platformJumper = searchForm.getElementsByTagName('select')[0];

	//Change regular search form attributes to match user page search, or switch back to normal
	platformJumper.onchange = function() {
		if (this.options[this.selectedIndex].value === 'user-page') {
			changeToUP();
		} else {
			changeToSearch();
		}
	}

	platformJumper.insertBefore(userPageOption, platformJumper.options[0]);
} else if (getLabelStyle(searchForm.getElementsByTagName('a')[0].parentNode, 'display') != 'none') { // Using V12 or something custom, so let's change the "Search:" label to a dropdown since the platform jumper is now separate
	var searchLabel		= searchForm.getElementsByTagName('a')[0],
		searchDDContain	= document.createElement('div'),
		searchDD		= document.createElement('select'),
		searchDDFacade	= document.createElement('div'),
		searchOption	= document.createElement('option'),
		searchDDCSS		= document.createElement('style');

	searchDDCSS.id					= 'user-page-search';
	searchDDCSS.type				= 'text/css';
	searchDDCSS.textContent			= (document.getElementById('searchbox') && getLabelStyle(document.getElementById('searchbox').getElementsByClassName('mh_wrap')[0].getElementsByClassName('search')[0], 'width') == '260px' ? '#searchbox form.search {width: 300px !important;}' : '') + '#searchDD-contain {position: relative; display: inline-block; white-space: nowrap;} #searchDD {opacity: 0; cursor: pointer;} #searchDDFacade {position: absolute; z-index: 0; background: transparent; border: none; font-size: ' + getLabelStyle(searchLabel, 'font-size') + '; color: ' + getLabelStyle(searchLabel, 'color') + '; font-weight: ' + getLabelStyle(searchLabel, 'font-weight') + '; right: ' + (jumperInSearch ? '0' : '8px') + ';} #searchDD-contain, #searchDDFacade, #searchDD {text-align: right; height: ' + getLabelStyle(searchLabel, 'height') + '; line-height: ' + getLabelStyle(searchLabel, 'line-height') + '; vertical-align: ' + getLabelStyle(searchLabel, 'vertical-align') + ';} .up-dd-arrow {font-size: .8em;}';
	document.head.appendChild(searchDDCSS);

	searchDDContain.id			= 'searchDD-contain';
	searchDD.id					= 'searchDD';
	searchDDFacade.id			= 'searchDDFacade';
	searchDDFacade.innerHTML	= '<span class="up-dd-arrow">&#9660;</span>Search: ';
	searchOption.value			= 'search';
	searchOption.textContent	= 'Search:';

	if (jumperInSearch) {
		searchDDContain.className = 'name';
	}

	searchDD.onchange = function() {
		switch(this.options[this.selectedIndex].value) {
			case 'user-page':
				changeToUP();
				searchDDFacade.innerHTML = '<span class="up-dd-arrow">&#9660;</span>' + this.options[this.selectedIndex].textContent;
				break;

			case 'search':
				changeToSearch();
				searchDDFacade.innerHTML = '<span class="up-dd-arrow">&#9660;</span>' + this.options[this.selectedIndex].textContent;
				break;
		}
	}

	userPageOption.innerHTML += ':';

	searchDD.appendChild(searchOption);
	searchDD.appendChild(userPageOption);

	searchDDContain.appendChild(searchDDFacade);
	searchDDContain.appendChild(searchDD);

	if (jumperInSearch) {
		searchLabel.parentNode.parentNode.removeChild(searchLabel.parentNode);
		searchForm.getElementsByClassName('search_term')[0].insertBefore(searchDDContain, searchField.parentNode);
	} else {
		searchForm.removeChild(searchLabel);
		searchForm.insertBefore(searchDDContain, searchField);
	}
} else {
	var userPageCBContain		= document.createElement('div'),
		userPageCB				= document.createElement('input'),
		userPageCBLabel			= document.createElement('label'),
		userPageCBCSS			= document.createElement('style');

	userPageCBCSS.id			= 'user-page-search';
	userPageCBCSS.type			= 'text/css';
	userPageCBCSS.textContent	= '#searchbox form.search {overflow: display !important;} #user-page-cb-label {color: ' + getLabelStyle(document.getElementById('quicknav').getElementsByTagName('a')[0], 'color') + ';}';

	userPageCBContain.id		= 'user-page-contain';
	userPageCB.type				= 'checkbox';
	userPageCB.id				= 'user-page-cb';
	userPageCBLabel.setAttribute('for', 'user-page-cb');
	userPageCBLabel.id			= 'user-page-cb-label';
	userPageCBLabel.innerHTML	= ' User Page';
	userPageCB.onclick			= userPageCBLabel.onclick = function() {
		if (userPageCB.checked) {
			changeToUP();
		} else {
			changeToSearch();
		}
	}

	document.head.appendChild(userPageCBCSS);
	userPageCBContain.appendChild(userPageCB);
	userPageCBContain.appendChild(userPageCBLabel);

	searchForm.appendChild(userPageCBContain);
}