
function loader(source) {
  console.log('loader2-loader')
  return source + 'console.log("logger2");'
}

module.exports = loader
