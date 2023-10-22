// hooks
import { useAuthContext } from '../../hooks/useAuthContext'
// components
import { Link } from 'react-router-dom'
// styles
import './Navbar.css'
// assets
import Anchor from '../../assets/anchor.svg'

const Navbar = () => {
    const { signedInUser } = useAuthContext()  

    return (
        <nav className='navbar'>
            <ul>
                <li className='logo'>
                    <img src={Anchor} alt='Harbour logo' />
                    <Link to='/'>Harbour</Link>
                </li>  
                {!signedInUser && 
                    <div className='links'>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/signup'>Signup</Link></li>
                    </div>
                }
            </ul>
        </nav>
    )
}

export default Navbar