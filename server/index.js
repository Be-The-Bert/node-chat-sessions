const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const session = require('express-session');
const createInitialSession = require('./middleware/session.js');
const filter = require('./middleware/filter.js');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use( session({
    secret: 'fjdks43214la;jfkdl;542@^%@^%@$#@@!safjkdsafjdskalfjds89320412a',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10000} 
    }
));
app.use( createInitialSession );
app.use( (req, res, next) => {
    const { method } = req;
    if (req.body && req.body.text ) {
        return filter( req, res, next );
    }
    next();
})

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get( `${messagesBaseUrl}/history`, mc.history );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );