// hooks
import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <form onSubmit={handleSubmit} className='auth'>
            <h2>Login to Harbour</h2>
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
        
            {!isLoading && <button className='btn'>Login</button>}
            {isLoading && <button className="btn" disabled>loading</button>}
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default Login