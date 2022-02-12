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

    const cid = infoData["PC_Compounds"]["0"]["id"]["id"]["cid"]

    // fetch the compound images
    const resImg = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`)
    const imgData = await resImg.blob()
    var img = URL.createObjectURL(imgData)

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
      {showResults && <SearchResults name={currentCompound.name} cid={currentCompound.cid} img={currentCompound.img}/>}
    </div>
  );
}

export default App;
