'use client'

import { signIn } from 'next-auth/react'

const LoginButton = () => {
    return <button className="text-slate-200" onClick={() => signIn()}>Login</button>
}


export default LoginButton