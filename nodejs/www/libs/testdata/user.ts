import { UserData } from "@www/models/mongoose/user";

export const Users: Array<UserData> = [
  {
    _id: "5aed55de759258017268621c",
    auth: {
      id: "1111111111111",
      displayName: "google user",
      name: {
        familyName: "google",
        givenName: "user",
      },
      photos: [
        {
          value: "https://lh4.googleusercontent.com/photo.jpg?sz=50",
        },
      ],
      gender: null,
      provider: "google",
      _raw:
        '{\n "kind": "plus#person",\n "etag": "\\"AAAAAAAAA\\"",\n "objectType": "person",\n "id": "1111111111111",\n "displayName": "google user",\n "name": {\n  "familyName": "google",\n  "givenName": "user"\n },\n "image": {\n  "url": "https://lh4.googleusercontent.com/photo.jpg?sz=50",\n  "isDefault": false\n },\n "isPlusUser": false,\n "language": "ja",\n "verified": false,\n "domain": "google.com"\n}\n',
      _json: {
        // @ts-ignore
        kind: "plus#person",
        etag: '"AAAAAAAAA"',
        objectType: "person",
        id: "1111111111111",
        displayName: "google user",
        name: {
          familyName: "google",
          givenName: "user",
        },
        image: {
          url: "https://lh4.googleusercontent.com/photo.jpg?sz=50",
          isDefault: false,
        },
        isPlusUser: false,
        language: "ja",
        verified: false,
        domain: "google.com",
      },
    },
    __v: 0,
    date: "2018-05-05T06:57:34.000Z",
    type: "general",
  },
  {
    _id: "5af7a18e37c74efa1be829a4",
    auth: {
      id: "33333333333333333",
      // @ts-ignore
      username: null,
      displayName: "facebook_user",
      name: {
        familyName: "facebook",
        givenName: "user",
        // @ts-ignore
        middleName: null,
      },
      gender: "male",
      profileUrl: null,
      photos: [
        {
          value:
            "https://lookaside.facebook.com/platform/profilepic/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o",
        },
      ],
      provider: "facebook",
      _raw:
        '{"id":"33333333333333333","name":"facebook_user","last_name":"facebook","first_name":"user","gender":"male","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/lookaside.facebook.com\\/platform\\/profilepic\\/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o","width":50}}}',
      _json: {
        // @ts-ignore
        id: "33333333333333333",
        name: "facebook user",
        last_name: "facebook",
        first_name: "user",
        gender: "male",
        picture: {
          data: {
            height: 50,
            is_silhouette: false,
            url:
              "https://lookaside.facebook.com/platform/profilepic/?asid=33333333333333333&height=50&width=50&ext=1526653789&hash=AeTXCkgtPWZwlA0o",
            width: 50,
          },
        },
      },
    },
    __v: 0,
    date: "2018-05-15T14:29:48.000Z",
    type: "general",
  },
  {
    _id: "5aed4fe95e1e7327848a0408",
    auth: {
      id: "4444444",
      displayName: "github_user",
      username: "github_user",
      profileUrl: "https://github.com/",
      photos: [
        {
          value: "https://avatars1.githubusercontent.com/u/?v=4",
        },
      ],
      provider: "github",
      _raw:
        '{"login":"github_user","id":4444444,"avatar_url":"https://avatars1.githubusercontent.com/u/?v=4","gravatar_id":"","url":"https://api.github.com/users/","html_url":"https://github.com/","followers_url":"https://api.github.com/users//followers","following_url":"https://api.github.com/users//following{/other_user}","gists_url":"https://api.github.com/users//gists{/gist_id}","starred_url":"https://api.github.com/users//starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users//subscriptions","organizations_url":"https://api.github.com/users//orgs","repos_url":"https://api.github.com/users//repos","events_url":"https://api.github.com/users//events{/privacy}","received_events_url":"https://api.github.com/users//received_events","type":"User","site_admin":false,"name":"github_user","company":"example, inc","blog":"","location":null,"hireable":null,"bio":null,"public_repos":58,"public_gists":24,"followers":17,"following":75,"created_at":"2014-03-20T03:23:56Z","updated_at":"2018-05-02T03:30:31Z"}',
      _json: {
        // @ts-ignore
        login: "github_user",
        id: 4444444,
        avatar_url: "https://avatars1.githubusercontent.com/u/?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/",
        html_url: "https://github.com/",
        followers_url: "https://api.github.com/users//followers",
        following_url: "https://api.github.com/users//following{/other_user}",
        gists_url: "https://api.github.com/users//gists{/gist_id}",
        starred_url: "https://api.github.com/users//starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users//subscriptions",
        organizations_url: "https://api.github.com/users//orgs",
        repos_url: "https://api.github.com/users//repos",
        events_url: "https://api.github.com/users//events{/privacy}",
        received_events_url: "https://api.github.com/users//received_events",
        type: "User",
        site_admin: false,
        name: "github_user",
        company: "example, inc",
        blog: "",
        location: null,
        hireable: null,
        bio: null,
        public_repos: 58,
        public_gists: 24,
        followers: 17,
        following: 75,
        created_at: "2014-03-20T03:23:56Z",
        updated_at: "2018-05-02T03:30:31Z",
      },
    },
    __v: 0,
    date: "2018-05-05T06:32:21.000Z",
    type: "general",
  },
];
