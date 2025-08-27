import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

// 1. Import dotenv
import dotenv from 'dotenv'
// 2. Load the .env file
dotenv.config()
const API_URL = 'https://api.nasa.gov/planetary/apod?api_key=' + process.env.API_KEY

// app & port
const app = express()
const port = 3000
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

// routes
// photo of the day
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(API_URL)
        res.render('index.ejs', {data: response.data})   
    } catch (error) {
        console.error(error)
        res.status(500).send('Error retrieving image')
    }
})

// random
app.get('/random', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}&count=1`)
        res.render('index.ejs', {data: response.data[0]})
    } catch (error) {
        console.error(error)
        res.status(500).send('Error retrieving image')
    }
})

// search
app.get('/search', async (req, res) => {
    res.render('search.ejs') 
})

// retrieve photo
app.get('/post-photo', async (req, res) => {
    const date = req.query.date
    try {
        const response = await axios.get(`${API_URL}&date=${date}`)
        res.render('index.ejs', {data: response.data})
    } catch (error) {
        console.error(error)
        res.status(500).send('Error retrieving image')
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})