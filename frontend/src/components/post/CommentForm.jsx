// hooks
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
// @tanstack/react-query
import { useMutation, useQueryClient } from '@tanstack/react-query'
// services
import { createComment as createCommentApi } from '../../services/apiComments'
// styles
import './CommentForm.css'

const CommentForm = ({ post }) => {
    const { signedInUser } = useAuthContext()
    const queryClient = useQueryClient()
    const [newComment, setNewComment] = useState('')

    const { isLoading, mutate: createComment } = useMutation({
        mutationFn: () => createCommentApi(post._id, post.user._id, newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', post._id] })
            queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
            setNewComment('')
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        createComment()
    }

    return (
        <form className='add' onSubmit={handleSubmit}>
            <input type='text' onChange={(e) => setNewComment(e.target.value)} value={newComment} placeholder='Add comment...' autoComplete='off' />
            <button className='btn' disabled={newComment.length === 0 || isLoading}>Post</button>
        </form>
    )
}

export default CommentForm