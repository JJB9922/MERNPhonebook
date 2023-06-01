require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('personcontent', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personcontent'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send("Malformatted ID")
    }

    next(error)
}

app.get('/', (request, response) => {
    response.send("<h1>Homepage</h1>")
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if(result){
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
    
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.countDocuments({}).then(docCount => {
        response.send(
            `Phonebook has info for ${docCount} people
            <br />
            ${date}`
        )
    }).catch(error => next(error))
        
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === "" || body.number === ""){
        console.log("Name or number can't be empty")
        return response.status(400).json({error: "Missing a name or number"})
        
    } else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        }).catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log("Name already exists")


    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson =>{
            response.json(updatedPerson)
        }).catch(error => next(error))
    
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})