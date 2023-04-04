'use client'

import { signOut } from 'next-auth/react'

const LogoutButton = () => {
    return <button className="text-slate-200" onClick={() => signOut({callbackUrl: "https://localhost:3000"}) }>Logout</button>
}


export default LogoutButton