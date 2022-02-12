
const SearchResults = (prop) => {
  return (
    <div>

        <table>
        <tr>
            <th>Property</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>{prop.name}</td>
        </tr>
        <tr>
            <td>CID</td>
            <td>{prop.cid}</td>
        </tr>
        <tr>
            <td>Image</td>
            <td><img src={prop.img} alt="LOGO"></img></td>
        </tr>
        </table>
    </div>
  )
}

export default SearchResults