// firebase
import { projectStorage } from '../firebase/config'
import { ref, deleteObject } from 'firebase/storage'

export const getPosts = async (_id) => {
    const response = await fetch(`http://localhost:5000/api/users/${_id}/posts`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    const json = await response.json()
    if(!response.ok) {
        throw new Error('Posts could not be loaded')
    }
    return json
}

export const getPost = async (userId, postId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/posts/${postId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    const json = await response.json()
    if(!response.ok) {
        throw new Error('Post could not be loaded')
    }
    return json
}

export const createPost = async (_id, imageURL) => {
    const response = await fetch(`http://localhost:5000/api/users/${_id}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ imageURL })
    })
    const json = await response.json()
    if(!response.ok) {
        throw new Error('Post could not be created')

    }
    return json
}

export const deletePost = async (userId, postId, imageURL) => {
    // 1. Delete post document in MongoDB
    const response = await fetch(`http://localhost:5000/api/users/${userId}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    if(!response.ok) {
        throw new Error('Post could not be deleted')
    }
    // 2. Delete image file in firebase/storage
    if(response.ok) {
        const imageRef = ref(projectStorage, imageURL)
        await deleteObject(imageRef)
    }
}

export const getTimelinePosts = async (userId) => {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/posts/timeline`, {
        credentials: 'include'
    })
    const json = await response.json()
    if(!response.ok) {
        throw new Error('Posts could not be loaded')

    }
    return json
}