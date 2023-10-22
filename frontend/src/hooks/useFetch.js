import { useState, useEffect } from 'react'

export const useFetch = (url, method = 'GET') => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [options, setOptions] = useState(null)

    const postData = (postData) => {
        setOptions({
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(postData)
        })
    }

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async (fetchOptions) => {
            setIsLoading(true)
            try {
                const response = await fetch(url, { ...fetchOptions, signal: controller.signal })
                if(!response.ok) throw new Error(response.statusText)

                const data = await response.json()

                setIsLoading(false)
                setData(data)
                setError(null)
            } catch (err) {
                if(err.name === 'AbortError') {
                    console.log('The fetch was aborted.')
                } else {
                    setIsLoading(false)
                    setError('Could not fetch the data.')
                }
            }
        }
        if(method === 'GET') {
            fetchData()
        }
        if((method === 'POST' || method === 'PATCH') && options) {
            fetchData(options)
        }

        return () => controller.abort()
    }, [url, method, options])


    return { data, isLoading, error, postData }
}