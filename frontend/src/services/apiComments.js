export const createComment = async (postId, userId, newComment) => {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment, userId })
    })
    const json = await response.json()

    if(!response.ok) {
        throw new Error('Post could not be commented')
        
    }
    return json
}