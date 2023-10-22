// hooks
import { useAuthContext } from '../../hooks/useAuthContext'
// components
import { NavLink, Link } from 'react-router-dom'
// styles
import './Sidebar.css'
// assets
import Timeline from '../../assets/timeline.svg'
import Notification from '../../assets/notifications.svg'
import Search from '../../assets/search.svg'
import Profile from '../../assets/profile.svg'
import Anchor from '../../assets/anchor.svg'
import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../../services/apiNotifications'


const Sidebar = () => {
    const { signedInUser } = useAuthContext()

    const { isLoading, data } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(signedInUser._id),
    })

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className='logo'>
                    <img src={Anchor} alt='Harbour logo' />
                    <Link to='/'>Harbour</Link>
                </div>
                {signedInUser && (
                    <div className="user">
                        {signedInUser.photoURL && <img className='avatar' src={signedInUser.photoURL} alt='signedInUser avatar' />}
                        <p className='displayName'>{signedInUser.displayName}</p>
                    </div>
                )}
                <nav className="links">
                    <ul>
                        <li>
                            <NavLink to="/">
                                <img src={Timeline} alt="timeline icon" />
                                <span>Timeline</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/notifications">
                                <img src={Notification} alt="notification icon" />
                                <span>Notifications</span>
                                {data && data.unreadNotificationsLength > 0 && <span className='notification-length'>{`${data.unreadNotificationsLength}`}</span>}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/search">
                                <img src={Search} alt="search icon" />
                                <span>Search</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`${signedInUser._id}`}>
                                <img src={Profile} alt="profile page icon" />
                                <span>Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar