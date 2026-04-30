import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import styles from './EntryDetail.module.css'

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

function formatBytes(n) {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export default function EntryDetail() {
  const { uid } = useParams()
  const [entry, setEntry]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [reflecting, setReflecting] = useState(false)
  const [reflection, setReflection] = useState(null)
  const [reflectErr, setReflectErr] = useState(null)
  const [hint, setHint]             = useState('')

  useEffect(() => {
    setLoading(true)
    api.getEntry(uid)
      .then(setEntry)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [uid])

  async function handleReflect() {
    setReflecting(true)
    setReflection(null)
    setReflectErr(null)
    try {
      const res = await api.reflect([uid], hint)
      setReflection(res.reflection)
    } catch (e) {
      setReflectErr(e.message)
    } finally {
      setReflecting(false)
    }
  }

  if (loading) return (
    <div className={styles.center}>
      <div className={styles.spinner} />
    </div>
  )

  if (error) return (
    <div className={styles.center}>
      <p className={styles.errorText}>⚠ {error}</p>
      <Link to="/" className={styles.back}>← Back to journal</Link>
    </div>
  )

  if (!entry) return null

  const actLabel = entry.activity?.split('.').pop() || '—'

  return (
    <div className={styles.root}>
      <Link to="/" className={styles.back}>← Journal</Link>
      <div className={styles.layout}>
        <div className={styles.left}>
          <header className={styles.entryHeader}>
            <div className={styles.headerTop}>
              <span className={styles.activityBadge}>{actLabel}</span>
              {entry.keep && <span className={styles.star}>★ Starred</span>}
            </div>
            <h1 className={styles.title}>{entry.title || 'Untitled'}</h1>
            <p className={styles.date}>{formatDate(entry.timestamp)}</p>
          </header>

          {entry.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionLabel}>Description</h2>
              <p className={styles.description}>{entry.description}</p>
            </section>
          )}

          {entry.preview_base64 && (
            <section className={styles.section}>
              <h2 className={styles.sectionLabel}>Preview</h2>
              <img
                src={`data:image/png;base64,${entry.preview_base64}`}
                alt="Entry preview"
                className={styles.preview}
              />
            </section>
          )}

          {entry.tags?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionLabel}>Tags</h2>
              <div className={styles.tags}>
                {entry.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.aside}>
          <div className={styles.metaCard}>
            <h2 className={styles.metaTitle}>Metadata</h2>
            <dl className={styles.metaList}>
              <dt>UID</dt><dd className={styles.mono}>{entry.uid}</dd>
              <dt>Activity</dt><dd className={styles.mono}>{entry.activity || '—'}</dd>
              <dt>MIME type</dt><dd className={styles.mono}>{entry.mime_type || '—'}</dd>
              <dt>File size</dt><dd>{formatBytes(entry.filesize)}</dd>
              <dt>Sharing</dt><dd>{entry.share_scope || 'private'}</dd>
            </dl>
          </div>

          <div className={styles.reflectCard}>
            <h2 className={styles.metaTitle}>AI Reflection</h2>
            <p className={styles.reflectHint}>
              Ask the AI to reflect on this journal entry.
            </p>
            <input
              className={styles.hintInput}
              placeholder="Optional focus (e.g. 'focus on loops')"
              value={hint}
              onChange={e => setHint(e.target.value)}
            />
            <button
              className={styles.reflectBtn}
              onClick={handleReflect}
              disabled={reflecting}
            >
              {reflecting
                ? <><span className={styles.btnSpinner} /> Reflecting…</>
                : '◈ Reflect on this entry'
              }
            </button>
            {reflectErr && <p className={styles.reflectError}>⚠ {reflectErr}</p>}
            {reflection && (
              <div className={styles.reflectionResult}>
                <div className={styles.reflectionLabel}>Reflection</div>
                <p className={styles.reflectionText}>{reflection}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}