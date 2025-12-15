"use client"

import { useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/board/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
      >
        검색
      </button>
    </form>
  )
}
