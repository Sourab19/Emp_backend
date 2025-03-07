// Task1: initiate app and run server at 3000
const express = require("express");
const app = new express();

const morgan = require("morgan");
app.use(morgan("dev"));

const path = require("path");
app.use(express.static(path.join(__dirname + "/dist/FrontEnd")));

require("dotenv").config();

// Middleware
app.use(express.json());

// Task2: create mongoDB connection
const empModel = require("./model/empData");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.mongoDB_URL)
  .then(() => {
    console.log("Connection established");
  })
  .catch(() => {
    console.log("Connection error");
  });

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'
app.get("/api/employeelist", async (req, res) => {
  try {
    const data = await empModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error in  fetching  data");
  }
});

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get("/api/employeelist/:id", async (req, res) => {
  try {
    const employee = await empModel.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).send("Error in  fetching  data");
  }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post("/api/employeelist", async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    if (!name || !location || !position || !salary) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEmployee = new empModel({ name, location, position, salary });
    await newEmployee.save();
    res.status(201).json({ message: "Employee added", newEmployee });
  } catch (error) {
    res.status(500).send("Error in  adding  data");
  }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete("/api/employeelist/:id", async (req, res) => {
  try {
    const employee = await empModel.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).send("Error in  deleting  data");
  }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put("/api/employeelist", async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const updatedEmployee = await empModel.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Update successful", updatedEmployee });
  } catch (error) {
    res.status(500).send("Update unsuccessful");
  }
});
//! dont delete this code. it connects the front end file.
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/Frontend/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
