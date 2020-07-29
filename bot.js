var Discord = require('discord.io');
var auth = require('./auth.json');

var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function(out){
	console.log('Connected!');
	console.log('Logged in as: ' + bot.username + '#' + bot.discriminator);
});

bot.on('message', function (user, userID, channelID, message, out){
	if(channelID === auth.rolechannel || channelID === auth.devchannel) {
		//Only listen to messages that start with 'give me role'
		if (message.substring(0, 12).toLowerCase() === 'give me role') {
			//Split message into strings and get the string that starts with #
			var color = message.substring(13).split(' ');
			for (var i = 0; i < color.length; i++) {
				if (color[i].substring(0, 1) === '#') {
					color = color[i];
					break;
				}
			}

			//Split message into strings
			var role = message.substring(13).split('"');
			for (var i = 0; i < role.length; i++) {
				if (role[i].substring(0, 1) !== '#' && role[i].substring(0, 1) !== '') {
					role = role[i];
					break;
				}
			}

			//Check if role and color have been provided
			if (role != "") {
				if (color != "") {
					var server = out.d.guild_id;
					var user = out.d.author.id;
					var un = out.d.author.username;
					var disc = out.d.author.discriminator
					//Create role
					bot.createRole(server, function (err, res) {
						if (!err) {
							var roleid = res.id;
							var perms = res.permissions;
							var roleopts = {
								'serverID': server,
								'roleID': roleid,
								'name': role,
								'color': color,
								'hoist': true,
								'permissions': perms,
								'mentionable': false
							}
							//Edit role just created
							bot.editRole(roleopts, function (err, res) {
								if (!err) {
									var useropts = {
										'serverID': server,
										'userID': user,
										'roleID': roleid
									};
									//Add user to role
									bot.addToRole(useropts, function (err, res) {
										if (!err) {
											bot.sendMessage({
												to: channelID,
												message: 'Assigned role ' + role + ' to ' + un + '#' + disc
											});
										}
									});
								}
							});
						}
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: 'You need to include a hex color, like this: #ABCDEF!'
					});
				}
			} else {
				bot.sendMessage({
					to: channelID,
					message: 'You need to include a role in quotations, like this: "Cool Role"!'
				});
			}
		}
	}
});