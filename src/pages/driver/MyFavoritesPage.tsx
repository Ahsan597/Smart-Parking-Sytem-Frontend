import { Link } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import ErrorAlert from '../../components/ErrorAlert'
import FavoriteButton from '../../components/FavoriteButton'

function MyFavoritesPage() {
  const { favorites, isLoading, error, toggleFavorite } = useFavorites()

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-slate-400">My Favorites</h2>
      <ErrorAlert message={error} />
      {isLoading ? (
        <p className="text-slate-400">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-slate-400">No favorites yet. Star a location to keep it here.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-900 p-4"
            >
              <Link to={`/locations/${favorite.parkingLocationId}`} className="flex-1">
                <p className="font-medium text-white">{favorite.parkingLocation.name}</p>
                <p className="text-sm text-slate-400">
                  {favorite.parkingLocation.address}, {favorite.parkingLocation.city}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {favorite.parkingLocation.pricing
                    ? `Rs ${favorite.parkingLocation.pricing.hourlyRate}/hr`
                    : 'Pricing not set'}
                </p>
              </Link>
              <FavoriteButton isFavorite onToggle={() => toggleFavorite(favorite.parkingLocationId)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyFavoritesPage
