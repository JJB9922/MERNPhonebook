import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import FilteredDisplay from './components/FilteredDisplay'
import peopleService from './services/people'
import notifications from './components/Notification'

const App = () => {
  //State handlers
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchVal, setSearchVal] = useState('')

  //Fetch data from database
  useEffect(() => {
    console.log('effect')
    peopleService
        .getAll()
          .then((initialPersons) => {
          console.log('promise fulfilled')
          setPersons(initialPersons)
          
        },)
  }, [])



  console.log("There are ", persons.length, " people")

  //Event handlers
  const handleNameChange = (event) =>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleSearchChange = (event) =>{
    console.log("SearchVal: ", event.target.value)
    setSearchVal(event.target.value)
  }
  
  const handleNumberChange = (event) =>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) =>{
    console.log("addEvent: ", event.target)
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      //id: persons.length + 1
    }
    const changedNumber = {...personObject, number: newNumber}
    
    const nameTest = nameArray.find(name => name === newName)
    console.log("Test: ", nameTest)
    if(!nameTest){
    peopleService.create(personObject)
      .then(person => {
        setPersons(persons.concat(person))
        console.log(persons)
        console.log("Button Clicked: ", event.target)
        setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(error => {
          console.log("error", error.response.data)
          setErrorMessage(error.response.data)
            setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      setNewName('')
      setNewNumber('')
    
    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)){
        console.log("addPerson: ", persons.find(i => i.name === newName))
        const personToUpdate = persons.find(i => i.name === newName)

        peopleService.update(personToUpdate.id, changedNumber)
          .then(returnedPerson => {
            console.log(`${newName} has been updated with the new number`)
            console.log(`Chained then: ${returnedPerson}`)
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage('Update Successful')
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          }).catch(error => {
            console.log("Update Error: ", error)
            setPersons(persons.filter(p => p.id !== personToUpdate.id))
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      
    }
      
  }

  const handleDelClick = (event) => {
    console.log(event.target.value)
    console.log("People to show: ", peopleToShow)
    const chosenPerson = peopleToShow.find(i => i.id == event.target.value)
    console.log("Chosen person = ", {chosenPerson})

    if (window.confirm(`Delete ${chosenPerson.name}?`)) {
      peopleService.remove(event.target.value).then(() => {
        console.log(`Deleted person with id ${event.target.value}`)
        console.log("PMap: ", persons.filter(i => i.id !== chosenPerson.id))
        setPersons(persons.filter(i => i.id !== chosenPerson.id))
        })
    } else {
      console.log(`${chosenPerson} not deleted.`)

    }
    
  }

  //Creating additional arrays
  const peopleToShow = persons.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase()))
  const nameArray = persons.map(p => p.name)
  
  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter handleSearchChange={handleSearchChange}/>

      <h2>Add a new contact</h2>
      
      <notifications.SuccessMsg message={successMessage}/>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      
      <h2>Numbers</h2>
      <notifications.ErrorMsg message={errorMessage}/>
      <FilteredDisplay key={peopleToShow.id} peopleToShow={peopleToShow} handleDelClick={handleDelClick}/>

    </div>
  )
}

export default App