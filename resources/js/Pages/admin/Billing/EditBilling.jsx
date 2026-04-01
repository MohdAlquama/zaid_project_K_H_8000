import AdminLayout from '@/Layouts/AdminLayout'
import BillingForm from './BillingForm'

function EditBilling({ billing }) {
  return <BillingForm mode="edit" billing={billing} />
}

export default EditBilling

EditBilling.layout = page => <AdminLayout children={page} />
