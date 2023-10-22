// hooks
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
// components
import { Link } from 'react-router-dom'
import Post from '../../components/post/Post'
// services
import { deletePost, getPost } from '../../services/apiPosts'
// @tanstack/react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// styles, loader, toast
import './PostPage.css'
import GridLoader from 'react-spinners/GridLoader'
import toast from 'react-hot-toast'

const override = {
    display: 'block',
    margin: '10rem auto',
}

const PostPage = () => {
    const { signedInUser } = useAuthContext()
    const { _id, postId } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {isLoading, data: post, error} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPost(_id, postId),
    })

    const {isLoading: isDeleting, mutate} = useMutation({
        mutationFn: () => deletePost(signedInUser._id, postId, post.imageURL),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts']
            }),
            queryClient.removeQueries({ queryKey: ['post', postId] })
            toast.success('Post is deleted successfully!')
            navigate(`/${signedInUser._id}`)
        }
    })

    if(isLoading) return <GridLoader color={'#daa49a'} loading={isLoading} cssOverride={override} size={20} />

    return (
        <div className='post-page'>
            <div className='action-btn'>
                <Link to={`/${_id}`} className='btn'>Go Back</Link>
                {signedInUser._id === _id && <button className='secondary-btn' onClick={mutate} disabled={isDeleting}>Delete</button>}
            </div>
            
            <Post post={post} />
            
            {error && <p className='error'>{error}</p>}
        </div>
    )
}

export default PostPage