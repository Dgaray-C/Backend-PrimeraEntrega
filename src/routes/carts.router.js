const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const router = express.Router()
const cartFilePath = path.join(__dirname, '../../carts.json')

const readFile = () => JSON.parse(fs.readFileSync(cartFilePath, 'utf-8'))
const saveFile = (data) => fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2))

router.post('/', (req, res) => {
    const carts = readFile()
    const newCart = {
        id: crypto.randomUUID(), 
        products: []
    }
    carts.push(newCart)
    saveFile(carts)
    res.status(200).send(`carrito creado: ${newCart.id}`)
})

router.get('/:cid', (req, res) => {
    const cart = readFile().find(c => c.id == req.params.cid)
    res.send(cart.products)
})

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readFile()
    const cartIndex = carts.findIndex(c => c.id == req.params.cid)

    const { pid } = req.params
    const existingProduct = carts[cartIndex].products.find(p => p.product == pid)

    if (existingProduct) {
        existingProduct.quantity++
    } else {
        carts[cartIndex].products.push({
            product: pid,
            quantity: 1
        })
    }

    saveFile(carts)
    res.send("producto agregado al carrito")
})

module.exports = router