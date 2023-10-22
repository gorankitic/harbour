// components
import Header from './Header'
import LikeSection from './LikeSection'
import CommentsList from './CommentsList'
import CommentForm from './CommentForm'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// styles
import './Post.css'

const Post = ({ post }) => {
    
    return (
        <div className='post'>
            <Header user={post.user}/>
            <LazyLoadImage src={post.imageURL} alt='post image' className='image' />
            <LikeSection post={post} />
            <CommentsList post={post} />
            <CommentForm post={post} />
        </div>
    )
}

export default Post