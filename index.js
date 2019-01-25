const { RTMClient, WebClient } = require('@slack/client')
const token = process.env.SLACK_TOKEN

if (!token) {
    throw new Error('Missing SLACK_TOKEN environment variable')
}

const web = new WebClient(token)
const rtm = new RTMClient(token)

rtm.start()

rtm.on('message', (message) => {
    if (message.subtype && message.subtype === 'bot_message') {
        return
    }
    if ((!message.subtype && message.user === rtm.activeUserId) ) {
        return
    }
    if (!message.channel.startsWith('D')) {
        return
    }
    web.channels
        .list()
        .then(res => res.channels.filter(channel => channel.is_member))
        .then((channels) => {
            for (const channel of channels) {
                web.chat
                    .postMessage({ channel: channel.id, text: message.text })
                    .then(console.log)
                    .catch(console.error)
            }
        })
        .catch(console.error)
})