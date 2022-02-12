import React, { useState } from 'react'

const SearchCompound = (props) => {

    const [text, setText] = useState('')
    const [mvModel, setMVModel] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()
        
        if (!text) {
            alert('Please enter the name of a chemical')
            return
        }

        props.onEnter({ text, mvModel })
        setText('')
    }

    return (
    <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
            <label>Compound Name</label>
            <input type='text' value={text} onChange={(e) => setText(e.target.value)}></input>
        </div>
        <div className='form-control-check'>
            <label>To Molview Model</label>
            <input type='checkbox' value={mvModel} checked={mvModel} onChange={(e) => setMVModel(e.currentTarget.checked)}></input>
        </div>
        <button className='btn'>Query</button>
    </form>
    )
}

export default SearchCompound