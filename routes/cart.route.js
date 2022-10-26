const express = require('express');
const router = express.Router();
const connection = require('../config');

// GET /cart/:cart_id/products
router.get('/:cart_id/products', (request, response) => {
    const { cart_id } = request.params;
    connection.query(`
    SELECT Product.*, Cart_Product.id as cart_product_id, Cart.id as cart_id From Cart 
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
        if(error) {
            response.status(500).json(error)
        } else {
            response.json({ message: 'product was successfully added to basket' })
        }
    })
})

// PUT /cart/:cart_id/products/:cart_product_id (Update Quantity)
// DELETE BY ID /cart/:cart_id/products/:cart_product_id


module.exports = router;
