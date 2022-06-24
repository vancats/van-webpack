
function loader(source) {
  console.log('loader1-loader')
  return source + 'console.log("logger1");'
}

module.exports = loader
