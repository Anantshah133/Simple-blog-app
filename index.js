require('colors');
const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./src/config/config");
const connectDb = require("./src/config/db-connect");
const cookieParser = require("cookie-parser");
const app = express();
const upload = require("./src/utils/multer");
const User = require('./src/models/User');
const Blog = require('./src/models/Blog');
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
        return res.redirect("/home");
    }
    res.redirect("/login");
});

app.get("/home", auth, (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/create-blog", auth, (req, res) => {
    res.render("create-blog");
})

app.get("/blogs", auth, async (req, res)=>{
    try {
        const blogs = await Blog.find({});
        res.render("blogs", {blogs: blogs});
    } catch (error) {
        console.log(`An error occured : ${error}`.red.bold)
    }
})

app.get("/blogs/read/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findOne({_id: id});
        if(blog){
            console.log(blog);
            res.render("single-blog", {blog});
        } else {
            res.cookie("msg", "error")
            res.redirect("/blogs");
        }
    } catch (error) {
        console.log(`An error occured : ${error}`.red.bold)
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.password == password) {
                res.cookie("user", user, { maxAge: 60 * 10000000 });
                res.cookie("msg", "login-successfull");
                res.redirect("/");
            } else {
                res.cookie("msg", "incorrect-password", { maxAge: 60 * 1000 });
                res.redirect("/login");
            }
        } else {
            res.cookie("msg", "user-not-found", { maxAge: 60 * 1000 });
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

app.post("/create-blog", upload.single("image"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;
        const userCookie = req.cookies['user'];
        const blog = await Blog.create({
            title, description, image: file.filename, userName: userCookie.name
        })
        if(blog){
            return res.redirect("/blogs");
        } else {
            res.cookie("msg", "error-create")
            return res.redirect("/create-blog");
        }
    } catch (error) {
        console.log(`An error occured: ${error}`.red.bold)
    }
})

app.get("/signout", auth, (req, res) => {
    res.clearCookie("user");
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log("Click here :- http://localhost:5000".green.bold)
})