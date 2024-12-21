const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const crypto = require('crypto')

const filePath = path.join(__dirname, '../../products.json')

const readFile = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const saveFile = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

router.get('/', (req, res) => {
    res.send(readFile())
})

router.delete('/:pid', (req, res) => {
    const products = readFile()
    const index = products.findIndex(p => p.id == req.params.pid)

    if (index === -1) return res.status(404).send("producto no encontrado")

    products.splice(index, 1)
    saveFile(products)

    res.send("producto eliminado")
})

router.get('/:pid', (req, res) => {
    const product = readFile().find(p => p.id == req.params.pid)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send("El producton no exite")
    }
})

router.post('/', (req, res) => {
    const { title, description, price, stock, category, thumbnails } = req.body

    const products = readFile()

    const newProduct = {
        id: crypto.randomUUID(), 
        title,
        description,
        price: price,
        stock: stock,
        category,
        thumbnails: thumbnails || []
    }

    products.push(newProduct)
    saveFile(products)

    res.status(200).send(`El producto ha sido creado: ${newProduct.id}`)
})

router.put('/:pid', (req, res) => {
    const products = readFile()
    const index = products.findIndex(p => p.id === req.params.pid)

    if (index === -1) {
        return res.status(404).send("Producto no fue encontrado.")
    }

    products[index] = { ...products[index], ...req.body, id: req.params.pid }
    saveFile(products)

    res.send("Producto actualizado")
})



module.exports = router