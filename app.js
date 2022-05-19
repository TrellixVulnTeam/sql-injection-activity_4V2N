const http = require('http')
const sqlite3 = require('sqlite3')
path = require('path')
express = require('express')
bodyParser = require('body-parser')
const sqlite = require(`sqlite3`).verbose()
const app = express()
app.use(express.static(`.`))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const db = new sqlite3.Database(`:memory:`)
db.serialize(function(){
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)")
    db.run("INSERT INTO user VALUES ('privilegedUser','privilegedUser1','Administrator')")
})

//get route for html file
app.get(`/`,(req, res) => {
    res.sendFile('index.html')
})

//post route for login
app.post('/login',(req, res)=> {
    let username = req.body.username
    let password = req.body.password
    let query = `SELECT title FROM user WHERE username = ${username} AND password = ${password}`
    console.log(username)
    console.log(password)
    console.log(query)
    db.get(query, function (err, row){
        if(err){
            console.log('ERROR', err)
            res.redirect("/index.html#error")
        } else if (!row) {
            res.redirect("/index.html#unauthorized")
        } else {
            res.send(
                `Hello <b>${row.title}</b><br/>
                This file contains all your secret data: <br/>
                SECRETS <br/>MORE SECRETS<br/>
                <a href="/index.html">go back to login</a>`)
        }
    })
})

app.listen(3000)


