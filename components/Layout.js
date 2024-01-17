import Nav from "@/components/Nav";
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import Link from "next/link";
import { useState } from "react";


export default function Layout({ children }) {
    const [showNav, setShowNav] = useState(false)
    const session = useSession()
    if (typeof window !== "undefined") {
        if (session.status === "unauthenticated") {
            window.location.href = "/login"
        }
        
    }
    return (
        <div>
            <div className="bg-blue-900 text-white p-2 flex md:hidden">

                <button className="z-50" onClick={() => setShowNav(!showNav)}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>

                </button>
                <div className="top-0 float-right"><Link href={'/admin'}>
                    <img src="/logo-white.svg" alt="DailyMart" style={{ width: "80px" }} />
                </Link>
                </div>
            </div>
            <div className=" bg-blue-900 min-h-screen flex" >
                <Nav show={showNav} />
                <div className="bg-white flex-grow p-6 w-5/6">
                    {children}
                </div>
            </div>
        </div>
    )
}
