var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var MailSchema = new Schema({
  to: {
        type: String,
        required: true
    },
  subject: {
        type: String,
      	required: true
    },
  text: {
  	 	type: String,
  },
  html: {
  	 	type: String,
  },
  estado: {
  	type: String,
  	default: "PENDIENTE"
  }
});

module.exports = mongoose.model('mail', MailSchema);