const express = require('express')
const app = express()
const dasha = require('@dasha.ai/sdk')

app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', (_req, res) => {
  res.render('pages/index')
})

app.post('/', (req, res) => {
  dashaCall(req.body.phone)
  res.json({ success: true })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))

async function dashaCall(phone) {
  const app = await dasha.deploy('./app')

  app.connectionProvider = async (conv) =>
    conv.input.phone === 'chat'
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint('default'))

  app.ttsDispatcher = () => 'dasha'

  app.setExternal('function1', (args) => {
    console.log(args.log)
  })

  await app.start()

  const conv = app.createConversation({ phone: phone })

  if (conv.input.phone !== 'chat') conv.on('transcription', console.log)

  const result = await conv.execute()

  console.log(result.output)

  await app.stop()
  app.dispose()
}
