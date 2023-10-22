export const like = async (postId, userId) => {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({userId})
    })
    const json = await response.json()
    if(!response.ok) {
        console.log(json.message)
        throw new Error('Post could not be liked')
    }

    return json
}

export const unlike = async (postId) => {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}/likes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    if(!response.ok) {
        throw new Error('Post could not be liked')
    }
}