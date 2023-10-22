// hooks
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, displayName })
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.message)
        }

        if(response.ok) {
            localStorage.setItem('signedInUser', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
        }
    }
    
    return { signup, isLoading, error }
}