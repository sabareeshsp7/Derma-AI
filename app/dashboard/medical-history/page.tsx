"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MedicalHistoryPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard/under-development')
  }, [router])
  
  return null
}
