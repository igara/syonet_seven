// @flow

export const Sessions: Array<SessionInfoData> = [
	{
		_id: '1111111111111',
		session: {
			cookie: {
				originalMaxAge: 11111111111111,
				expires: '2018-06-10T09:26:26.435Z',
				secure: '',
				httpOnly: false,
				domain: '',
				path: '/',
				sameSite: '',
			},
			passport: {
				user: {
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
					gender: '',
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
			},
		},
	},
	{
		_id: '2222222222222',
		session: {
			cookie: {
				originalMaxAge: 11111111111111,
				expires: '2018-06-10T09:26:26.435Z',
				secure: '',
				httpOnly: false,
				domain: '',
				path: '/',
				sameSite: '',
			},
		},
	},
]
