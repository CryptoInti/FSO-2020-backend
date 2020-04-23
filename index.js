require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req,res) => {
  res.send('Hallo Phonebook Welt')
  console.log('ask for /')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  // eslint-disable-next-line no-undef
  res.send(`Phonebook has info for ${persons.length} people <br></br>${new Date}`)
})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person.toJSON())
      }else{
        console.log('ERROR on DB when try to get a Person, the message is: ')
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(_result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
    
  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  person.save().then(savePerson=> {
    res.json(savePerson.toJSON())
  })
    .catch((error) => {
      console.log('Error on MongoDB when try to Save a new person, the message is: ', error.message)
    })

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})


const unknownEndpoint = (req, res) => {
  res.status(404).send('<img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstatic.tumblr.com%2Fixshp06%2FYP6m2221z%2Fdennis_nedry_magic_word_header.gif&f=1&nofb=1" alt="nanana"></img>')
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
