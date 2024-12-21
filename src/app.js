const express = require('express')
const productRouter = require('./routes/products.router')
const cartRouter = require('./routes/carts.router')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send(`error en el servidor`)
})

app.listen(PORT, () => {
    console.log(`Server con puerto  ${PORT}`)
})