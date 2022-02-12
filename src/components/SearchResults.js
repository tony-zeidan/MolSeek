
const SearchResults = ({ compound }) => {

  return (
    <div>
        <table>
        <tbody>
        <tr>
            <th>Property</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>Name</td>
            <td>{compound.name}</td>
        </tr>
        <tr>
            <td>CID</td>
            <td>{compound.cid}</td>
        </tr>
        <tr>
            <td>M. Formula</td>
            <td>{compound.mf}</td>
        </tr>
        <tr>
            <td>M. Weight</td>
            <td>{compound.mw}</td>
        </tr>
        <tr>
            <td>Image</td>
            <td>
                <img src={compound.img} alt="ChemicalImage" />
            </td>
        </tr>
        </tbody>
        </table>
    </div>
  )
}

export default SearchResults