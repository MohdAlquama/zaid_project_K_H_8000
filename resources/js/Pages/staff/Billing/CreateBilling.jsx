import React from 'react'
import BillingForm from './BillingForm'
import StaffLayout from '@/Layouts/StaffLayout'

function CreateBilling() {
  return <BillingForm mode="create" />
}

export default CreateBilling

CreateBilling.layout = page => <StaffLayout children={page} />
