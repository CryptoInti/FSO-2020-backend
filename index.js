// const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck asd', number: '39-23-6423122', id: 4 },
    { name: 'Friedrich Nietzsche', number: '36-93-692693', id: 5 },
]
// const app = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'application/json'})
//     res.end(JSON.stringify(persons))
// })

app.get('/', (req,res) => {
    res.send('Hallo Phonebook Welt')
    console.log('ask for /')
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br></br>${new Date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(203).end()
})

const generateId = (max) => {
    const newId = Math.floor(Math.random() * Math.floor(max))
    const findIt = persons.find(p => p.id === newId)
        console.log('max',max,'newId',newId,'findIt',typeof findIt)
    if(typeof findIt !== 'object'){
        return newId
    }
    else{
        return generateId(max*2)
    }
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    if(persons.find(p => p.name === body.name)){
        res.status(400).json({
            error: 'name must be unique'
        })
    }else{
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(10)
        }
    
        console.log(person)
        persons = persons.concat(person)
        res.json(person)
    }
})
// const port = 3001
// app.listen(port)
// console.log('SErver Rurnrunr')

const unknownEndpoint = (req, res) => {
    res.status(404).send('<img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstatic.tumblr.com%2Fixshp06%2FYP6m2221z%2Fdennis_nedry_magic_word_header.gif&f=1&nofb=1" alt="nanana"></img>')
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
