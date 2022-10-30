const path = require('path')
const express = require('express');//import/call the express server
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');// import for requesiting page
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

const connetDB = require('./config/db')//import our db conn 


//Load config file 
dotenv.config({ path: './config/config.env'});

//passport config
require('./config/passport')(passport)

//call the conn of db
connetDB()

//initlize our app
const app = express()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method Overriding
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate } = require('./helper/hbs')

//Handlebars tamplate engine
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,

    }, extname: '.hbs', defaultLayout: "main"
}));
app.set('view engine', '.hbs');


//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({mongooseConnection: mongoose.connection})
    store: MongoStore.create({ mongoUrl:'mongodb+srv://mohan:mohan2001@cluster0.c2yvchy.mongodb.net/?retryWrites=true&w=majority' })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/resume', require('./routes/resume'));



//Static Folder 
app.use(express.static(path.join(__dirname, 'public')));


//Connect the PORT
const PORT = process.env.PORT || 3000


//call app listen
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))