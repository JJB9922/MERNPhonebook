const mongoose = require('mongoose')

if (process.argv.length<3){
    console.log("Please give password or password name and number as argument")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@phonebookdb.ggi4psl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personsSchema)

if(process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
} else {
    console.log("Phonebook:\n")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}