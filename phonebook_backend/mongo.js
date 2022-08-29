const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password or password, name and number as an argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://ilija:${password}@cluster0.ibgrg1m.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5){
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected')

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })

            return person.save()
        })
        .then(() => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}

if (process.argv.length === 3){
    mongoose
        .connect(url)
        .then((result) => {
            Person.find({}).then(result => {
                console.log('phonebook: ')
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        })
        .catch((err) => console.log(err))
}