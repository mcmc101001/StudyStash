'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

const LogoutButton = () => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    return (
        <Button 
            variant='ghost'
            onClick={
                async() => {
                    setIsSigningOut(true);
                    try {
                        await signOut({callbackUrl: "https://localhost:3000"});
                    } catch (error) {
                        toast.error('There was an error signing out');
                    } finally {
                        setIsSigningOut(false);
                    }
                }
            }
        >Logout
            {isSigningOut ? <Loader2 className='animate-spin h-4 w-4' /> : <LogOut className='h-6 w-6' />}
        </Button>
    )
}


export default LogoutButton