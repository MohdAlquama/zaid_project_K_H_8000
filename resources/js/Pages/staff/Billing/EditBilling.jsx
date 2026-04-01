import StaffLayout from '@/Layouts/StaffLayout'
import BillingForm from './BillingForm'

function EditBilling({ billing }) {
  return <BillingForm mode="edit" billing={billing} />
}

export default EditBilling

EditBilling.layout = page => <StaffLayout children={page} />
