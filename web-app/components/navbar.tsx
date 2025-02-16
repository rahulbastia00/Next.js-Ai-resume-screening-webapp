"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { FileText, BarChart3, LogIn } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/upload", label: "Upload Resume", icon: FileText },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/login", label: "Login", icon: LogIn },
  ]

  return (
    <motion.nav 
      className="border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-xl mr-6">
          AI Resume Matcher
        </Link>
        
        <div className="flex items-center space-x-4 flex-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              variant={pathname === href ? "default" : "ghost"}
              asChild
            >
              <Link href={href} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
        
        <ModeToggle />
      </div>
    </motion.nav>
  )
}