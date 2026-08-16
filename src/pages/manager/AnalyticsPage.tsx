import { useFetch } from '../../hooks/useFetch'
import { locationService } from '../../services/locationService'
import AnalyticsDashboard from '../../components/AnalyticsDashboard'

function AnalyticsPage() {
  const { data: locations } = useFetch(() => locationService.getMine(), [])

  return <AnalyticsDashboard locationOptions={locations ?? []} />
}

export default AnalyticsPage
