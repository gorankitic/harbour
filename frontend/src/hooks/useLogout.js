// hooks
import { useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const queryClient = useQueryClient()

    const logout = async () => {
        const response = await fetch('http://localhost:5000/api/users/logout', {
            credentials: 'include'
        })

        if(response.ok) {
            localStorage.removeItem('signedInUser')
            dispatch({ type: 'LOGOUT' })
            queryClient.removeQueries()
        }
    }

    return { logout }
}