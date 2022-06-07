const http = require('http')

http.createServer(function (req, res) {
  const url = req.url
  console.log('url: ', url)
  if (url === '/user1') {
    res.end(JSON.stringify([{ "name": "user1", "age": 18 }]))
  } else {
    res.end('Not Found')
  }
}).listen(3000, () => {
  console.log('已启动！')
})
