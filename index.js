// requiring
var Skyweb = require('skyweb');
var account = require('./account.json');

/*
 * LANCE
 *
 * Lovingly
 * Assembled by
 * Nick.
 * Conversational
 * Enthusiast 
 */

var skyweb = new Skyweb();

skyweb.login(account.user, account.pwd).then(function(skypeAccount){
	console.log("Skyweb is working, huzzah!")
});