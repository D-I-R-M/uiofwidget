import { Link } from 'react-router-dom'
import styles from './EntryCard.module.css'

const ACTIVITY_COLORS = {
  'org.sugarlabs.TurtleArt': '#2d6a4f',
  'org.sugarlabs.MusicBlocks': '#6b3fa0',
  'org.laptop.Calculate': '#c84b2f',
  'org.laptop.Write': '#1a6b8a',
  'org.laptop.Browse': '#8a6b1a',
}

const ACTIVITY_LABELS = {
  'org.sugarlabs.TurtleArt': 'TurtleArt',
  'org.sugarlabs.MusicBlocks': 'MusicBlocks',
  'org.laptop.Calculate': 'Calculate',
  'org.laptop.Write': 'Write',
  'org.laptop.Browse': 'Browse',
}

function activityColor(id) {
  return ACTIVITY_COLORS[id] || '#555'
}

function activityLabel(id) {
  return ACTIVITY_LABELS[id] || id.split('.').pop()
}

function formatDate(ts) {
  if (!ts) return 'Unknown date'
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function EntryCard({ entry, style }) {
  return (
    <Link to={'/entries/' + entry.uid} className={styles.card} style={style}>
      <div className={styles.top}>
        <span
          className={styles.activity}
          style={{
            background: activityColor(entry.activity) + '18',
            color: activityColor(entry.activity)
          }}
        >
          {activityLabel(entry.activity)}
        </span>
        {entry.keep && <span className={styles.star}>Starred</span>}
      </div>

      <h2 className={styles.title}>{entry.title || 'Untitled'}</h2>

      <div className={styles.meta}>
        <span className={styles.date}>{formatDate(entry.timestamp)}</span>
        {entry.mime_type && (
          <span className={styles.mime}>{entry.mime_type.split('/')[1]}</span>
        )}
      </div>

      {entry.tags && entry.tags.length > 0 && (
        <div className={styles.tags}>
          {entry.tags.map(function(t) {
            return <span key={t} className={styles.tag}>{t}</span>
          })}
        </div>
      )}

      <span className={styles.arrow}>View</span>
    </Link>
  )
}
