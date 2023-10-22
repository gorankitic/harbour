// hooks
import { useAuthContext } from '../../hooks/useAuthContext'
// components
import Post from '../../components/post/Post'
// services
import { getTimelinePosts } from '../../services/apiPosts'
// @tanstack/react-query
import { useQuery } from '@tanstack/react-query'
// styles
import './Timeline.css'
// Loader
import GridLoader from 'react-spinners/GridLoader'

const override = {
    display: 'block',
    margin: '10rem auto',
}

const Timeline = () => {
    const { signedInUser } = useAuthContext()
    
    const {isLoading, data: timelinePosts, error} = useQuery({
        queryKey: ['timelinePosts'],
        queryFn: () => getTimelinePosts(signedInUser._id)
    })

    if(isLoading) return <GridLoader color={'#daa49a'} loading={isLoading} cssOverride={override} size={20} />

    return (
        <>
            {!isLoading && (
                <div className='timeline'>
                    {timelinePosts && timelinePosts.map(post => (
                        <div key={post.id}>
                            <Post post={post} />
                        </div>
                    ))}
                </div>
            )}
            {error && <p className='error'>{error}</p>}
        </>
    )
}

export default Timeline