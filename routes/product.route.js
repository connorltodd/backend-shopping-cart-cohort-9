const express = require('express');
const router = express.Router();
const connection = require('../config');

// GET /products
// http://localhost:9000/products
router.get('/', (request, response) => {
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
router.post('/', (request, response) => {
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
router.get('/:id', (request, response) => {
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
router.put('/:id', (request, response) => {
    const productToUpdateId = request.params.id
    const formData = request.body
    connection.query('UPDATE Product SET ? WHERE id = ?', [formData, productToUpdateId], (error, results) => {
        if(error) {
            response.status(500).json(error)
        } else {
            connection.query('SELECT * FROM Product WHERE id = ?', [productToUpdateId], (error, results) => {
                if (error) {
                    response.status(500).json(error)
                } else {
                    response.status(200).json(results)
                }
            })
        }
    })
})


// DELETE BY ID /products/:id
router.delete('/:id', (request, response) => {
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


module.exports = router;