import AdminLayout from '@/Layouts/AdminLayout'
import BillingForm from './BillingForm'

function EditBilling({ billing, phoneSettings }) {
  return <BillingForm mode="edit" billing={billing} phoneSettings={phoneSettings} />
}

export default EditBilling

EditBilling.layout = page => <AdminLayout children={page} />
