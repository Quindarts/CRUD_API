const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

const PORT = 3000;
const DB = "mongodb://localhost:27017/server1";

mongoose.connect("mongodb://localhost:27017/server1");

mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection is open to ", DB);
});

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

//PUT
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;

    //
    let result = await monomodel.findOneAndUpdate(
        { id: upid },
        { $set: { name: upname, email: upemail } },
        { new: true, upsert: true, rawResult: true },
    );
    res.json(result);
});

app.listen(3000, () => {
    console.log("app listen port: 3000");
});

//DELETE
app.delete("/delete/:id", async (req, res) => {
    let idDel = req.params.id;
    let resultDel = await monomodel.findOneAndDelete({ id: idDel });
    res.json(resultDel);
});
