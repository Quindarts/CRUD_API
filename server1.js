const express = require("express");
const app = express();
const cors = require("cors");

//CONST
const PORT = 5000;
const BASE_URL = "mongodb://localhost:27017/server1";
const mongoose = require("mongoose");
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//SCHEMA
const sch = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Task"],
    },
    email: {
        type: String,
        default: false,
    },
    id: {
        type: Number,
        default: false,
    },
});
const monomodel = mongoose.model("col1", sch);

//USE
app.use(cors(corsOptions));
app.use(express.json());

//MONGO
mongoose.connect(BASE_URL);
mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection is open to ", BASE_URL);
});

//GET
app.get("/get-all-user", async (req, res) => {
    let result = await monomodel.find({});
    console.log(res);
    res.json(result);
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
PORT;

//PUT
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;

    let result = await monomodel.findOneAndUpdate(
        { id: upid },
        { $set: { name: upname, email: upemail } },
        { new: true, upsert: true, rawResult: true },
    );
    res.json(result);
});

//DELETE
app.delete("/delete/:id", async (req, res) => {
    let idDel = req.params.id;
    let resultDel = await monomodel.findOneAndDelete({ id: idDel });
    res.json(resultDel);
});

app.listen(5000, () => {
    console.log("app listen port: 5000");
});
