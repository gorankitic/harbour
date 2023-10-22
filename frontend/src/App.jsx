// hooks
import { useAuthContext } from './hooks/useAuthContext'
// components
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import Navbar from './components/navbar/Navbar'
// pages
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Timeline from './pages/timeline/Timeline'
import Profile from './pages/profile/Profile'
import Edit from './pages/edit/Edit'
import Notifications from './pages/notifications/Notifications'
import Search from './pages/search/Search'
import Post from './pages/post/PostPage'
// @tanstack/react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// styles
import './App.css'
// Toast
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0
        }
    }
})

const App = () => {
    const { signedInUser } = useAuthContext()

    return (
        <div className='App'>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <BrowserRouter>
                    {signedInUser && <Sidebar />}
                    <div className='container'>
                        {!signedInUser && <Navbar />}
                        <Routes>
                            <Route path='/signup' element={!signedInUser ? <Signup /> : <Navigate to='/' />} />
                            <Route path='/login' element={!signedInUser ? <Login /> : <Navigate to='/' />} />
                            <Route path='/' element={signedInUser ? <Timeline /> : <Navigate to='/login' />} />
                            <Route path='/:_id' element={signedInUser ? <Profile /> : <Navigate to='/login' />} />
                            <Route path='/edit' element={signedInUser ? <Edit /> : <Navigate to='/login' />} />
                            <Route path='/notifications' element={signedInUser ? <Notifications /> : <Navigate to='/login' />} />
                            <Route path='/search' element={signedInUser ? <Search /> : <Navigate to='/login' />} />
                            <Route path='/:_id/posts/:postId' element={signedInUser ? <Post /> : <Navigate to='/login' />} />
                        </Routes>
                    </div>
                </BrowserRouter>

                <Toaster
                    position='top-center'
                    gutter={12}
                    containerStyle={{ margin: '8px' }}
                    toastOptions={{ success: { duration: 3000 }, error: { duration: 5000 }, style: { fontSize: '16px', maxWidth: '500px', padding: '16px 24px', backgroundColor: 'var(--bg-color)' } }} />
            </QueryClientProvider>
        </div>
    )
}

export default App