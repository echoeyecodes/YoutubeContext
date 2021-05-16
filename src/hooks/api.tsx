import React from 'react'
import axios from 'axios';

type ERROR_TYPE = {
    code: number,
    message: string
}

const BASE_URL = "https://rich-experience-313911.nw.r.appspot.com"
type API_TYPE = "GET" | "POST" | "PUT"


function getRequestType<T>(type: API_TYPE, route: string, body?: T) {
    if (type == "POST") {
        return axios.post(`${BASE_URL}/${route}`, body)
    } else if (type == "PUT") {
        return axios.put(`${BASE_URL}/${route}`, body)
    }
    else {
        return axios.get(`${BASE_URL}/${route}`)
    }
}


function useApi<T>() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [result, setResult] = React.useState<T | null>(null)
    const isMounted = React.useRef<boolean | null>(null)
    const [error, setError] = React.useState<ERROR_TYPE | null>(null)

    React.useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    })

    function resetState(){
        setResult(null)
        setError(null)
    }

    async function sendRequest<U>(type: API_TYPE, route: string, body?: U) {
        setIsLoading(true)
        setError(null)
        setResult(null)
        try {
            const { data, status } = await getRequestType(type, route, body)
            if (isMounted.current) {
                setResult(data)
            }
        } catch (error) {
            console.log({error})
            if (!error.response) {
                return setError({
                    code: 500,
                    message: 'Could not reach the server',
                });
            }

            if ([409].includes(error.response.status)) {
                setError({
                    code: 400,
                    message: error.response.data,
                });
            } else{
                setError({
                    code: 400,
                    message: "An unknown error has occured",
                });
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false)
            }
        }
}

return { isLoading, result, error, sendRequest, resetState }
}

export default useApi