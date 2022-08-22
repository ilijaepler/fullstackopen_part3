const e = require('express')
const { response } = require('express')
const express = require('express')
const app = express()

let persons = [
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

app.use(express.json())

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(contact){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const generateId = () => {
    return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name){
        response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number){
        response.status(400).json({
            error: 'number missing'
        })
    }

    if(persons.find(p => p.name === body.name)){
        response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})