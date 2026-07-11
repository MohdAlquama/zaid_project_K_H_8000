import React from 'react'
import BillingForm from './BillingForm'
import StaffLayout from '@/Layouts/StaffLayout'

function CreateBilling({ phoneSettings, deliverySettings }) {
  return (
    <BillingForm
      mode="create"
      phoneSettings={phoneSettings}
      deliverySettings={deliverySettings}
    />
  )
}

export default CreateBilling

CreateBilling.layout = page => <StaffLayout children={page} />
