// discord.js モジュールのインポート
const Discord = require('discord.js')
const child_process = require('child_process')

// Discord Clientのインスタンス作成
const client = new Discord.Client()

const TOKEN = process.env.DISCORD_BOT_TOKEN
const CHANNEL_ID = process.env.DISCORD_BOT_CHANNEL_ID
const ADMIN_USER_ID = JSON.parse(process.env.DISCORD_ADMIN_USER_ID)
const REMOTE_DEPLOY_COMMAND = process.env.REMOTE_DEPLOY_COMMAND
const DISCORD_WEBHOCK = process.env.DISCORD_WEBHOCK

// 準備完了イベントのconsole.logで通知黒い画面に出る。
client.on('ready', () => {
	const result = child_process.execSync(`
curl -H "Accept: application/json"
-H "Content-type: application/json"
-X POST -d '{"username":"syonet.work","content":"syonet.workは再起動しました。"}' '${DISCORD_WEBHOCK}'`)
	console.log(result)
})


// メッセージがあったら何かをする
client.on('message', message => {
	if (CHANNEL_ID != message.channel.id) {
		return;
	}
	// メッセージの文字列による条件分岐
	if (message.content === '@bot deploy latest') {
		const author = message.author
		if (author.id in ADMIN_USER_ID) {
			const sendText =
`今からsyonet.workを最新化します。`
			message.reply(sendText)
			.then(message => {
				console.log(`Sent message: ${sendText}`)
				const result = child_process.execSync(REMOTE_DEPLOY_COMMAND)
				console.log(result)
			}))
			.catch(console.error)
		} else {
			const sendText =
`どうも。${author.username}さん。
このコマンドの実行権限はございません。`
			message.reply(sendText)
			.then(message => console.log(`Sent message: ${sendText}`))
			.catch(console.error)
		}
		return;
	}
});


// Discordへの接続
client.login(TOKEN)
