// hooks
import { createContext, useEffect, useReducer } from 'react'

export const AuthContext = createContext()

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { signedInUser: action.payload }
        case 'LOGOUT':
            return { signedInUser: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        signedInUser: null
    })

    console.log('AuthContext state: ', state)

    useEffect(() => {
        const signedInUser = JSON.parse(localStorage.getItem('signedInUser'))
        if(signedInUser) {
            dispatch({ type: 'LOGIN', payload: signedInUser })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}