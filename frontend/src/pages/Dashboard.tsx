import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import { queueForSync } from '../utils/db'
import { syncQueuedProduct } from '../utils/sync'

Modal.setAppElement('#root')

type Product = {
  id: number
  name: string
  quantity: number
  location: string
}

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, location: '' })
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('access')

        const fetchProducts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/products/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            setProducts(res.data)
        } catch (err) {
            console.error('Błąd przy pobieraniu produktów:', err)
            navigate('/')
        }
        }

        const handleOnline = async () => {
            console.log('🌐 Połączenie internetowe przywrócone. Synchronizuję...')
            await syncQueuedProduct(token!)
            fetchProducts()
        }

        fetchProducts()

        // Nasłuchiwanie
        window.addEventListener('online', handleOnline)
        return () => window.removeEventListener('online', handleOnline)

    }, [navigate])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('access')
        try {
        const res = await axios.post(
            'http://127.0.0.1:8000/api/products/',
            newProduct,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        )
        setProducts([...products, res.data])
        setNewProduct({ name: '', quantity: 0, location: '' })
        } catch (err) {
        console.error('Błąd przy dodawaniu produktu:', err)
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {

        const token = localStorage.getItem('access')

        if (!newProduct.name || !newProduct.quantity || !newProduct.location) return

        if (!navigator.onLine) {
            await queueForSync(newProduct)
            alert('Saved offline')
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/products/', newProduct, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setProducts([...products, response.data])
            } catch (err) {
                console.error(err)
            }
        }
        setNewProduct({ name: '', quantity: 0, location: '' })
    }

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('access')
        try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
        setProducts(products.filter((p) => p.id !== id))
        } catch (err) {
        console.error('Błąd przy usuwaniu produktu:', err)
        }
    }

    const handleEditSave = async () => {
        if (!editingProduct) return
        const token = localStorage.getItem('access')

        try {
        const res = await axios.put(
            `http://127.0.0.1:8000/api/products/${editingProduct.id}/`,
            editingProduct,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        )
        setProducts(products.map((p) => (p.id === editingProduct.id ? res.data : p)))
        setEditingProduct(null)
        } catch (err) {
        console.error('Błąd przy edytowaniu produktu:', err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        navigate('/')
    }

    return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial' }}>
        <h2>Storage</h2>
        <button onClick={() => handleLogout()} style={{ float: 'right' }}>
            Logout
        </button>
      
        <form onSubmit={handleAddProduct} style={{ marginBottom: '2rem' }}>
            <h3>Add Item</h3>
            <input
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            />
            <input
            placeholder="Quantity"
            type="number"
            value={newProduct.quantity}
            onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })
            }
            required
            />
            <input
            placeholder="Location"
            value={newProduct.location}
            onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
            required
            />
            <button type="submit">Add</button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map((p) => (
            <li
                key={p.id}
                style={{
                background: '#f8f8f8',
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                }}
            >
                <div>
                <strong>{p.name}</strong> – {p.quantity} szt. – {p.location}
                </div>
                <div>
                <button onClick={() => setEditingProduct(p)} style={{ marginRight: '0.5rem' }}>
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(p.id)}
                    style={{ backgroundColor: '#e74c3c', color: 'white' }}
                >
                    Delete
                </button>
                </div>
            </li>
            ))}
        </ul>

        <Modal
            isOpen={!!editingProduct}
            onRequestClose={() => setEditingProduct(null)}
            style={{
            content: {
                maxWidth: '400px',
                margin: 'auto',
                padding: '2rem',
                borderRadius: '10px',
            },
            }}
        >
            <h3>Edit product</h3>
            {editingProduct && (
            <>
                <input
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
                value={editingProduct.location}
                onChange={(e) =>
                    setEditingProduct({ ...editingProduct, location: e.target.value })
                }
                required
                />
                <div style={{ marginTop: '1rem' }}>
                <button onClick={handleEditSave}>Save</button>
                <button
                    onClick={() => setEditingProduct(null)}
                    style={{ marginLeft: '0.5rem' }}
                >
                    Cancel
                </button>
                </div>
            </>
            )}
        </Modal>
        </div>
    )
    }

export default Dashboard
