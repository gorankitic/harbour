// hooks
import { useState } from 'react'
// components
import { Link } from 'react-router-dom'
// styles
import './Search.css'

const Search = () => {
    const [word, setWord] = useState('')
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUsers([])
        const response = await fetch(`http://localhost:5000/api/users/search?q=${word}`, {
            credentials: 'include'
        })    
        const json = await response.json()

        if(!response.ok) {
            setError(json.message)
        }
        
        if(response.ok) {
            setUsers(json)
        }
    }

    return (
        <div className='search'>
            <div className='search-bar'>
                <form onSubmit={handleSubmit}> 
                    <input type='text' onChange={(e) => setWord(e.target.value)} required placeholder='Find friends' />
                </form> 
            </div>
            {users.length > 0 && <p>Users with name: {word}</p>}
            {error && <p className='error'>{error}</p>}
            <div className='found-users'>
                {users && users.map(user => (
                    <div key={user._id} className='found-user'>
                        <img src={user.photoURL} alt='user profile' />
                        <Link to={`/${user._id}`}>{user.displayName}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search