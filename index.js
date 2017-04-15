var express     = require('express');
var app         = express();
var http = require('http').Server(app);
var cors = require('cors');
var cron = require('node-cron');
var port = 8081;

app.listen(port);

cron.schedule('* * * * *', function(){
  enviarMailsPendientes()
});

var apiRoutes = express.Router();
apiRoutes.use(cors())

apiRoutes.post('/registrarMail', function(req, res) {
  var datos = req.body

  res.json({success: true, msg: 'Mail cargado correctamente'});
  
});

app.use('', apiRoutes);