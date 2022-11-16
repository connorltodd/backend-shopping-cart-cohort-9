const { application } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../config');

// GET /cart/:cart_id/products
router.get('/:cart_id/products', (request, response) => {
    const { cart_id } = request.params;
    connection.query(`
    SELECT Product.*, Cart_Product.id as cart_product_id, Cart.id as cart_id, Cart_Product.quantity From Cart 
    JOIN Cart_Product on Cart_Product.cart_id = Cart.id 
    JOIN Product ON Product.id = Cart_Product.product_id 
    WHERE Cart.id = ?`, [cart_id], (error, results) => {
        if(error) {
            response.status(500).json(error);
        } else {
            response.json(results)
        }
    })
})

// POST /cart/:cart_id/products
router.post('/:cart_id/products', (request, response) => {
    const { cart_id } = request.params;
    const formData = request.body;

    connection.query('INSERT INTO Cart_Product (cart_id, product_id) VALUES (?,?)', 
    [formData.cart_id, formData.product_id], (error, results) => {
        const newCartProductId = results.insertId
        if(error) {
            response.status(500).json(error)
        } else {
            connection.query(`
                SELECT Product.*, Cart_Product.id as cart_product_id, Cart.id as cart_id, Cart_Product.quantity From Cart 
                JOIN Cart_Product on Cart_Product.cart_id = Cart.id 
                JOIN Product ON Product.id = Cart_Product.product_id 
                WHERE Cart_Product.id = ?`, [newCartProductId], (error, results) => {
                if(error) {
                    response.status(500).json(error);
                } else {
                    response.json(results)
                }
            })
        }
    })
})

// PUT /cart/:cart_id/products/:cart_product_id (Update Quantity)
router.put('/:cart_id/products/:cart_product_id', (request, response) => {
    const { cart_product_id } = request.params;
    const formData = request.body;

    connection.query('UPDATE Cart_Product SET ? WHERE id = ?', [formData, cart_product_id], (error, results) => {
        if(error) {
            response.status(500).send(error)
        } else {
            response.status(200).send({ message: `The product in the cart's quantity was successfully updated`})
        }
    })
})

// DELETE BY ID /cart/:cart_id/products/:cart_product_id
router.delete('/:cart_id/products/:cart_product_id', (request, response) => {
    const { cart_product_id } = request.params;

    connection.query('SELECT * FROM Cart_Product WHERE id = ?', [cart_product_id], (error, results) => {
        if(!results.length) { 
            response.status(404).send({ message: `The product in the cart does not exist`})
        } else {
                connection.query('DELETE FROM Cart_Product WHERE id = ?', [cart_product_id], (error, results) => {
                    if(error) {
                        response.status(500).send(error)
                    } else {
                        response.status(200).send({ message: `The product in the cart was successfully deleted`})
                    }
                })
            }
        })
    })

module.exports = router;
