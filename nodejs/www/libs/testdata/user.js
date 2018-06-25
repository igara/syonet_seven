// @flow

export const Users: Array<UserInfoData> = [
	{
		_id: '5aed55de759258017268621c',
		auth: {
			id: '1111111111111',
			displayName: 'google user',
			name: {
				familyName: 'google',
				givenName: 'user',
			},
			emails: [
				{
					value: 'example@google.com',
					type: 'account',
				},
			],
			photos: [
				{
					value: 'https://lh4.googleusercontent.com/photo.jpg?sz=50',
				},
			],
			gender: null,
			provider: 'google',
			_raw:
				'{\n "kind": "plus#person",\n "etag": "\\"AAAAAAAAA\\"",\n "emails": [\n  {\n   "value": "example@google.com",\n   "type": "account"\n  }\n ],\n "objectType": "person",\n "id": "1111111111111",\n "displayName": "google user",\n "name": {\n  "familyName": "google",\n  "givenName": "user"\n },\n "image": {\n  "url": "https://lh4.googleusercontent.com/photo.jpg?sz=50",\n  "isDefault": false\n },\n "isPlusUser": false,\n "language": "ja",\n "verified": false,\n "domain": "google.com"\n}\n',
			_json: {
				kind: 'plus#person',
				etag: '"AAAAAAAAA"',
				emails: [
					{
						value: 'example@google.com',
						type: 'account',
					},
				],
				objectType: 'person',
				id: '1111111111111',
				displayName: 'google user',
				name: {
					familyName: 'google',
					givenName: 'user',
				},
				image: {
					url: 'https://lh4.googleusercontent.com/photo.jpg?sz=50',
					isDefault: false,
				},
				isPlusUser: false,
				language: 'ja',
				verified: false,
				domain: 'google.com',
			},
		},
		__v: 0,
		date: '2018-05-05T06:57:34.000Z',
	},
	{
		_id: '5aed4fce5e1e7327848a03fc',
		auth: {
			id: '222222222',
			username: 'twitter_user',
			displayName: 'ツイッターユーザ',
			photos: [
				{
					value:
						'https://pbs.twimg.com/profile_images/222222222/H5lxfcq__normal.jpg',
				},
			],
			provider: 'twitter',
			_raw:
				'{"id":222222222,"id_str":"222222222","name":"\\u30ef\\u30f3","screen_name":"twitter_user","location":"","description":"\\u3061","url":"https:\\/\\/t.co\\/","entities":{"url":{"urls":[{"url":"https:\\/\\/t.co\\/","expanded_url":"https:\\/\\/syonet.work\\/","display_url":"syonet.work","indices":[0,23]}]},"description":{"urls":[]}},"protected":false,"followers_count":173,"friends_count":598,"listed_count":14,"created_at":"Fri Apr 06 01:28:03 +0000 2012","favourites_count":377,"utc_offset":28800,"time_zone":"Irkutsk","geo_enabled":true,"verified":false,"statuses_count":6236,"lang":"ja","status":{"created_at":"Fri May 04 03:33:12 +0000 2018","id":222222222,"id_str":"222222222","text":"\\u5373","truncated":false,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"source":"\\u003ca href=\\"http:\\/\\/twitter.com\\/download\\/android\\" rel=\\"nofollow\\"\\u003eTwitter for Android\\u003c\\/a\\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":0,"favorite_count":0,"favorited":false,"retweeted":false,"lang":"ja"},"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"000000","profile_background_image_url":"http:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_image_url_https":"https:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_tile":false,"profile_image_url":"http:\\/\\/pbs.twimg.com\\/profile_images\\/\\/H5lxfcq__normal.jpg","profile_image_url_https":"https:\\/\\/pbs.twimg.com\\/profile_images\\/\\/H5lxfcq__normal.jpg","profile_link_color":"19CF86","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"000000","profile_text_color":"000000","profile_use_background_image":false,"has_extended_profile":false,"default_profile":false,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none"}',
			_json: {
				id: 222222222,
				id_str: '222222222',
				name: 'ツイッターユーザ',
				screen_name: 'twitter_user',
				location: '',
				description: '説明',
				url: 'https://t.co/',
				entities: {
					url: {
						urls: [
							{
								url: 'https://t.co/',
								expanded_url: 'https://syonet.work/',
								display_url: 'syonet.work',
								indices: [0, 23],
							},
						],
					},
					description: {
						urls: [],
					},
				},
				protected: false,
				followers_count: 173,
				friends_count: 598,
				listed_count: 14,
				created_at: 'Fri Apr 06 01:28:03 +0000 2012',
				favourites_count: 377,
				utc_offset: 28800,
				time_zone: 'Irkutsk',
				geo_enabled: true,
				verified: false,
				statuses_count: 6236,
				lang: 'ja',
				status: {
					created_at: 'Fri May 04 03:33:12 +0000 2018',
					id: 222222222,
					id_str: '222222222',
					text: 'ツイート',
					truncated: false,
					entities: {
						hashtags: [],
						symbols: [],
						user_mentions: [],
						urls: [],
					},
					source:
						'<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
					in_reply_to_status_id: null,
					in_reply_to_status_id_str: null,
					in_reply_to_user_id: null,
					in_reply_to_user_id_str: null,
					in_reply_to_screen_name: null,
					geo: null,
					coordinates: null,
					place: null,
					contributors: null,
					is_quote_status: false,
					retweet_count: 0,
					favorite_count: 0,
					favorited: false,
					retweeted: false,
					lang: 'ja',
				},
				contributors_enabled: false,
				is_translator: false,
				is_translation_enabled: false,
				profile_background_color: '000000',
				profile_background_image_url:
					'http://abs.twimg.com/images/themes/theme1/bg.png',
				profile_background_image_url_https:
					'https://abs.twimg.com/images/themes/theme1/bg.png',
				profile_background_tile: false,
				profile_image_url:
					'http://pbs.twimg.com/profile_images/222222222/H5lxfcq__normal.jpg',
				profile_image_url_https:
					'https://pbs.twimg.com/profile_images/222222222/H5lxfcq__normal.jpg',
				profile_link_color: '19CF86',
				profile_sidebar_border_color: '000000',
				profile_sidebar_fill_color: '000000',
				profile_text_color: '000000',
				profile_use_background_image: false,
				has_extended_profile: false,
				default_profile: false,
				default_profile_image: false,
				following: false,
				follow_request_sent: false,
				notifications: false,
				translator_type: 'none',
			},
			_accessLevel: 'read-write-directmessages',
		},
		__v: 0,
		date: '2018-05-05T06:31:42.000Z',
	},
	{
		_id: '5af7a18e37c74efa1be829a4',
		auth: {
			id: '33333333333333333',
			username: null,
			displayName: 'facebook_user',
			name: {
				familyName: 'facebook',
				givenName: 'user',
				middleName: null,
			},
			gender: 'male',
			profileUrl: null,
			emails: [
				{
					value: 'example@google.com',
				},
			],
			photos: [
				{
					value:
						'https://lookaside.facebook.com/platform/profilepic/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o',
				},
			],
			provider: 'facebook',
			_raw:
				'{"id":"33333333333333333","email":"example\\u0040google.com","name":"facebook_user","last_name":"facebook","first_name":"user","gender":"male","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/lookaside.facebook.com\\/platform\\/profilepic\\/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o","width":50}}}',
			_json: {
				id: '33333333333333333',
				email: 'example@google.com',
				name: 'facebook user',
				last_name: 'facebook',
				first_name: 'user',
				gender: 'male',
				picture: {
					data: {
						height: 50,
						is_silhouette: false,
						url:
							'https://lookaside.facebook.com/platform/profilepic/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o',
						width: 50,
					},
				},
			},
		},
		__v: 0,
		date: '2018-05-15T14:29:48.000Z',
	},
	{
		_id: '5aed4fe95e1e7327848a0408',
		auth: {
			id: '4444444',
			displayName: 'github_user',
			username: 'github_user',
			profileUrl: 'https://github.com/',
			photos: [
				{
					value: 'https://avatars1.githubusercontent.com/u/?v=4',
				},
			],
			provider: 'github',
			_raw:
				'{"login":"github_user","id":4444444,"avatar_url":"https://avatars1.githubusercontent.com/u/?v=4","gravatar_id":"","url":"https://api.github.com/users/","html_url":"https://github.com/","followers_url":"https://api.github.com/users//followers","following_url":"https://api.github.com/users//following{/other_user}","gists_url":"https://api.github.com/users//gists{/gist_id}","starred_url":"https://api.github.com/users//starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users//subscriptions","organizations_url":"https://api.github.com/users//orgs","repos_url":"https://api.github.com/users//repos","events_url":"https://api.github.com/users//events{/privacy}","received_events_url":"https://api.github.com/users//received_events","type":"User","site_admin":false,"name":"github_user","company":"example, inc","blog":"","location":null,"email":null,"hireable":null,"bio":null,"public_repos":58,"public_gists":24,"followers":17,"following":75,"created_at":"2014-03-20T03:23:56Z","updated_at":"2018-05-02T03:30:31Z"}',
			_json: {
				login: 'github_user',
				id: 4444444,
				avatar_url: 'https://avatars1.githubusercontent.com/u/?v=4',
				gravatar_id: '',
				url: 'https://api.github.com/users/',
				html_url: 'https://github.com/',
				followers_url: 'https://api.github.com/users//followers',
				following_url: 'https://api.github.com/users//following{/other_user}',
				gists_url: 'https://api.github.com/users//gists{/gist_id}',
				starred_url: 'https://api.github.com/users//starred{/owner}{/repo}',
				subscriptions_url: 'https://api.github.com/users//subscriptions',
				organizations_url: 'https://api.github.com/users//orgs',
				repos_url: 'https://api.github.com/users//repos',
				events_url: 'https://api.github.com/users//events{/privacy}',
				received_events_url: 'https://api.github.com/users//received_events',
				type: 'User',
				site_admin: false,
				name: 'github_user',
				company: 'example, inc',
				blog: '',
				location: null,
				email: null,
				hireable: null,
				bio: null,
				public_repos: 58,
				public_gists: 24,
				followers: 17,
				following: 75,
				created_at: '2014-03-20T03:23:56Z',
				updated_at: '2018-05-02T03:30:31Z',
			},
		},
		__v: 0,
		date: '2018-05-05T06:32:21.000Z',
	},
]
