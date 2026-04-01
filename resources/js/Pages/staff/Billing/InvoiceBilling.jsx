import { Link } from '@inertiajs/react'
import { Button } from "@/components/ui/button"

const formatValue = (value) => {
  const text = `${value ?? ""}`.trim()
  return text !== "" ? text : "-"
}

const formatMoney = (value) => Number(value || 0).toFixed(2)

function InvoiceBilling({ billing, logo_url }) {
  const customerName = billing?.customerName ?? billing?.customer_name
  const customerNumber = billing?.customerNumber ?? billing?.customer_number ?? billing?.mobile_number
  const orderNumber = billing?.orderNumber ?? billing?.order_number
  const orderDate = billing?.orderDate ?? billing?.order_date
  const deliveryDate = billing?.deliveryDate ?? billing?.delivery_date

  return (
    <div className="bg-white p-2">

      {/* ✅ PRINT SETTINGS */}
      <style>{`
        @page {
          size: 80mm auto;
          margin: 0;
        }

        @media print {
          html, body {
            width: 72mm;
            margin: 0;
            padding: 0;
            background: #ffffff !important;
          }

          body * {
            visibility: hidden;
          }

          .invoice-paper, .invoice-paper * {
            visibility: visible;
          }

          .invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 72mm;
            max-width: 72mm;
            box-sizing: border-box;
          }

          .invoice-toolbar {
            display: none !important;
          }
        }
      `}</style>

      {/* ✅ TOOLBAR (WILL NOT PRINT) */}
      <div className="invoice-toolbar flex gap-2 mb-2 print:hidden">
        <Button asChild variant="outline">
          <Link href={route('staff.billing.view')}>Back</Link>
        </Button>

        <Button type="button" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      {/* ✅ BILL CONTENT */}
      <div className="flex justify-center">
        <div
          className="invoice-paper bg-white px-2 py-2 text-[11px]"
          style={{ width: '72mm' }}
        >

          {/* HEADER */}
          <div className="text-center border-b pb-2">
            <img
              src={logo_url}
              alt="Logo"
              className="h-10 w-10 mx-auto object-contain"
            />
            <h1 className="text-xs font-bold">INVOICE</h1>
            <p className="text-[9px] text-gray-500">80mm Print</p>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="py-2 space-y-1">
            <div className="flex justify-between">
              <span>Name</span>
              <span>{formatValue(customerName)}</span>
            </div>

            <div className="flex justify-between">
              <span>Mobile</span>
              <span>{formatValue(customerNumber)}</span>
            </div>

            <div className="flex justify-between">
              <span>Order No</span>
              <span>{formatValue(orderNumber)}</span>
            </div>

            <div className="flex justify-between">
              <span>Order Date</span>
              <span>{formatValue(orderDate)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatValue(deliveryDate)}</span>
            </div>
          </div>

          {/* BILLING */}
          <div className="border-t pt-2 space-y-1">

            <div className="flex justify-between">
              <span>Frames</span>
              <span>Rs {formatMoney(billing?.frame_total)}</span>
            </div>

            <div className="flex justify-between">
              <span>Lenses</span>
              <span>Rs {formatMoney(billing?.lens_total)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>Rs {formatMoney(billing?.discount)}</span>
            </div>

            <div className="flex justify-between">
              <span>Advance</span>
              <span>Rs {formatMoney(billing?.advance_paid)}</span>
            </div>

            <div className="flex justify-between">
              <span>Balance</span>
              <span>Rs {formatMoney(billing?.balance)}</span>
            </div>

            <div className="flex justify-between font-bold border-t pt-1 text-[12px]">
              <span>Total</span>
              <span>Rs {formatMoney(billing?.net_total)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center text-[9px] text-gray-500 mt-2 border-t pt-2">
            <p>Computer Generated Bill</p>
            <p>Thank You 😊</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default InvoiceBilling
