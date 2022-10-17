const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 9000;
const connection = require('./config');
const cors = require("cors");

connection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Database successfully connected')
    }
})

const products = [
    { category: 'electronics', price: 400, title: 'phone', id: 1},
    { category: 'electronics', price: 900, title: 'tv', id: 2},
    { category: 'electronics', price: 200, title: 'vacuum', id: 3},
];

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

// GET /products
// http://localhost:9000/products
app.get('/products', (request, response) => {
    // the request object is what the client (react / postman) is sending
    // the response object is what the api sends back to frontend or client

    connection.query('SELECT * FROM Product', (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            response.status(200).json(results)
        }
    })
});

// POST /products
app.post('/products', (request, response) => {
    const formData = request.body;
    console.log(formData)
    connection.query('INSERT INTO Product SET ?', [formData], (error, results) => {
        if (error) {
            response.status(500).send(error);
        } else {

            const newProductId = results.insertId
            connection.query('SELECT * FROM Product WHERE id = ?', [newProductId], (error, results) => {
                if (error) {
                    response.status(500).send(error);
                } else {
                    response.status(200).json(results);
                }
            })

        }
    });
})

// GET BY ID /products/:id
app.get('/products/:id', (request, response) => {
    const productId = request.params.id;

    connection.query('SELECT * FROM Product WHERE id = ?', [productId], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            if(results.length) {
                response.status(200).json(results)
            } else {
                response.status(404).send({ message: `The product with the id ${productId} was not found`})
            }
        }
    })
})

// UPDATE BY ID /products/:id


// DELETE BY ID /products/:id
app.delete('/products/:id', (request, response) => {
    const productToDeleteId = request.params.id;

    connection.query('DELETE FROM Product WHERE id = ?', [productToDeleteId], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            if(results.affectedRows === 1) {
                response.status(200).send({ message: `The product with the id ${productToDeleteId} was successfully deleted`})
            } else {
                response.status(404).send({ message: `The product with the id ${productToDeleteId} is already deleted`})
            }
        }
    })

})


app.listen(port, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log(`App is listening at port: ${port}`)
    }
})