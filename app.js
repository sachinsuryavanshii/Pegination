const express = require('express'),
    Mongoose = require('mongoose'),
    Bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    User = require('./user')

const app = express();

const db = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2`

Mongoose.connect(db, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => console.log('MongoDB Connected....'))

// Handling GET /send Request
app.get("/send", async (req, res, next) => {

    try {
        let { page, size, sort } = req.query;

        // If the page is not applied in query.
        if (!page) {

            // Make the Default value one.
            page = 1;
        }

        if (!size) {
            size = 10;
        }

        //  We have to make it integer because
        // query parameter passed is string
        const limit = parseInt(size);

        // We pass 1 for sorting data in 
        // ascending order using ids
        const user = await User.find().sort(
            { votes: 1, _id: 1 }).limit(limit)
        res.send({
            page,
            size,
            Info: user,
        });
    }
    catch (error) {
        res.sendStatus(500);
    }
});

// Handling POST /send Request
app.post('/send', jsonParser, (req, res) => {

    req.body.password = 
        Bcrypt.hashSync(req.body.password, 10);
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,

    })

    newUser.save()
        .then(result => {
            console.log(result);
        });
})

// Server setup
app.listen(3000, function () {
    console.log("Express Started on Port 3000");
});
