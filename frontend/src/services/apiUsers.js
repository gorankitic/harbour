export const getUser = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        credentials: 'include'
    })
    const json = await response.json()
   
    if(!response.ok) {
        throw new Error('User could not be loaded')
    }

    return json
}
    