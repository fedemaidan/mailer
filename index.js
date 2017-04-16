var express     = require('express');
var app         = express();
var http = require('http').Server(app);
var cors = require('cors');
var cron = require('node-cron');
var mongoose    = require('mongoose');
var nodemailer = require('nodemailer');
var bodyParser  = require('body-parser');
var port = 8081;
var Mail        = require('./model/mail'); 
var urlBaseDeRecuperacion = "multiml.com/api/confirmaRecuperarContrasena"

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'fede.maidan@gmail.com',
        pass:  '1324neco'
    }
}, {
    from: 'fede.maidan@gmail.com'
});

app.listen(port);

cron.schedule('* * * * *', function(){
  enviarMailsPendientes()
});

var apiRoutes = express.Router();
apiRoutes.use(cors())

apiRoutes.post('/registrarMail', function(req, res) {
  
  var datos = req.body
  
  var urlDeRecuperacion = urlBaseDeRecuperacion + "?user=" + datos.username + "&token=" + datos.token

  console.log(urlDeRecuperacion);
  console.log(datos)
  var mail = new Mail({
      to: datos.mail,
      subject: "Cambio de contraseña de " + datos.username,
      text: "Cambiar contraseña: " + urlDeRecuperacion,
      html: "<p> Cambio contraseña HTML : <a href="+ urlDeRecuperacion + "> Link </a></p>"
    });
    
    mail.save(function(err) {
    	console.log("cargo mail")
      if (err) {
        return res.json({success: false, msg: err.message});
      }
      res.json({success: true, msg: 'Mail cargado correctamente'});
    });

});

function enviarMailsPendientes() {
	/* por cada registro multiml enviar un mail y despues borrar registro */
}

app.use('', apiRoutes);