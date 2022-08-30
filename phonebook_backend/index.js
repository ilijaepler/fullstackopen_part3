require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

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

const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(requestLogger)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.get('/info', (request, response) => {
    Person.find({})
    .then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

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

    // fix this to check to the db
    /*if(person.get({name: body.name})){
        response.status(400).json({
            error: 'name must be unique'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})