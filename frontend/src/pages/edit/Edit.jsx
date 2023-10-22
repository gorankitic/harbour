// hooks
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useStorage } from '../../hooks/useStorage'
import { useFetch } from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
// components
import { Link } from 'react-router-dom'
// styles
import './Edit.css'
// assets
import DefaultThumbnail from '../../assets/defaultThumbnail.svg'

const Edit = () => {
    const { signedInUser, dispatch } = useAuthContext()
    const navigate = useNavigate()
    const [email, setEmail] = useState(signedInUser.email)
    const [displayName, setDisplayName] = useState(signedInUser.displayName)
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState('')
    const { url, progress } = useStorage(thumbnail)
    const { data, isLoading, error, postData } = useFetch('http://localhost:5000/api/users/updateProfile', 'PATCH')

    const handleFileChange = (e) => {
        setThumbnail(null)
        let selected = e.target.files[0]
        if (!selected) {
            setThumbnailError('Please select a file.')
            return
        }
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image.')
            return
        }
        if (selected.size > 2097152 * 2) {
            setThumbnailError('Image file size must be less than 4MB.')
            return
        }
        setThumbnailError(null)
        setThumbnail(selected)
    }

    useEffect(() => {
        if (data?.status === 'success') {
            localStorage.setItem('signedInUser', JSON.stringify(data))
            dispatch({ type: 'LOGIN', payload: data })
            navigate('/')
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault()
        postData({ displayName, email, photoURL: url })
    }

    return (
        <div className='edit-container'>
            <Link to={`/${signedInUser._id}`} className='btn'>Go Back</Link>
            <form onSubmit={handleSubmit} className='edit'>
                <h2>Edit your profile</h2>
                <div className='upload-photo'>
                    <span>Upload profile photo:</span>
                    <label htmlFor='avatar'>
                        {url ? <img src={url} /> : signedInUser.photoURL ? <img src={signedInUser.photoURL} /> : <img src={DefaultThumbnail} />}
                    </label>
                    <input type='file' id='avatar' name='avatar' onChange={handleFileChange} />
                    {thumbnailError && <div className='error'>{thumbnailError}</div>}
                    {progress > 0 ? <p className='upload-text'>Image uploaded {Math.round(progress)}%</p> : null}
                    {error && <p className='error'>{error}</p>}
                </div>
                <label>
                    <span>Email:</span>
                    <input
                        required
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    <span>Display name:</span>
                    <input
                        required
                        type='text'
                        onChange={(e) => setDisplayName(e.target.value)}
                        value={displayName}
                    />
                </label>
                {!isLoading ? <button className='btn'>Update</button> : <button className='btn' disabled>loading</button>}
            </form>
        </div>
    )
}

export default Edit