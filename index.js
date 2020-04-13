const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]

// const app = http.createServer((request, response) => {
// response.writeHead(200, { 'Content-Type': 'application/json' })
// response.end(JSON.stringify(notes))
// })

app.get('/', (req, res) => {
    res.send('<h1>Hallo Welt</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    // console.log('id',id)
    const note = notes.find(n => {
        // console.log('inside get one note', n.id, typeof n.id, id, typeof id, n.id === id)        
        return n.id === id
    })
    // console.log('note',note)
    if (note) {
        res.json(note)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(n => n.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    console.log('note', note)
    notes = notes.concat(note)

    res.json(note)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)