import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await axios.post('http://127.0.0.1:8000/auth/users/', {
                username,
                password,
            })
            {/* Dodać obługę kodu 400 - złe hasło */}
            navigate('/')
        } catch (err: any) {
            setError('Cannot create account')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Rejestracja</h2>
            <form onSubmit={handleRegister}>
                <div>
                <label>Nazwa użytkownika:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div>
                <label>Hasło:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Zarejestruj się</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default Register
