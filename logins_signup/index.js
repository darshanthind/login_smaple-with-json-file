const express = require("express");
const app = express();
const helmet = require("helmet");

const fs = require("fs");
const session = require('express-session');
const { json } = require("body-parser");
const flash = require("connect-flash");

const filePath = 'D:/backend/practice/logins_signup/data/Signup.json';
require('dotenv').config();


app.use(session({
    secret: process.env.SCUR,
    resave: true,
    saveUninitialized: true,

}))
app.use(flash());

app.use('/data', (req, res) => {
    res.status(403).json({ message: 'Forbidden' });
});
app.use(helmet());
app.set("view engine", "ejs")
app.set("views", "pages");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    let a = req.flash("message");
    console.log(a);
    res.render("login", { a });
});
app.get("/sigup", (req, res) => {
    res.render("Signup");
});
app.post("/Signup", (req, res) => {
    console.log(req.body);

    try {
        let dataf = fs.readFileSync(filePath, 'utf-8');
        dataf = JSON.parse(dataf);
        let user = [];
        dataf.push(req.body);

        let datastore = JSON.stringify(dataf);
        fs.writeFileSync(filePath, datastore, "utf-8");
        console.log("Success fully upload!");
        req.flash('message', 'Signup Secusses!');
        res.redirect("/");

    } catch (err) {
        console.log(err);
    }

});
app.post("/login", (req, res) => {

    try {
        let dataf = fs.readFileSync(filePath, "utf-8");
        dataf = JSON.parse(dataf);
        let b = false;
        for (let i of dataf) {
            if (i.email == req.body.email && i.password == req.body.password) {
                req.flash("message", "Login Seccessful!");
                b = true;
            }
        }
        if (b) {
            res.redirect("/");
        } else {
            res.send("Email and Password not Equals!");
        }


    } catch (e) {
        console.log(e);
    }

})





app.listen(2001, console.log("Server Run..."));