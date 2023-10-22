// hooks
import { useState } from 'react'
// components
import { Link } from 'react-router-dom'
// styles
import './CommentsList.css'
// format date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns'

const CommentsList = ({ post }) => {
    const [ commentsSlice, setCommentsSlice ] = useState(3)

    const showNextComments = () => {
        setCommentsSlice(prev => prev + 3);
    }

    return (
        <div className='comments'>
            <ul>
                {post && post.comments.slice(0, commentsSlice).map(comment => (
                    <li key={comment._id}>
                        <div className='comment'>
                            <Link to={`/${comment.user._id}`}>{comment.user.displayName}</Link>
                            <p>{comment.content}</p>
                            <p className='date'>{formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true })}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {post.comments.length >= 3 && commentsSlice < post.comments.length && (
                <p onClick={showNextComments} className='extend'>View more comments...</p>
            )}
        </div>
    )
}

export default CommentsList