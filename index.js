const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const app = new express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");
const edge = require("edge.js");


const Post = require('./database/models/Post');
const User = require('./database/models/User');
const mongoStore = connectMongo(expressSession);

app.use(expressEdge.engine);
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(connectFlash());

mongoose.connect('mongodb://0.0.0.0:27017', { useNewUrlParser: true })
.then(() => 'You are now connected to Mongo!')
.catch(err => console.error('Something went wrong', err))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/login.html'));
});

app.get('/index.html', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});

app.get('/news', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/news.html'));
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.get('/post', (req, res) => {
    res.render('post');
});

app.get("/auth/register", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/register.html'));});

app.post('/posts/store', (req, res) => {
    Post.create(req.body, (error, post) => {
        res.redirect('/')
    })
});

app.post('/users/register', (req, res) => {
    User.create(req.body, (error, user) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/index.html')
    })
});
app.get('/auth/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/login.html'));});

app.post('/users/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    User.findOne({
        email
    }, (error, user) => {
        if (user) {
            // compare passwords.
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    res.redirect('/index.html') // redirect to home page
                } else {
                    res.redirect('/auth/login')
                }
            })
        } else {
            res.redirect('/auth/login')
        }
    })
});
app.get('/auth/logout', (req, res) => {
        res.redirect('/')
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
}); 