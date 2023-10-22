// hooks
import { useEffect } from 'react';
import { useStorage } from '../../hooks/useStorage'
// framer-motion
import { motion } from 'framer-motion' 
// styles
import './ProgressBar.css'

const ProgressBar = ({ file, setFile, setImageURL }) => {
    const { url, progress } = useStorage(file)
    
    useEffect(() => {
        if(url) {
            setFile(null)
            setImageURL(url)
        }
    }, [url, setFile])

    return (
        <motion.div 
            className='progress-bar' 
            style={{ width: progress+'%' }}
            initial={{ width: 0 }}    
            animate={{ width: progress+'%' }}
        >
        </motion.div>
    )
}

export default ProgressBar