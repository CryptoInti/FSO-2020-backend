// const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

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

// const port = 3001
// app.listen(port)
// console.log('SErver Rurnrunr')

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})