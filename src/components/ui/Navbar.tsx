'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./button"
import { MessageSquare } from "lucide-react"

const Navbar = () => {
    const { data: session } = useSession()
    const user = session?.user as User

    return (
        <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-purple-400 transition-all duration-200">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    <span>Mystery Message</span>
                </Link>

                <div className="flex items-center gap-4">
                    {
                        session ? (
                            <>
                                <span className="text-slate-300 text-sm font-medium mr-1 hidden sm:inline-block">
                                    Welcome, <span className="text-purple-400 font-semibold">{user?.username || user?.email}</span>
                                </span>
                                <Button 
                                    onClick={() => signOut()} 
                                    variant="outline"
                                    className="h-9 px-4 rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href='/sign-in'>
                                <Button className="h-9 px-5 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md transition-all cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar
