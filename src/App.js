import { useState } from 'react'
import Header from './components/Header'
import SearchResults from './components/SearchResults'

function App() {

  const [showResults, setShowResults] = useState(false)
  const [currentCompound, setCurrentCompound] = useState({})

  const onSearch = async (search) => {
    console.log(search.text)

    const newCompound = {}

    // fetch the compound data
    const resInfo = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${search.text}/JSON`)
    const infoData = await resInfo.json()

    const infoRoot = infoData["PC_Compounds"]["0"]
    const propRoot = infoRoot["props"]
    const cid = infoRoot["id"]["id"]["cid"]

    // fetch the compound images
    const resImg = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`)
    const imgData = await resImg.blob()
    var img = URL.createObjectURL(imgData)

    newCompound['mw'] = ''
    newCompound['mf'] = ''
    // search query result for molecular weight
    for (const item of propRoot) {
      if (item.urn.label === "Molecular Weight") {
        newCompound['mw'] = item.value.sval
      }
      if (item.urn.label === "Molecular Formula") {
        newCompound['mf'] = item.value.sval
      }
    }
    newCompound['name'] = search.text
    newCompound['cid'] = cid
    newCompound['img'] = img

    setCurrentCompound(newCompound)
    setShowResults(true)

    if (search.mvModel) {
      window.open(`https://molview.org/?cid=${cid}`)  
    }
  }

  const onClear = () => {
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
