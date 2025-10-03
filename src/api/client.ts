import axios from 'axios'

const API_BASE_URL = 'http://109.73.206.144:6969'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    params: {
        key: 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
    }
})

export default apiClient