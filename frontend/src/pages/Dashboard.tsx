import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface Product {
    id: number
    name: string
    quantity: number
    location: string
}

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [location, setLocation] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const fetchProducts = async () => {
        const token = localStorage.getItem('access')
        if (!token) {
            navigate('/')
            return
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setProducts(response.data)
        } catch (err) {
            setError('Loading error. Are you still logged?')
            if ((err as any).response?.status === 401) {
                navigate('/')
            }
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('access')
        if (!token) return

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/products/',
                { name, quantity, location },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }  
            )
            setName('')
            setQuantity(1)
            setLocation('')
            fetchProducts()
        } catch (err) {
            setError('Error due to append')
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h2>Storage</h2>

            <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
            {products.map((p) => (
                <li key={p.id}>
                    {p.name} - {p.quantity} szt. - {p.location}
                </li>
            ))}
        </ul>

        </div>
    )

}

const Dashboard2 = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('access')
            if (!token) {
                navigate('/')
                return
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setProducts(response.data)
            } catch (err) {
                setError('Loading error. Are you still logged?')
                if ((err as any).response?.status === 401) {
                    navigate('/')
                }
            }
        }
        fetchProducts()
    }, [navigate])

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h2>Storage</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        {p.name} - {p.quantity} szt.
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
