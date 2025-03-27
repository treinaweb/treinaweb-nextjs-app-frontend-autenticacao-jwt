'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const emailValue = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;
    
    startTransition(async () => {
      try {
        const result = await login(emailValue, passwordValue);
        
        if (result.error) {
          setError(result.error);
        } else {
          router.push('/');
        }
      } catch (err) {
        setError('Erro inesperado ao fazer login');
        console.error(err);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.textCenter}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Entre com suas credenciais</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>Erro</p>
            <p>{error}</p>
          </div>
        )}

        <form action={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isPending} className={styles.submitBtn}>
            {isPending ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
