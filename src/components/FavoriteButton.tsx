import type { MouseEvent } from 'react'

function FavoriteButton({ isFavorite, onToggle }: { isFavorite: boolean; onToggle: () => void }) {
  function handleClick(event: MouseEvent) {
    // Often rendered inside a clickable card — don't let the toggle trigger card navigation.
    event.preventDefault()
    event.stopPropagation()
    onToggle()
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`text-lg transition ${isFavorite ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton
