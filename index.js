const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let notes = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("<h1>Homepage</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    id = Number(request.params.id)
    note = notes.find(note => note.id === id)
    
    if(note){
        response.send(note)
    } else {
        response.status(404).end()
    }
    
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)

    response.status(204).end()
    //Verified with Postman - 204 received
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `Phonebook has info for ${notes.length} people
        <br />
        ${date}`
    )
})

app.post('/api/persons', (request, response) => {
    id = Math.floor(Math.random() * (1000000000 - 1) + 1)
    const note = request.body
    
    if(
        note.name == null || note.number == null
    ){
        response.status(400).json({error: 'Must have a name and number'}).end()
    
    } else if(
        notes.find(record => record.name === note.name)
    ) {
        response.status(403).json({error: 'Name must be unique'}).end()
    } else {
        notes = notes.concat(note)

        console.log(note)
        response.json(note)
    }
        

    //Tested with postman - Status 200 + console note logged
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})