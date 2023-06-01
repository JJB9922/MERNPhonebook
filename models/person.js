const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)

mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB")
        console.log(result)
    })
    .catch(error => {
        console.log(`Error connecting to MongoDB: ${error}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^(?:\d{3}|\d{2})-\d{7}$/gm.test(v)
            },
            message: "Invalid phone number format!"
        },
        required: [true, "Number required"]
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)