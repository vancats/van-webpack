

const less = require('less')

function loader(source) {
  let callback = this.async()

  less.render(source, { filename: this.resource }, (err, output) => {
    let css = output.css
    let code = `module.exports = ${JSON.stringify(css)}`
    callback(err, code)
    // callback(err, css)
  })
}

module.exports = loader
