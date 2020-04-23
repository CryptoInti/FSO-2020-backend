const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
    console.log('is necesary minimun the argument password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-8ijy0.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length > 3 ) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
        date: new Date(),
    })
    
    person.save().then(res => {
        console.log('person',person)
        mongoose.connection.close()
        console.log(`added ${name} number ${number} to phonebook`)
    })

} else {
    Person.find({}).then(res => {
        console.log('phonebook: (aus mongodb)')
        res.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}