export default function Filter({handleSearchChange}) {

  return (
    <div>
        Filter shown with: <input onChange={handleSearchChange}/>
    </div>
  )
}
