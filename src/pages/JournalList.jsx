// src/pages/JournalList.jsx
import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import EntryCard from '../components/EntryCard'
import styles from './JournalList.module.css'

const LIMIT = 12

export default function JournalList() {
  const [entries, setEntries]   = useState([])
  const [total, setTotal]       = useState(0)
  const [offset, setOffset]     = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Search / filter state
  const [query, setQuery]       = useState('')
  const [activity, setActivity] = useState('')
  const [tag, setTag]           = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 350)
    return () => clearTimeout(t)
  }, [query])

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const hasFilter = debouncedQ || activity || tag
      let data
      if (hasFilter) {
        data = await api.searchEntries({
          query: debouncedQ,
          activity: activity || undefined,
          tags: tag ? [tag] : [],
          limit: LIMIT,
          offset,
        })
      } else {
        data = await api.listEntries({ limit: LIMIT, offset })
      }
      setEntries(data.entries || [])
      setTotal(data.total || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedQ, activity, tag, offset])

  useEffect(() => {
    setOffset(0)
  }, [debouncedQ, activity, tag])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const totalPages = Math.ceil(total / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <div>
      {/* Search bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.search}
            placeholder="Search entries…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clear} onClick={() => setQuery('')}>×</button>
          )}
        </div>

        <input
          className={styles.filter}
          placeholder="Activity bundle id…"
          value={activity}
          onChange={e => setActivity(e.target.value)}
        />

        <input
          className={styles.filter}
          placeholder="Tag…"
          value={tag}
          onChange={e => setTag(e.target.value)}
        />

        {(query || activity || tag) && (
          <button
            className={styles.resetBtn}
            onClick={() => { setQuery(''); setActivity(''); setTag('') }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {loading ? (
          <span className={styles.loadingDots}>Loading<span>...</span></span>
        ) : error ? (
          <span className={styles.errorText}>⚠ {error}</span>
        ) : (
          <span>{total} {total === 1 ? 'entry' : 'entries'}{(query || activity || tag) ? ' found' : ' total'}</span>
        )}
      </div>

      {/* Grid */}
      {!loading && !error && entries.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>◈</p>
          <p>No entries found.</p>
        </div>
      )}

      <div className={styles.grid}>
        {entries.map((entry, i) => (
          <EntryCard
            key={entry.uid}
            entry={entry}
            style={{ animationDelay: `${i * 40}ms` }}
            className="animate-fade-up"
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setOffset(o => Math.max(0, o - LIMIT))}
            disabled={offset === 0}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setOffset(o => o + LIMIT)}
            disabled={offset + LIMIT >= total}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}