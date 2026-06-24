import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface SearchFieldProps {
  className?: string
  id?: string
}

export function SearchField({ className = '', id = 'header-search' }: SearchFieldProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      className={`flex min-w-0 flex-1 md:mx-auto md:max-w-[22rem] ${className}`.trim()}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor={id} className="w-full min-w-0">
        <span className="flex w-full items-center gap-2 rounded-full border border-[#44403c] bg-[#292524] px-3 py-2 text-header-text md:px-3.5 md:py-2.5">
          <Search size={18} className="shrink-0 text-[#a8a29e]" aria-hidden />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search gear, brands, categories…"
            className="w-full min-w-0 border-0 bg-transparent text-header-text outline-none placeholder:text-[#a8a29e]"
          />
        </span>
      </label>
    </form>
  )
}
