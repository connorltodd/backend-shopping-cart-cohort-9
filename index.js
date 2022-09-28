const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 9000;

const products = [
    { category: 'electronics', price: 400, title: 'phone', id: 1},
    { category: 'electronics', price: 900, title: 'tv', id: 2},
    { category: 'electronics', price: 200, title: 'vacuum', id: 3},
];

// middleware is a function that intercepts the request object to manipulate it in some way
app.use(express.json())

// GET /products
// http://localhost:9000/products
app.get('/products', (request, response) => {
    // the request object is what the client (react / postman) is sending
    // the response object is what the api sends back to frontend or client

    // first we would connect to the database, return the info and then send to the client
    // like the line below
    response.status(200).send(products);
});

// POST /products
app.post('/products', (request, response) => {
    // when creating new resources we need to use the body
    const newProduct = request.body;
    const newProductWithId = {...newProduct, id:  uuidv4() }
    // push is faking the database injection of product
    products.push(newProductWithId);
    // when creating a new resource send it to frontend to sync frontend
    response.status(200).send(newProductWithId);
})

// GET BY ID /products/:id
app.get('/products/:id', (request, response) => {
    const params = request.params;

    const requestedProduct = products.find(product => product.id === Number(params.id))
    if(!requestedProduct) {
        response.status(404).send({ message: `the product with the id ${params.id} does not exist`})
    } else {
        response.status(200).send(requestedProduct)
    }
})

// UPDATE BY ID /products/:id


// DELETE BY ID /products/:id


app.listen(port, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log(`App is listening at port: ${port}`)
    }
})