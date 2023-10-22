// components
import { Link } from 'react-router-dom'
// styles
import './Header.css'

const Header = ({ user }) => {
    
    return (
        <div className='header'>
            <img src={user.photoURL} className='profile-photo' alt="post header user image" />
            <Link to={`/${user._id}`}>{user.displayName}</Link>
        </div>
    )
}

export default Header