export const follow = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    const json = await response.json()

    if(!response.ok) {
        throw new Error('Could not follow this user')
    }
    return json
}

export const unfollow = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    const json = await response.json()
    if(!response.ok) {
        throw new Error('Could not unfollow this user')

    }
    return json
}