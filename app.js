const express = require('express');
const app = express();
const User = require('./models/userModel');
const mongoose = require("mongoose");
const port = 3000;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Washington State University API",
			version: "1.0.0",
			description: "A CRUD API application for Users made with Express and documented with Swagger.",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//middleware used from JSON parsing.
app.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first name
 *         - last name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first name:
 *           type: string
 *           description: The User's first name
 *         last name:
 *           type: string
 *           description: The User's last name
 *         email:
 *           type: string
 *           description: The User's email
 *       example:
 *         id: d5fE_asz
 *         firstName: Alvin 
 *         lastName: Dewdney
 *         email: alv@gmail.com
 */



/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user is successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

//create a new user
app.post('/createUser', async(req, res) => {
  try {
    const user  = await User.create(req.body)
    res.status(200).json(user);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
  }

 })

 /**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

 //get all users
 app.get('/getAllUsers', async(req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
 })

 /**
 * @swagger
 * /getUserById/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */

 //get user by id
 app.get('/getUserById/:id', async(req, res) =>{
  try {
      const {id} = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

/**
 * @swagger
 * /updateUser/{id}:
 *  put:
 *    summary: Update a user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user has bee updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user is not found
 *      500:
 *        description: Some error happened
 */
//update a user
app.put('/updateUser/:id', async(req, res) => {
  try {
      const {id} = req.params;
      const user = await User.findByIdAndUpdate(id, req.body);
      // we cannot find any user in database
      if(!user){
          return res.status(404).json({message: `User with ID ${id} not found`})
      }
      const updatedUser = await User.findById(id);
      res.status(200).json(updatedUser);
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

/**
 * @swagger
 * /deleteUserById/{id}:
 *   delete:
 *     summary: Delete User by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: The user has been deleted
 *       404:
 *         description: The user was not found
 */

//delete user by id
app.delete('/deleteUserById/:id', async(req, res) =>{
  try {
      const {id} = req.params;
      const user = await User.findByIdAndDelete(id);
      if(!user){
          return res.status(404).json({message: `cannot find any user with ID ${id}`})
      }
      const deletedUser = await User.findById(id);
      res.status(200).json(deletedUser);
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

 //configuring the connection to the mongodb database
const uri ="mongodb+srv://bulimua:washington%40Imbuka@washingtonuni.xyxy7ts.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
      await mongoose.connect(uri);
      console.log("Connected to Mongo Database Successfully");
       } catch (error) {
            console.error(error);
          }
        }

connect();

const loggingMiddleware = (req, res, next) => {
    // Log timestamp and requested endpoint
    logRequestDetails(req);
  
    // Continue with the request chain
    next();
  };
  
  // Function to log request details
  const logRequestDetails = (req) => {
    // Get the current timestamp
    const timestamp = new Date().toLocaleString();

    // Get the requested endpoint
    const endpoint = req.path;

    // Log the details 
    console.log(`Timestamp: ${timestamp} | Requested Endpoint: ${endpoint}`);
  };
  
  // Use the logging middleware for all routes
  app.use(loggingMiddleware);
  
  app.get("/api/health", function (req, res) {
    res.send("Server is healthy");
  });
  
  app.listen(port, function () {
    console.log(`Server is running on http://localhost:${port}!`);
  });






