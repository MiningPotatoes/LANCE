// requiring
var Skyweb = require('skyweb');
var account = require('./account.json');

var commandPrefix = "$";

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
	    	console.log(message.resource.from.substring("https://bn2-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:".length) + ": " + message.resource.content);

	    	// avoids the bot's own messages
	        if(message.resource.from.indexOf(account.user) === -1) {
	            var conversationLink = message.resource.conversationLink;
	            var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);

	            if(message.resource.content.substring(0, 1) === commandPrefix) {
	            	parseCommand(message.resource.content.substring(1), conversationId);
	            } else if(message.resource.content.substring(0, 10).toLowerCase() === "yo lance, ") {
	            	parseCommand(message.resource.content.substring(10), conversationId);
	            }
	        }
    	}
    });
};

// where all the magic happens.
function parseCommand(cmd, convoId) {
	var cmdArgs = cmd.split(" ");
	switch(cmdArgs[0]) {
		case "help":
			skyweb.sendMessage(convoId, "Lance's commands:\n" +
			commandPrefix + "help: Shows this help dialog\n" +
			commandPrefix + "ping: Pong!");
			break;
		case "ping":
			skyweb.sendMessage(convoId, "Pong!");
			break;
		default:
			skyweb.sendMessage(convoId, "Lance doesn't recognize this command. Look at " + commandPrefix + "help for available commands.");
			break;
	}
}