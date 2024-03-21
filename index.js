require('colors');
const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./src/config/config");
const connectDb = require("./src/config/db-connect");
const cookieParser = require("cookie-parser");
const User = require('./src/models/User');
const app = express();
connectDb();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(cookieParser());

const auth = (req, res, next) => {
    if (!req.cookies.user) {
        res.redirect("/");
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    if (req.cookies.user) {
        return res.redirect("/dashboard");
    }
    res.redirect("/login");
});

app.get("/dashboard", auth, (req, res) => {
    res.render("dashboard");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});
        if(user){
            if(user.password == password){
                res.cookie("user", user, {maxAge: 60 * 10000000});
                res.cookie("msg", "login-successfull");
                res.redirect("/");
            } else {
                res.cookie("msg", "incorrect-password", {maxAge: 60*1000});
                res.redirect("/login");
            }
        } else {
            res.cookie("msg", "user-not-found", {maxAge: 60*1000});
            res.redirect("/login");
        }
    } catch (error) {
        console.log(`An error occured: ${error}`.red.bold)
    }
})

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({
            name, email, password
        })
        console.log(user)
        res.redirect("/login");
    } catch (error) {
        console.log(`An error occured: ${error}`.red.bold)
    }
})

app.get("/signout", (req, res) => {
    res.clearCookie("user");
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log("Click here :- http://localhost:5000".green.bold)
})