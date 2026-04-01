import React from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
const orderData = {
  orderNo: "OP/MEC/OR/4517",
  orderDate: "17-03-2026",
  deliveryDate: "18-03-2026",
  customerName: "Krishna Murari Rai",
  customerNumber: "+91 9876543210",
  products: [
    { sl: 1, name: "Frame", code: "ULCR399-334681" },
    { sl: 2, name: "Lens – CR HC · KT 1.56", code: "SYS20546 – Optical Point" },
  ],
  prescription: {
    rightEye: {
      DV:  { sph: "+0.75", cyl: "+1.75", axis: "180", va: "—" },
      NV:  { sph: "+3.00", cyl: "+1.75", axis: "180", va: "—" },
      ADD: { sph: "+2.25", cyl: "—",     axis: "—",   va: "—" },
    },
    leftEye: {
      DV:  { sph: "—", cyl: "0", axis: "0", va: "—" },
      NV:  { sph: "—", cyl: "—", axis: "—", va: "—" },
      ADD: { sph: "—", cyl: "—", axis: "—", va: "—" },
    },
  },
  lensType: "Bifocal",
  payment: { advance: 500, balance: 400, total: 900 },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const Header = () => (
  <div className="relative flex items-center justify-between bg-white px-8 py-5 border-b border-gray-200">
    {/* Gold accent line at bottom */}
    <div
      className="absolute bottom-0 left-0 right-0 h-1"
      style={{ background: "linear-gradient(90deg, #c8922a, #e8b84b, #c8922a)" }}
    />
    {/* Logo */}
    <img
      src="/assets/logo.png"
      alt="Bhairahawa Eye Care Logo"
      className="object-contain flex-shrink-0"
      style={{ width: 220, height: 100 }}
    />
    {/* Contact info */}
    <div className="text-right text-gray-500 leading-relaxed" style={{ fontSize: 9.5 }}>
      <strong className="block text-gray-900 font-semibold mb-0.5" style={{ fontSize: 11 }}>
        Contact &amp; Location
      </strong>
      Jaishankar Building, 2/176, Opp. Shiv Murti<br />
      Sector 2, Vikas Nagar, Lucknow – 226022<br />
      📞 +91 8400715572<br />
      <a href="https://drasthaeyecareclinic.com" className="no-underline" style={{ color: "#0a6b72" }}>
        drasthaeyecareclinic.com
      </a>
    </div>
  </div>
);

const FormBanner = ({ orderNo, orderDate, deliveryDate }) => (
  <div className="flex items-center justify-between px-8 py-2.5" style={{ background: "#1a1a2e" }}>
    <span
      className="text-white uppercase tracking-widest"
      style={{ fontFamily: "Georgia, serif", fontSize: 14, letterSpacing: "1.5px" }}
    >
      ✦ Order Form
    </span>
    <div className="flex gap-6">
      {[
        { label: "Order No.",     value: orderNo },
        { label: "Order Date",    value: orderDate },
        { label: "Delivery Date", value: deliveryDate },
      ].map(({ label, value }) => (
        <div className="text-right" key={label}>
          <div className="uppercase tracking-widest" style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{label}</div>
          <div className="font-semibold" style={{ fontSize: 11, color: "#a8e6ea" }}>{value}</div>
        </div>
      ))}
    </div>
  </div>
);

const CustomerStrip = ({ name, gst }) => (
  <div
    className="grid grid-cols-2 gap-3 mb-5 rounded-lg px-5 py-3.5 border-l-4"
    style={{ background: "#e0f4f5", borderColor: "#0a6b72" }}
  >
    <div>
      <div className="uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontSize: 8.5 }}>Customer Name</div>
      <div className="font-semibold text-gray-900" style={{ fontSize: 13 }}>{name}</div>
    </div>
    <div>
      <div className="uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontSize: 8.5 }}>GST No.</div>
      <div className="font-semibold text-gray-500" style={{ fontSize: 11 }}>{gst}</div>
    </div>
  </div>
);

const SectionHeading = ({ children }) => (
  <div className="flex items-center gap-2 mb-2 font-semibold uppercase tracking-widest" style={{ fontSize: 9, color: "#0a6b72" }}>
    {children}
    <div className="flex-1 h-px" style={{ background: "#e0f4f5" }} />
  </div>
);

const ProductTable = ({ products }) => (
  <>
    <SectionHeading>Product Details</SectionHeading>
    <table className="w-full border-collapse mb-5" style={{ fontSize: 11.5 }}>
      <thead>
        <tr style={{ background: "#0a6b72", color: "#fff" }}>
          <th className="py-2 px-2.5 text-left font-medium w-10" style={{ fontSize: 10 }}>Sl.</th>
          <th className="py-2 px-2.5 text-left font-medium" style={{ fontSize: 10 }}>Product Description</th>
          <th className="py-2 px-2.5 text-right font-medium" style={{ fontSize: 10 }}>Code</th>
        </tr>
      </thead>
      <tbody>
        {products.map(({ sl, name, code }, i) => (
          <tr key={sl} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fc" }}>
            <td className="py-2 px-2.5 border-b border-gray-200 font-bold" style={{ color: "#0a6b72" }}>{sl}</td>
            <td className="py-2 px-2.5 border-b border-gray-200 text-gray-900"><strong>{name}</strong></td>
            <td className="py-2 px-2.5 border-b border-gray-200 text-right text-gray-500" style={{ fontSize: 9 }}>{code}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

const RxRow = ({ label, re, le }) => (
  <tr>
    <td
      className="px-2.5 py-1.5 text-left font-semibold border border-gray-200"
      style={{ fontSize: 9.5, color: "#0a6b72", background: "#eef6f7" }}
    >
      {label}
    </td>
    {[re.sph, re.cyl, re.axis, re.va, le.sph, le.cyl, le.axis, le.va].map((v, i) => (
      <td key={i} className="px-2.5 py-1.5 text-center font-medium border border-gray-200 text-gray-900">{v}</td>
    ))}
  </tr>
);

const PrescriptionTable = ({ prescription, lensType }) => {
  const { rightEye: re, leftEye: le } = prescription;
  return (
    <>
      <SectionHeading>Prescription / Lens Details</SectionHeading>
      <div className="rounded-lg p-3.5 mb-5 border border-gray-200" style={{ background: "#f8f9fc" }}>
        <table className="w-full border-collapse" style={{ fontSize: 10.5 }}>
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="px-2.5 py-1.5 text-left font-medium border border-gray-200"
                style={{ width: 80, background: "#1a1a2e", color: "rgba(255,255,255,0.85)", fontSize: 9 }}
              >
                Vision
              </th>
              <th colSpan={4} className="px-2.5 py-1.5 text-center font-semibold border border-gray-200"
                style={{ background: "#0a6b72", color: "#fff", fontSize: 10 }}>✔ Right Eye (OD)</th>
              <th colSpan={4} className="px-2.5 py-1.5 text-center font-semibold border border-gray-200"
                style={{ background: "#0a6b72", color: "#fff", fontSize: 10 }}>✔ Left Eye (OS)</th>
            </tr>
            <tr>
              {["SPH","CYL","AXIS","VA","SPH","CYL","AXIS","VA"].map((h, i) => (
                <th key={i} className="px-2.5 py-1.5 text-center font-medium border border-gray-200"
                  style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.85)", fontSize: 9 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["DV","NV","ADD"].map((key) => (
              <RxRow key={key} label={key} re={re[key]} le={le[key]} />
            ))}
          </tbody>
        </table>
        <span
          className="inline-block text-white font-semibold rounded-full px-3 py-0.5 mt-2"
          style={{ background: "#0a6b72", fontSize: 9.5 }}
        >
          ✔ {lensType}
        </span>
      </div>
    </>
  );
};

const PaymentSection = ({ payment }) => (
  <div className="flex gap-5 mb-5 items-start">
    {/* Payment summary */}
    <div className="flex-1 rounded-xl px-5 py-4 text-white" style={{ background: "#1a1a2e" }}>
      <div className="uppercase tracking-widest mb-2.5" style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>
        Payment Summary
      </div>
      <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", fontSize: 11.5 }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10.5 }}>Advance Paid</span>
        <span className="font-semibold" style={{ color: "#a8e6ea" }}>Rs {payment.advance}.00</span>
      </div>
      <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", fontSize: 11.5 }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10.5 }}>Balance Payable</span>
        <span className="font-semibold" style={{ color: "#f8c56d" }}>Rs {payment.balance}.00</span>
      </div>
      <div className="flex justify-between items-center pt-2 mt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        <span className="font-semibold" style={{ color: "#a8e6ea", fontSize: 11 }}>Net Total Amount</span>
        <span className="font-bold" style={{ color: "#c8922a", fontSize: 15 }}>Rs {payment.total}.00</span>
      </div>
    </div>

    {/* Notes */}
    <div className="flex-1 rounded-xl px-4 py-3.5 border-2 border-dashed border-gray-200 text-gray-500" style={{ fontSize: 10.5 }}>
      <h4 className="uppercase tracking-widest font-semibold mb-2" style={{ fontSize: 9, color: "#0a6b72" }}>
        Terms &amp; Care Instructions
      </h4>
      <ul className="pl-3.5 list-disc space-y-1 leading-relaxed">
        <li>Lenses are non-returnable once dispensed.</li>
        <li>Frames carry a 6-month manufacturer warranty.</li>
        <li>Please carry this order form at time of delivery.</li>
        <li>Clean lenses with the provided microfibre cloth only.</li>
        <li>Avoid exposure to extreme heat or chemical solvents.</li>
      </ul>
    </div>
  </div>
);

const Signatures = () => (
  <div className="flex justify-between items-end mb-5 pt-2.5">
    {["Customer Signature", "For Dr. Astha Eye Care Clinic"].map((label) => (
      <div className="text-center" key={label}>
        <div className="mx-auto mb-1 border-b-2 border-gray-900" style={{ width: 120, height: 28 }} />
        <div className="uppercase tracking-widest text-gray-500" style={{ fontSize: 9 }}>{label}</div>
      </div>
    ))}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OpticalBill() {
  const {
    orderNo, orderDate, deliveryDate,
    customerName,customerNumber , products,
    prescription, lensType, payment,
  } = orderData;

  return (
    <div
      className="min-h-screen flex justify-center items-start py-8"
      style={{ background: "#dde4ea", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* A4 page */}
      <div
        className="relative flex flex-col bg-white overflow-hidden"
        style={{ width: "210mm", minHeight: "297mm", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        {/* Watermark */}
        <div
          className="absolute pointer-events-none select-none font-bold tracking-widest whitespace-nowrap"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%) rotate(-35deg)",
            fontFamily: "Georgia, serif",
            fontSize: 72,
            color: "rgba(10,107,114,0.06)",
            zIndex: 0,
          }}
        >
          DEMO
        </div>

        <Header />
        <FormBanner orderNo={orderNo} orderDate={orderDate} deliveryDate={deliveryDate} />

        <div className="px-8 py-5 flex-1" style={{ position: "relative", zIndex: 1 }}>
          <CustomerStrip name={customerName} customerNumber={customerNumber} />
                    <PrescriptionTable prescription={prescription} lensType={lensType} />

          <ProductTable products={products} />
          <PaymentSection payment={payment} />
          <Signatures />
        </div>
      </div>
    </div>
  );
}