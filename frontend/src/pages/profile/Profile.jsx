// hooks
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
// @tanstack/react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// services
import { getUser } from '../../services/apiUsers'
import { follow as followApi, unfollow as unfollowApi } from '../../services/apiFollows'
// components
import UploadForm from '../../components/uploadForm/UploadForm'
import ImageGrid from '../../components/imageGrid/ImageGrid'
import { Link } from 'react-router-dom'
// styles
import './Profile.css'
// assets
import DefaultThumbnail from '../../assets/defaultThumbnail.svg'

const Profile = () => {
    const { signedInUser } = useAuthContext()
    const { _id } = useParams()
    const { logout } = useLogout()
    const queryClient = useQueryClient()

    const  { data: user } = useQuery({
        queryKey: ['user', _id],
        queryFn: () => getUser(_id)
    })

    const {isLoading: isFollowing, mutate: follow } = useMutation({
        mutationFn: () => followApi(_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user', _id]
            })
        }
    })

    const {isLoading: isUnfollowing, mutate: unfollow } = useMutation({
        mutationFn: () => unfollowApi(_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user', _id]
            })
        }
    })

    const handleClick = () => {
        logout()
    }
    
    return (
        <div className='profile'>
            {user && (
                <>
                    <header>
                        {user.photoURL ? <img className='profile-photo' src={user.photoURL} alt='user avatar' /> : <img src={DefaultThumbnail} className='default-thumbnail'/> }
                        <div className='profile-info'>
                            <h3 className='display-name'>{user.displayName}</h3>
                            <div className='stats'>
                                <div>
                                    <h3>{user.posts.length}</h3>
                                    <p>photos</p>
                                </div>
                                <div>
                                    <h3>{user.followers.length}</h3>
                                    <p>followers</p>
                                </div><div>
                                    <h3>{user.following.length}</h3>
                                    <p>following</p>
                                </div>
                            </div>
                            {(signedInUser._id !== user._id) && !user.followers.find(f => f.follower === signedInUser._id) && (
                                <button className='secondary-btn' onClick={follow} disabled={isFollowing}>Follow</button>
                            )}
                            {(signedInUser._id !== user._id) && user.followers.find(f => f.follower === signedInUser._id) && (
                                <button className='secondary-btn' onClick={unfollow} disabled={isUnfollowing}>Unfollow</button>
                            )}
                        </div>
                        {signedInUser._id === user._id && (
                            <div className='buttons'>
                                <Link to='/edit' className='btn'>Edit profile</Link>
                                <button className='secondary-btn' onClick={handleClick}>Logout</button>
                            </div>
                        )}
                    </header>
                    {signedInUser._id === user._id && <UploadForm />}
                    <main>
                        <ImageGrid />
                    </main>
                </>
            )}
        </div>
    )
}

export default Profile