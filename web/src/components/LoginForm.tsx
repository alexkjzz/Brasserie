'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const router = useRouter()

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (username === 'admin' && password === 'password') {
    router.push('/dashboard/user')
    }
    else {
        setError('Identifiants incorrects')
    }
}

return (
    <div className="p-6 max-w-sm w-full bg-[var(--celadon)] text-[var(--foreground-light)] shadow-lg rounded-lg">
    <h2 className="text-2xl font- text-center text-[var(--foreground-light)]">Connexion</h2>
    <form onSubmit={handleLogin} className="mt-4 space-y-4">
        <input
        type="text"
        placeholder="Nom d'utilisateur" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-3 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--foreground-light)] focus:outline-none focus:ring-2 focus:ring-[var(--cambridge-blue)]"
        />
        <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--foreground-light)] focus:outline-none focus:ring-2 focus:ring-[var(--cambridge-blue)]"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
        type="submit"
        className="w-full py-3 rounded-md bg-[var(--cambridge-blue)] text-white transition duration-300 hover:bg-[var(--moss-green)] hover:text-white"
        >
        Se connecter
        </button>
    </form>
    </div>
)
}
