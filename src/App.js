import React, { useState } from "react"
import "./App.css"
import { OutputCanvas } from "./OutputCanvas"

function App() {
  const [filterType, setFilterType] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const changeFilterType = () => {
    setIsLoading(true)
    setFilterType(!filterType)
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }
  
  return (
    <div className="App">
      <h2>TF Face Landmarks Detection - Face Filters</h2>
      <button onClick={() => changeFilterType()}>
        {filterType ? "Mask Filter" : "Dog Filter"}
      </button><br/>
      {!isLoading && <OutputCanvas filterType={filterType}/>}
    </div>
  )
}

export default App
