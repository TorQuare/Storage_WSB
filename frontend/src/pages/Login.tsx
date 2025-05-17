import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            })

            localStorage.setItem('access', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)

            navigate('/dashboard')
        } catch (err) {
            setError('Invalid login data')
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '24rem' }}>
            <h2 className="text-center mb-4">Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label className="form-label">Nazwa użytkownika</label>
                <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div className="mb-3">
                <label className="form-label">Hasło</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                Zaloguj
                </button>
            </form>
            </div>
        </div>
)

    /*
    return (
        <div style={{maxWidth: 400, margin: '2rem auto'}}>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User</label>
                    <input 
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Log in</button>
            </form>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    )
    */
}

export default Login
