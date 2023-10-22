// hooks
import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
// firebase
import { projectStorage } from '../firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export const useStorage = (file) => {
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [url, setUrl] = useState(null)
    const { signedInUser } = useAuthContext()
    
    useEffect(() => {
        if(file === null) return
        const uploadFile = async () => {
            // Upload image
            // 1) Create upload path where to put image in storage
            const uploadPath = `images/${signedInUser._id}/${file.name}-${Date.now()}`
            // 2) Create reference to that storage 
            const storageRef = ref(projectStorage, uploadPath)
            // 3)Upload image
            const uploadTask = uploadBytesResumable(storageRef, file)
            // 4) Register three observers:
            // 4.1) 'state_changed' observer, called any time the state changes
            // 4.2) Error observer, called on failure
            // 4.3) Completion observer, called on successful completion
            uploadTask.on('state_changed', (snapshot) => {
                let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(percentage)
            }, (error) => {
                setError(error);
            }, async () => {
                const imgURL = await getDownloadURL(storageRef)
                setUrl(imgURL)
            });
        };
        uploadFile()
    }, [file, signedInUser._id])

    return { url, progress, error }
}
