require('dotenv').config();
const { Client, MessageAttachment } = require('discord.js');
const axios = require('axios');

const client = new Client();

const b99Characters = {
	jake    : {
		lastName : 'peralta',
		img      :
			'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-Brooklyn-99-Andy-Sanberg.jpg'
	},
	amy     : {
		lastName : 'santiago',
		img      :
			'https://i.pinimg.com/originals/b1/fd/c8/b1fdc8699f5cfa6f0bca0fb3edc25e66.jpg'
	},
	charles : {
		lastName : 'boyle',
		img      :
			'https://media1.popsugar-assets.com/files/thumbor/M_nxKSJOH9k_V-2mydvjlxxMoWA/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2013/10/21/908/n/1922283/bc7d30202ce2737b_B99.107.13_1_/i/Brooklyn-Nine-NineDet-Charles-Boyle-Joe-Lo-Truglio-dresses.jpg'
	},
	gina    : {
		lastName : 'linetti',
		img      :
			'https://deecrowseer.files.wordpress.com/2017/04/b99-s4-cp01.jpg'
	},
	terry   : {
		lastName : 'jeffords',
		img      :
			'https://i.insider.com/5d37295336e03c26425ae424?width=1136&format=jpeg'
	},
	raymond : {
		lastName : 'holt',
		img      :
			'https://media.thetab.com/blogs.dir/90/files/2020/04/screenshot-2020-04-20-at-170615-1024x650.png'
	},
	rosa    : {
		lastName : 'diaz',
		img      :
			'https://goat.com.au/wp-content/uploads/2019/03/Brooklyn99-Rosa-hero.jpg'
	}
};

const b99CharactersLastNames = {
	peralta  : {
		firstName : 'jake',
		img       :
			'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-Brooklyn-99-Andy-Sanberg.jpg'
	},
	santiago : {
		firstName : 'amy',
		img       :
			'https://i.pinimg.com/originals/b1/fd/c8/b1fdc8699f5cfa6f0bca0fb3edc25e66.jpg'
	},
	boyle    : {
		firstName : 'charles',
		img       :
			'https://media1.popsugar-assets.com/files/thumbor/M_nxKSJOH9k_V-2mydvjlxxMoWA/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2013/10/21/908/n/1922283/bc7d30202ce2737b_B99.107.13_1_/i/Brooklyn-Nine-NineDet-Charles-Boyle-Joe-Lo-Truglio-dresses.jpg'
	},
	linetti  : {
		firstName : 'gina',
		img       :
			'https://deecrowseer.files.wordpress.com/2017/04/b99-s4-cp01.jpg'
	},
	jeffords : {
		firstName : 'terry',
		img       :
			'https://i.insider.com/5d37295336e03c26425ae424?width=1136&format=jpeg'
	},
	holt     : {
		firstName : 'raymond',
		img       :
			'https://media.thetab.com/blogs.dir/90/files/2020/04/screenshot-2020-04-20-at-170615-1024x650.png'
	},
	diaz     : {
		firstName : 'rosa',
		img       :
			'https://goat.com.au/wp-content/uploads/2019/03/Brooklyn99-Rosa-hero.jpg'
	}
};

client.on('message', async msg => {
	if (msg.author == client.user) return;
	if (msg.content.startsWith('?')) {
		// B99
		if (msg.content.startsWith('?b99')) {
			let character = msg.content.split(' ')[2];
			if (
				character &&
				(b99Characters[character] ||
					b99CharactersLastNames[character])
			) {
				if (msg.content.startsWith('?b99 img')) {
					const attachment = new MessageAttachment(
						b99Characters[character]
							? b99Characters[character].img
							: b99CharactersLastNames[
									character
								].img
					);
					msg.channel.send(attachment);
				} else if (
					msg.content.startsWith('?b99 quote')
				) {
					if (!b99CharactersLastNames[character])
						character =
							b99Characters[character]
								.lastName;
					const quotes = [];
					try {
						let quote = await axios.get(
							`https://b99-api.herokuapp.com/name/${character}?season=1`
						);
						quotes.push(quote.data);
						quote = await axios.get(
							`https://b99-api.herokuapp.com/name/${character}?season=2`
						);
						quotes.push(quote.data);
					} catch (err) {
						msg.reply(
							'Error fetching quote, please try again later...'
						);
					}
					msg.channel.send(
						quotes[
							Math.floor(Math.random() * 2)
						]
					);
				}
			} else {
				msg.reply('Invalid Character');
			}
		} else if (
			msg.content.startsWith('?stranger-things')
		) {
			const character = msg.content.split(' ')[1];
			try {
				const { data } = await axios.get(
					`http://stranger-things-api.herokuapp.com/api/v1/characters?name=${character}`
				);
				msg.channel.send(`Name: ${data[0].name}`);
				msg.channel.send(
					`Gender: ${data[0].gender}`
				);
				msg.channel.send(`Born: ${data[0].born}`);
				msg.channel.send(`Name: ${data[0].name}`);
				msg.channel.send(
					`Actor: ${data[0].portrayedBy}`
				);
				msg.channel.send(
					`Aliases: ${data[0].aliases.join(', ')}`
				);
			} catch (err) {
				msg.reply(
					'Error fetching character, please try again later...'
				);
				console.log(err);
			}
		} else {
			if (msg.content === '?meme') {
				try {
					const { data } = await axios.get(
						'https://meme-api.herokuapp.com/gimme'
					);
					const attachment = new MessageAttachment(
						data.preview[
							data.preview.length - 1
						]
					);
					msg.channel.send(attachment);
				} catch (err) {
					msg.reply(
						'Error fetching meme, please try again later...'
					);
				}
			} else if (msg.content === '?cmds') {
				msg.channel.send(
					'?cmds - list of commands'
				);
				msg.channel.send(
					'?b99 img <character> -  img of character'
				);
				msg.channel.send(
					'?b99 quote <character> - random quote by character'
				);
				msg.channel.send(
					'?stranger-things <character> - info about character'
				);
				msg.channel.send('?meme - random meme');
			}
		}
	} else {
		return;
	}
});

client.login(process.env.DISCORD_TOKEN);
