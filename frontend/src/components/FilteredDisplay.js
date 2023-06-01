import React from 'react'

const DisplayFilteredPerson = ({peopleToShow, handleDelClick}) => {
    
    return(
    <div>
      {peopleToShow.name} {peopleToShow.number} <button value={peopleToShow.id} onClick={handleDelClick}> Delete </button>
    </div>
    )
  }

export default function FilteredDisplay({peopleToShow, handleDelClick}) {
  return (
    <div>{peopleToShow.map(peopleToShow => <DisplayFilteredPerson key={peopleToShow.id} peopleToShow={peopleToShow} handleDelClick={handleDelClick}/> )}
    {console.log("FD PTS: ", peopleToShow)}</div>
    
  )
}
