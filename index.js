const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 9000;
const connection = require('./config');
const cors = require("cors");

const productsRouter = require('./routes/product.route');
const usersRouter = require('./routes/user.route');


connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Database successfully connected')
    }
})


// middleware is a function that intercepts the request object to manipulate it in some way
app.use(express.json());

app.use(cors("*"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use('/products', productsRouter)
app.use('/users', usersRouter)



app.listen(port, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log(`App is listening at port: ${port}`)
    }
})