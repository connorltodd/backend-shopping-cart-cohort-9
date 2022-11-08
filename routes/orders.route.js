const express = require('express');
const router = express.Router();
const connection = require('../config');

// POST /orders
router.post('/', (request, response) => {
    // 1. on the frontend we would have an array of cart products which would each have the product id
    const formData = request.body;
    // from the frontend we would send that array to the backend
    console.log(formData)

    // the endpoint will first create the order record which will contain the user id
    connection.query('INSERT INTO `Order` (user_id) VALUES (?)', [formData.user_id], (error, results) => {
        if(error) {
            response.status(500).send(error)
        } else {
            const newOrderId = results.insertId
           
            // take the order id and map through the array of cart products creating an order_product record each time
            const orderProducts = [];
            formData.product_ids.map(product_id => {
                const orderProductCreation = connection.query('INSERT INTO Order_Product (order_id, product_id) VALUES (?,?)', [newOrderId, product_id], (error) => {
                    if(error) {
                        response.status(500).json(error);
                    }
                })
                orderProducts.push(orderProductCreation)
            })
            
            Promise.all(orderProducts).then((values) => {
                connection.query('SELECT *  FROM `Order` JOIN Order_Product ON Order_Product.order_id JOIN Product ON Product.id = Order_Product.product_id WHERE `Order`.id = ?',[newOrderId], (error, results) => {
                    if(error) {
                        response.status(500).json(error);
                    } else {
                        response.status(200).json(results);
                    }
                })
            });

        
        }
    })
})

module.exports = router;