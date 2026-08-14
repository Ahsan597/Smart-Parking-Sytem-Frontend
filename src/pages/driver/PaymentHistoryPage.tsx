import { useFetch } from '../../hooks/useFetch'
import { paymentService } from '../../services/paymentService'
import { formatDateTime } from '../../utils/bookingTime'
import ErrorAlert from '../../components/ErrorAlert'

function PaymentHistoryPage() {
  const { data: payments, isLoading, error } = useFetch(() => paymentService.getAll(), [])

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-slate-400">Payment History</h2>
      <ErrorAlert message={error} />
      {isLoading ? (
        <p className="text-slate-400">Loading payments...</p>
      ) : !payments || payments.length === 0 ? (
        <p className="text-slate-400">No payments yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Location / Slot</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-navy-700">
                  <td className="px-4 py-3 text-white">
                    {payment.booking.slot.floor.parkingLocation.name}
                    <span className="text-slate-400"> · {payment.booking.slot.slotCode}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-white">Rs {payment.amount}</td>
                  <td className="px-4 py-3 text-slate-300">{payment.paymentMethod}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {payment.paidAt ? formatDateTime(payment.paidAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentHistoryPage
