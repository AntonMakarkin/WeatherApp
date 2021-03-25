import express from 'express'
import path from 'path'
import hbs from 'hbs'
import { fileURLToPath } from 'url'
import geocode from './utils/geocode.js'
import forecast from './utils/forecast.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location (adding settings)
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve (load at first)
app.use(express.static(publicDirectoryPath)) 

app.get('/', (req, res) => { 
    res.render('index', { //get view and converts it inti html
        title: 'Weather',
        name: 'Anton Makarkin'
    }) 
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Anton Makarkin'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'Do you need help? Check this page and find an answer',
        title: 'Help',
        name: 'Anton Makarkin'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Anton Makarkin',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Anton Makarkin',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});