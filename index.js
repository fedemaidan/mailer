var express     = require('express');
var app         = express();
var http = require('http').Server(app);
var cors = require('cors');
var cron = require('node-cron');
var smtpTransport = require('nodemailer-smtp-transport');
var mongoose    = require('mongoose');
var nodemailer = require('nodemailer');
var bodyParser  = require('body-parser');
var config      = require('./config/database'); 
var port = 8081;
var Mail        = require('./model/mail'); 
var urlBaseDeRecuperacion = "multiml.com/api/confirmaRecuperarContrasena"

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.database);

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'federico.maidan@tecnorespuestas.com.ar',
        pass:  '4050neco'
    }
  })
);

app.listen(port);

cron.schedule('* * * * *', function(){
  enviarMailsPendientes()
});

var apiRoutes = express.Router();
apiRoutes.use(cors())

apiRoutes.post('/registrarMail', function(req, res) {

  var datos = req.body
  
  var urlDeRecuperacion = urlBaseDeRecuperacion + "?user=" + datos.username + "&token=" + datos.token

  var mail = new Mail({
      to: datos.mail,
      subject: "Cambio de contraseña de " + datos.username,
      text: "Cambiar contraseña: " + urlDeRecuperacion,
      html: "<p> Cambio contraseña HTML : <a href=\""+ urlDeRecuperacion + "\"> Link </a></p>"
    });
    
    mail.save(function(err) {
    	console.log("cargo mail")
      console.log(err)
      if (err) {
        console.log(err)
        res.send({success: false, msg: err.message});
      }
      res.send({success: true, msg: 'Mail cargado correctamente'});
    });

});

function enviarMailsPendientes() {
	Mail.find( {} , (err, mails) => {
    mails.forEach( ( mail ) => {
      
      let mensaje = {
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html
      }
      
      transporter.sendMail(mensaje, (error, info) => {
        
        if (error) {
            console.log(error.message);
            return;
        }
      
        transporter.close();
      });
          
    })
  });
}

app.use('', apiRoutes);