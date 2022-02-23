import { useState } from 'react'
import Header from './components/Header'
import SearchResults from './components/SearchResults'
import CompoundObj from './objects/CompoundObj'

function App() {

  const [showResults, setShowResults] = useState(false)
  const [currentCompound, setCurrentCompound] = useState({})
  const compoundsLoc = 'http://localhost:5000/searched'
  const analyticsLoc = 'http://localhost:5000/analytics'

  /**
   * Retrieves the location of a specific compound in the database.
   * 
   * @param {number} cid The CID of the compound
   * @returns The URL of the compound
   */
  function getCompoundLoc(cid) {
    return `${compoundsLoc}/${cid}`
  }

  /**
   * Converts JSON data into a compound object.
   * 
   * @param {*} data The data to convert
   * @returns The compound object representation of the data
   */
  function dataToCompound(data) {
    let fetched = new CompoundObj()
    fetched.setAll(data['name'], data['cid'], data['mf'], data['mw'])
    return fetched
  }

  /**
   * Fetches a compound from the database by a name.
   * Contacts the PubChem REST API.
   * Returns null if the compound was not found.
   * This function is intensive.
   * 
   * @param {string} name The name of the compound to find
   * @returns The compound data if found, otherwise null
   */
  async function fetchCompoundByName(name) {
    const res = await fetch(compoundsLoc)
    console.log("FETCHED")
    const data = await res.json()
    console.log(data)

    let lname = name.toString().toLowerCase()

    for (var k of Object.keys(data)) {
      let v = data[k]
      if (lname == v['name']) {
        console.log(`Found compound in DB with cid ${v['cid']} and name ${lname}.`)
        return v
      }
    }
    console.log(`Could not find the compound with the name ${lname.toString()} in the DB.`)
    return null;
  }

  /**
   * Fetches a compound from the database by its CID.
   * Contacts the PubChem REST API.
   * This function is not as intensive.
   * 
   * @param {number} cid The CID to search for 
   * @returns The compound data if found, otherwise empty data
   */
  async function fetchCompoundByCID(cid) {
    const res = await fetch(getCompoundLoc(cid))
    const data = await res.json()

    console.log(data)
    return data
  }

  /**
   * Fetches a blob of a compound image.
   * Contacts the PubChem REST API.
   * This function is not as intensive.
   * 
   * @param {number} cid The CID of the compound 
   * @returns The image retrieved from the PubChem API
   */
  async function fetchCompoundImageByCID(cid) {
    const resImg = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`)
    const imgData = await resImg.blob()
    return URL.createObjectURL(imgData)
  }

  /**
   * Retrieves the analytics of the application.
   * 
   * @returns The analytics of the application in JSON form 
   */
  async function fetchAnalytics() {
    const res = await fetch(`${analyticsLoc}`)
    const data = await res.json()
    return data
  }

  /**
   * Updates the current analytics data.
   * 
   * @param {*} analytics The new analytics data in JSON form
   */
  async function putAnalytics(analytics) {
    const resInfo = await fetch(analyticsLoc, 
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analytics)
      })
  }

  /**
   * Puts a compound entry into the database.
   * If the compound is already inside the database, update it.
   * Else add the compound to the database.
   * 
   * @param {*} ins Whether the compound is already inside of the database or not
   * @param {*} cmpnd The compound object to add
   */
  async function putInDB(ins, cmpnd) {
    // send a POST request if te compound is not in the DB
    if (ins) {
      const resInfo = await fetch(compoundsLoc, 
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: cmpnd.toJSON()
      })
    // send a PUT request if the compound is already in the DB
    } else {
      const cmpndToUpdateData = await fetchCompoundByCID(cmpnd.cid)
      const cmpndToUpdate = dataToCompound(cmpndToUpdateData);
      cmpndToUpdate.setAll(cmpnd.name, cmpnd.cid, cmpnd.mf, cmpnd.mw)
      const resInfo = await fetch(getCompoundLoc(cmpndToUpdate.cid), 
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: cmpndToUpdate.toJSON()
      })
    }
  }

  /**
   * Handles the logic behind the searching of a compound.
   * 
   * @param {*} search The status of the search 
   */
  async function onSearch(search) {
    console.log(`Compound searched: ${search.text}`)
    const analyticData = await fetchAnalytics()
    analyticData['searchCount'] = analyticData['searchCount'] + 1

    // Check if the compound was searched by CID
    const isCID = parseInt(search.text)
    console.log(isCID == true)
    let cmpndInDB;
    if (isCID == true) {
      cmpndInDB = await fetchCompoundByCID(isCID)
    } else {
      cmpndInDB = await fetchCompoundByName(search.text)
    }
    
    const inDB = (cmpndInDB != null)
    let newCompound = new CompoundObj();
    
    // if the data is not in the database, create a new compound object and add it
    if (!inDB) {
      // fetch the compound data
      const resInfo = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${search.text}/JSON`)
      const infoData = await resInfo.json()

      const infoRoot = infoData["PC_Compounds"]["0"]
      const propRoot = infoRoot["props"]
      const cid = parseInt(infoRoot["id"]["id"]["cid"])

      // search query result for molecular weight
      for (const item of propRoot) {
        if (item.urn.label === "Molecular Weight") {
          newCompound.mw = parseFloat(item.value.sval)
        }
        if (item.urn.label === "Molecular Formula") {
          newCompound.mf = item.value.sval
        }
      }
      newCompound.name = search.text
      newCompound.cid = cid
      analyticData['compoundCount'] = analyticData['compoundCount'] + 1

      await putInDB(!inDB, newCompound)
    } else {
      newCompound = dataToCompound(cmpndInDB)
    }

    putAnalytics(analyticData)
  
    // fetch the compound images
    const img = await fetchCompoundImageByCID(newCompound.cid)
    newCompound.img = img

    

    // set the current state to match the search
    setCurrentCompound(newCompound)
    setShowResults(true)

    // display in molview if required
    if (search.mvModel) {
      window.open(`https://molview.org/?cid=${newCompound.cid}`)  
    }
  }

  function onClear() {
    setShowResults(false)
    setCurrentCompound({})
  }

  return (
    <div className="container">
      <Header onEnter={onSearch} onClear={onClear}/>
      {showResults && <SearchResults compound={currentCompound}/>}
    </div>
  );
}

export default App;
