// hooks
import { useAuthContext } from '../../hooks/useAuthContext'
// services
import { like as likeApi, unlike as unlikeApi } from '../../services/apiLikes'
// @tanstack/react-query
import { useMutation, useQueryClient } from '@tanstack/react-query'
// styles
import './LikeSection.css'
// assets
import Like from '../../assets/like.svg'
import RedHeart from '../../assets/like-red.svg'
import Comment from '../../assets/comment.svg'
// framer-motion
import { motion } from 'framer-motion'
// format date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns'

const LikeSection = ({ post }) => {
    const { signedInUser } = useAuthContext()
    const queryClient = useQueryClient()

    const { mutate: like } = useMutation({
        mutationFn: () => likeApi(post._id, post.user._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', post._id] }),
                queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })

        }
    })

    const { mutate: unlike } = useMutation({
        mutationFn: () => unlikeApi(post._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', post._id] })
            queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
        }
    })

    return (
        <div>
            {post && (
                <>
                    <div className='icons'>
                        {!post.likes.find(l => l.user === signedInUser._id) && (
                            <motion.img src={Like} alt="like icon" onClick={like} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
                        )}
                        {post.likes.find(l => l.user === signedInUser._id) && (
                            <motion.img src={RedHeart} alt="liked red heart icon" onClick={unlike} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
                        )}
                        <img src={Comment} alt="comment icon" />
                        <p>{formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className='likes'>
                        {post.likes.length === 1 ? <p>{post.likes.length} like</p> : <p>{post.likes.length} likes</p>}
                    </div>
                </>
            )}
        </div>
    )

}

export default LikeSection