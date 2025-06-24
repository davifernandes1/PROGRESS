import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FormField, Button } from '../components/ui';
import { AlertTriangle, UserCog } from 'lucide-react';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try { await login(email, password); }
        catch (err) { setError(err.message || 'Falha no login.'); setLoading(false); }
    };

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 font-sans">
            <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-8 shadow-2xl animate-scaleUp md:p-10">
                <div className="text-center">
                    <UserCog size={56} className="mx-auto mb-3 text-blue-600" />
                    <h2 className="text-3xl font-bold tracking-wider text-gray-900">PROGRESS</h2>
                    <p className="mt-1.5 text-sm text-gray-500">Gestão de PDIs</p>
                </div>
                {error && <div className="flex items-start rounded-md border-l-4 border-red-400 bg-red-50 p-4 text-red-700" role="alert"><AlertTriangle size={20} className="mr-3 flex-shrink-0 text-red-500" /><span className="block text-sm sm:inline">{error}</span></div>}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <FormField name="email" type="email" label="Endereço de e-mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required disabled={loading} autoComplete="email" />
                    <FormField name="password" type="password" label="Senha" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" required disabled={loading} autoComplete="current-password" />
                    <Button type="submit" disabled={loading} isLoading={loading} className="w-full py-2.5 text-lg" variant="primary" size="lg">{loading ? 'Entrando...' : 'Entrar'}</Button>
                </form>
            </div>
        </div>
    );
};
