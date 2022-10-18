const { request } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../config');

// POST /users (Create user and cart at the same time)
router.post('/', (request, response) => {
    const formData = request.body;
    connection.query('INSERT INTO User SET ?', [formData], (error, results) => {
        if (error) {
            response.status(500).send(error);
        } else {
            const userId = results.insertId
            connection.query('INSERT INTO Cart (user_id) VALUES (?)', [userId], (error, results) => {
                if (error) {
                    response.status(500).send(error);
                } else {
                    response.status(200).send({ message: 'The user and cart was successfully created'});
                }
            })
        }
    }
    )
})

// GET /users/:id (Get user and cart)
router.get('/:id', (request, response) => {
    const userId = request.params.id;
    connection.query('SELECT User.* , Cart.id as cart_id FROM User JOIN Cart ON Cart.user_id = User.id WHERE User.id = ?',
    [userId], (error, results) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(200).send(results);
        }
    })
})

module.exports = router;