// hooks
import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'


const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const { signup, isLoading, error } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password, displayName)
    }

    return (
        <form onSubmit={handleSubmit} className='auth'>
            <h2>Sign up to Harbour</h2>
            <label>
                <span>Email:</span>
                <input
                    required 
                    type='email' 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                />
            </label>
            <label>
                <span>Password:</span>
                <input
                    required
                    type='password' 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                />
            </label>
            <label>
                <span>Display name:</span>
                <input
                    required
                    type='text' 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    value={displayName}
                />
            </label>
        
            {!isLoading && <button className='btn'>Sign up</button>}
            {isLoading && <button className="btn" disabled>loading</button>}
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default Signup