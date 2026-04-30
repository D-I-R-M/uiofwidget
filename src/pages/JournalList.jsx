import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import EntryCard from '../components/EntryCard'
import styles from './JournalList.module.css'

const LIMIT = 12

export default function JournalList() {
  const [entries, setEntries] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activity, setActivity] = useState('')
  const [tag, setTag] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')

  useEffect(function() {
    const t = setTimeout(function() { setDebouncedQ(query) }, 350)
    return function() { clearTimeout(t) }
  }, [query])

  const fetchEntries = useCallback(async function() {
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
          offset: offset,
        })
      } else {
        data = await api.listEntries({ limit: LIMIT, offset: offset })
      }
      setEntries(data.entries || [])
      setTotal(data.total || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedQ, activity, tag, offset])

  useEffect(function() {
    setOffset(0)
  }, [debouncedQ, activity, tag])

  useEffect(function() {
    fetchEntries()
  }, [fetchEntries])

  const totalPages = Math.ceil(total / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            className={styles.search}
            placeholder="Search entries"
            value={query}
            onChange={function(e) { setQuery(e.target.value) }}
          />
          {query && (
            <button className={styles.clear} onClick={function() { setQuery('') }}>x</button>
          )}
        </div>

        <input
          className={styles.filter}
          placeholder="Activity bundle id"
          value={activity}
          onChange={function(e) { setActivity(e.target.value) }}
        />

        <input
          className={styles.filter}
          placeholder="Tag"
          value={tag}
          onChange={function(e) { setTag(e.target.value) }}
        />

        {(query || activity || tag) && (
          <button
            className={styles.resetBtn}
            onClick={function() { setQuery(''); setActivity(''); setTag('') }}
          >
            Reset
          </button>
        )}
      </div>

      <div className={styles.statsBar}>
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span className={styles.errorText}>Error: {error}</span>
        ) : (
          <span>{total} {total === 1 ? 'entry' : 'entries'}{(query || activity || tag) ? ' found' : ' total'}</span>
        )}
      </div>

      {!loading && !error && entries.length === 0 && (
        <div className={styles.empty}>
          <p>No entries found.</p>
        </div>
      )}

      <div className={styles.grid}>
        {entries.map(function(entry, i) {
          return (
            <EntryCard
              key={entry.uid}
              entry={entry}
              style={{ animationDelay: (i * 40) + 'ms' }}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={function() { setOffset(function(o) { return Math.max(0, o - LIMIT) }) }}
            disabled={offset === 0}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={function() { setOffset(function(o) { return o + LIMIT }) }}
            disabled={offset + LIMIT >= total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
