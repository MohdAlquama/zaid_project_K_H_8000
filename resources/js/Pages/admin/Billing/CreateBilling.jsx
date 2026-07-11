import AdminLayout from '@/Layouts/AdminLayout'
import BillingForm from './BillingForm'

function CreateBilling({ phoneSettings }) {
  return <BillingForm mode="create" phoneSettings={phoneSettings} />
}

export default CreateBilling

CreateBilling.layout = page => <AdminLayout children={page} />
