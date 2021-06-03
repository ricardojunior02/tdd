const { connect } = require('mongoose');

module.exports =  () => {
  return connect('mongodb://localhost:27017/tdd', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
};