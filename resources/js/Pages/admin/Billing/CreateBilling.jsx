import AdminLayout from '@/Layouts/AdminLayout'
import BillingForm from './BillingForm'

function CreateBilling() {
  return <BillingForm mode="create" />
}

export default CreateBilling

CreateBilling.layout = page => <AdminLayout children={page} />
