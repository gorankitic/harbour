// hooks
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
// services
import { createPost } from '../../services/apiPosts'
// @tanstack/react-query
import { useMutation, useQueryClient } from '@tanstack/react-query'
// components
import ProgressBar from '../progressBar/ProgressBar'
// styles, toast
import './UploadForm.css'
import toast from 'react-hot-toast'

const UploadForm = () => {
  const { signedInUser } = useAuthContext()
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [imageURL, setImageURL] = useState('')
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: () => createPost(signedInUser._id, imageURL),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user', signedInUser._id] })
      toast.success('New post created successfully!')
    }
  })

  const handleUpload = (e) => {
    setFile(null)
    let selected = e.target.files[0]
    if (!selected) {
      setError('Please select a file.')
      return
    }
    if (!selected.type.includes('image')) {
      setError('Selected file must be an image.')
      return
    }
    if (selected.size > 4000000) {
      setError('Image file size must be less than 4MB.')
      return
    }
    setError(null)
    setFile(selected)
  }

  useEffect(() => {
    if (imageURL) {
      mutate()
    }
  }, [imageURL])

  return (
    <div className='upload-form'>
      <label className='btn'>
        <span>Add New Post</span>
        <input type="file" onChange={handleUpload} />
      </label>
      <div>
        {error && <div className="error">{error}</div>}
        {file && <ProgressBar file={file} setFile={setFile} setImageURL={setImageURL} />}
      </div>
    </div>
  )
}

export default UploadForm