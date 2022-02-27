const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express()

//exportando banco de dados da pasta
const conn = require ('./db/conn')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//models
const Bank = require ('./models/Bank')
const User = require ('./models/User')
const Address = require('./models/Address')

//impotar rotas
const bankRoutes = require('./routes/bankRoutes')
const authRoutes = require('./routes/authRoutes')

//importar controles
const BankController = require ('./controllers/BankController')
const AuthController = require ('./controllers/AuthController')

//receber resposta do body
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

//armazenando sessões
app.use(
    session({
      name: 'session',
      secret: 'nosso_secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
      }),
      cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      },
    }),
  )

// flash messages
app.use(flash())

//acessar css
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
    // console.log(req.session)
    //console.log(req.session.userid);
  
    if (req.session.userid) {
      res.locals.session = req.session;
    }
  
    next();
  });

// routes
app.use('/bancos', bankRoutes)
app.use('/',authRoutes )

app.get('/', BankController.showBanks)

conn
//.sync({force : true})
.sync()
.then(()=> {
    app.listen(3000)
})
.catch((error) => console.log(error))