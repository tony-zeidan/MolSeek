import SearchCompound from './SearchCompound'

const Header = (props) => {
  return (
    <div>
        <h2>Search Compounds</h2>
        <SearchCompound onEnter={props.onEnter} onClear={props.onClear}/>
    </div>
  )
}

export default Header