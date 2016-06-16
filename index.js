// requiring
var Skyweb = require('skyweb');
var account = require('./account.json');

var commandPrefix = "$";

var badLanguage = [
	"poopyface",
	"holy shy",
];

// thanks MDN javascript ref
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * LANCE
 *
 * Lovingly
 * Assembled by
 * Nick.
 * Conversational
 * Enthusiast 
 */

var skypeNameAddon = "https://bn2-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:";


var skyweb = new Skyweb();

skyweb.login(account.user, account.pwd).then(function(skypeAccount){
	console.log("Skype account \"" + account.user + "\" attached.");
});

// accept all contact requests
skyweb.authRequestCallback = (requests) => {
    requests.forEach((request) => {
        skyweb.acceptAuthRequest(request.sender);
        skyweb.sendMessage("8:" + request.sender, "Lance welcomes you.");
    });
};

// parse message requests
skyweb.messagesCallback = (messages) => {
    messages.forEach((message) => {
    	// avoids "is typing..." messages
    	if(message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping') {
	    	console.log(message.resource.from.substring(skypeNameAddon.length) + ": " + message.resource.content);
	    	// avoids the bot's own messages
	        if(message.resource.from.substring(skypeNameAddon.length).indexOf(account.user) === -1) {
	            var conversationLink = message.resource.conversationLink;
	            var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);

	            // is there a "curse?"
	            badLanguage.forEach((swear) => {
	            	if(message.resource.content.includes(swear)) {
	            		skyweb.sendMessage(conversationId, "Hey! Watch your language, " + message.resource.imdisplayname + ".");
	            	}
	            });

	            if(message.resource.content.substring(0, 1) === commandPrefix) {
	            	parseCommand(message.resource.content.substring(1), conversationId, message);
	            } else if(message.resource.content.substring(0, 10).toLowerCase() === "yo lance, ") {
	            	parseCommand(message.resource.content.substring(10), conversationId, message);
	            }
	        }
    	}
    });
};

// where all the magic happens.
function parseCommand(cmd, convoId, message) {
	var cmdArgs = cmd.split(" ");
	switch(cmdArgs[0]) {
		case "help":
			skyweb.sendMessage(convoId, "Lance's commands:\n" +
			commandPrefix + "help: Shows this help dialog\n" +
			commandPrefix + "ping: Pong!\n" +
			commandPrefix + "dice: Rolls a die.\n" + 
			commandPrefix + "privilege: Checks your privilege.");
			break;
		case "ping":
			skyweb.sendMessage(convoId, "Pong!");
			break;
		case "dice":
			if(typeof cmdArgs[1] === "undefined") {
				var diceRoll = getRandomIntInclusive(1, 6);
				skyweb.sendMessage(convoId, "Your d6 rolled a " + diceRoll + "!");
			} else {
				if(!isNaN(cmdArgs[1])) {
					var diceRoll = getRandomIntInclusive(1, cmdArgs[1]);
					skyweb.sendMessage(convoId, "Your d" + cmdArgs[1] + " rolled a " + diceRoll + "!");
				} else {
					skyweb.sendMessage(convoId, "Looks like the amount of sides on your die wasn't a number. Try again!")
				}
			}
			break;
		case "privilege":
			skyweb.sendMessage(convoId, message.resource.imdisplayname + ", your privilege is currently " + (Math.random() * 10) + ".");
			break;
		default:
			skyweb.sendMessage(convoId, "Lance doesn't recognize this command. Look at " + commandPrefix + "help for available commands.");
			break;
	}
}