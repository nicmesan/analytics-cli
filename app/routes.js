let express = require('express');
let Router = express.Router();
let runIdMiddleware = require('./middlewares/run-id-generator');

//ROUTES: -------------------
Router.post('/google-api/save-pages-and-keywords/',
    runIdMiddleware,
    require('./controllers/save-pages-and-keywords')
);
//-------------------

exports = module.exports = Router;