// hooks
import { useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
// components
import { Link } from 'react-router-dom'
// @tanstack/react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// services
import { getNotifications, makeNotificationsRead } from '../../services/apiNotifications'
// styles, loader
import './Notifications.css'
import GridLoader from 'react-spinners/GridLoader'
// format date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns'

const override = {
    display: 'block',
    margin: '10rem auto',
}

const Notifications = () => {
    const { signedInUser } = useAuthContext()
    const queryClient = useQueryClient()

    const { isLoading, data } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(signedInUser._id),
    })

    const { mutate: readNotifications } = useMutation({
        mutationFn: () => makeNotificationsRead(signedInUser._id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications']
            })
        }
    })

    useEffect(() => {
        if (data) {
            readNotifications()
        }
    }, [])

    if (isLoading) return <GridLoader color={'#daa49a'} loading={isLoading} cssOverride={override} size={20} />

    return (
        <div className='notifications'>
            <Link to='/' className='btn'>Go Back</Link>
            <h1>Notifications</h1>
            {data.notifications && data.notifications.map(notification => (
                <div className='notification' key={notification.id}>
                    <img src={notification.sender.photoURL} alt="user thumbnail" className='thumbnail' />
                    <Link to={`/${notification.sender._id}`} className='name'>{notification.sender.displayName}</Link>
                    {notification.content === 'liked your photo.' ? <span>liked your <Link className='photo-notification' to={`/${signedInUser._id}/posts/${notification.post}`}>photo.</Link></span> : ""}
                    {notification.content === 'commented on your photo.' ? <span>commented on your <Link className='photo-notification' to={`/${signedInUser._id}/posts/${notification.post}`}>photo.</Link></span> : ""}
                    {notification.content === 'started following you.' ? <span>started following you.</span> : ""}
                    <p className={'date'}>{formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}</p>
                </div>
            ))}
        </div>
    )
}

export default Notifications