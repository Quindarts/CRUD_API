const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

//CONST
const PORT = 5000;
const BASE_URL = "mongodb://localhost:27017/authentication";
const mongoose = require("mongoose");
const corsOptions = {
    origin: "http://localhost:5000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//SCHEMA
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Enter Task"],
    },
    password: {
        type: String,
        default: false,
    },
});

const monomodel = mongoose.model("users", UserSchema);

//USE
app.use(cors(corsOptions));
app.use(express.json());

//MONGO
mongoose.connect(BASE_URL);
mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection is open to ", BASE_URL);
});




//Authentication
const CryptoJS = require("crypto-js");


//[RESGITER]
app.post('/auth/register', async (req, res) => {

    const { username, password } = req.body;
    const user = await getUser(username);
    try {
        if (user) {
            res.status(404).send({ msg: 'Account is have used' });
        }

        else {
            const hashPassword = encryptedPassword(password);
            const newUser = { username, password: hashPassword };
            const crUser = await createUser(newUser);

            crUser === null ?
                res.status(404).send({ msg: 'Not found create account, try again !!' })
                :
                res.status(200).send({ msg: 'Register success', crUser });
        }
    } catch {
        res.status(404).send(res.json({ msg: 'Not found create account, try again !!' }))
    }
});

//[LOGIN]
app.post('/auth/login', async (req, res) => {

    const { username, password } = req.body;
    const user = await getUser(username);

    if (!user)
        res.status(404).send({ msg: 'This account does not exist' });
    else {
        const decPassword = decryptedPassword(user.password);

        (password === decPassword) ?
            res.status(200).send({ msg: 'Login success!', user })
            :
            res.status(404).send({ msg: 'Wrong password' });

    }
})




async function getUser(username) {
    try {
        let result = await monomodel.findOne({ username: username });
        return result;
    }
    catch {
        return null;
    }
};

async function createUser(newUser) {
    try {
        let data = new monomodel(newUser);
        let val = await data.save();
        return val;
    } catch {
        return null;
    }
}

//
//GET
app.get("/get-all-user", async (req, res) => {
    let result = await monomodel.find({});
    console.log("🚀 ~ file: server1.js:108 ~ app.get ~ result:", result)
    console.log(res);
    res.json(result);
    console.log("🚀 ~ file: server1.js:111 ~ app.get ~ result:", result)
});

//POST
app.post("/post", async (req, res) => {
    console.log("inside post function");
    const data = new monomodel({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id,
    });
    const val = await data.save();
    res.json(val);
});
//PUT
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;

    let result = await monomodel.findOneAndUpdate(
        { id: upid },
        { $set: { name: upname, email: upemail } },
        { new: true, upsert: true, rawResult: true },
        console.log("🚀 ~ file: server1.js:137 ~ app.put ~ Result:", Result)
    );
    console.log("🚀 ~ file: server1.js:138 ~ app.put ~ result:", result)
    res.json(result);
    console.log("🚀 ~ file: server1.js:141 ~ app.put ~ result:", result)
});

//DELETE
app.delete("/delete/:id", async (req, res) => {
    let idDel = req.params.id;
    let resultDel = await monomodel.findOneAndDelete({ id: idDel });
    console.log("🚀 ~ file: server1.js:148 ~ app.delete ~ result:", result)
    res.json(resultDel);
    console.log("🚀 ~ file: server1.js:150 ~ app.delete ~ result:", result)
});

app.listen(process.env.PORT, () => {
    console.log("app listen port: 5000");
});

function randPassword(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let result = '';
    const charactersLength = characters;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    };
    return result;
};

function encryptedPassword(password) {
    return CryptoJS.AES.encrypt(password, process.env.AES_KEY).toString();
};

function decryptedPassword(decryptPassword) {
    return CryptoJS.AES.decrypt(decryptPassword, process.env.AES_KEY).toString(CryptoJS.enc.Utf8);
}