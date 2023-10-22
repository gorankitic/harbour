// hooks
import { useNavigate, useParams } from 'react-router-dom'
// @tanstack/react-query
import { useQuery } from '@tanstack/react-query'
// services
import { getPosts } from '../../services/apiPosts'
// styles
import './ImageGrid.css'
// framer-motion
import { motion } from 'framer-motion'
// Loader
import GridLoader from 'react-spinners/GridLoader'

const override = {
    display: 'block',
    margin: '10rem auto',
}

const ImageGrid = () => {
    const { _id } = useParams()
    const navigate = useNavigate()

    const {isLoading, data: posts, error} = useQuery({
        queryKey: ['posts', _id],
        queryFn: () => getPosts(_id)
    })

    const handleClick = (postId) => {
        navigate(`/${_id}/posts/${postId}`)
    }
    
    if(isLoading) return <GridLoader color={'#daa49a'} loading={isLoading} cssOverride={override} size={20} />

    return (
        <>
            <div className='grid'>
                {posts && posts.map(post => (
                    <motion.div className='wrap' key={post._id} onClick={() => handleClick(post._id)} whileHover={{ opacity: 1 }} layout>
                        <motion.img src={post.imageURL} alt='grid image' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                    </motion.div>
                ))}
            </div>
            {error && <p className='error'>{error}</p>}
        </>
    )
}

export default ImageGrid