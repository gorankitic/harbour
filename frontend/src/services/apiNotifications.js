export const getNotifications = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/notifications`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    if(!response.ok) {
        throw new Error('Notifications could not be loaded')
    }
    const json = await response.json()
    return json
}

export const makeNotificationsRead = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    if(!response.ok) {
        throw new Error('Notifications could not be loaded')
    }
}