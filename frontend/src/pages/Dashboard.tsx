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
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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

    const handleDelete = async (id:number) => {
        const token = localStorage.getItem('access')
        try {
            await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setProducts(products.filter((p) => p.id !==id))
        } catch (err) {
            console.error("Delete failure", err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        navigate('/')
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h2>Storage</h2>
            <button onClick={() => handleLogout()} style={{ float: 'right' }}>
            Wyloguj
            </button>
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

        {editingProduct && (
  <form
    onSubmit={async (e) => {
      e.preventDefault()
      const token = localStorage.getItem('access')

      try {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/products/${editingProduct.id}/`,
          {
            name: editingProduct.name,
            quantity: editingProduct.quantity,
            location: editingProduct.location,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setProducts(
          products.map((p) => (p.id === editingProduct.id ? res.data : p))
        )
        setEditingProduct(null)
      } catch (err) {
        console.error('Błąd przy edytowaniu produktu:', err)
      }
    }}
    style={{ marginBottom: '2rem' }}
  >
    <h3>Edytuj produkt</h3>
    <input
      type="text"
      value={editingProduct.name}
      onChange={(e) =>
        setEditingProduct({ ...editingProduct, name: e.target.value })
      }
      required
    />
    <input
      type="number"
      value={editingProduct.quantity}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          quantity: parseInt(e.target.value),
        })
      }
      required
    />
    <input
      type="text"
      value={editingProduct.location}
      onChange={(e) =>
        setEditingProduct({ ...editingProduct, location: e.target.value })
      }
      required
    />
    <button type="submit">Zapisz</button>
    <button
      type="button"
      onClick={() => setEditingProduct(null)}
      style={{ marginLeft: '0.5rem' }}
    >
      Anuluj
    </button>
  </form>
)}

        <ul>
            {products.map((p) => (
                <li key={p.id}>
                    {p.name} - {p.quantity} szt. - {p.location}
                    <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                        marginLeft: '1rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        }}
                    >
                        Usuń
                    </button>
                    <button
                        onClick={() => setEditingProduct(p)}
                        style={{
                            marginLeft: '0.5rem',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Edytuj
                    </button>
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
