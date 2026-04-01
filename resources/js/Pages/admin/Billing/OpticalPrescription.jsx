import React from 'react';

const OpticalPrescription = () => {
  const data = {
    orderNumber: "OP/MEC/OR/4517",
    customerName: "KRISHNA MURARI RAI",
    orderDate: "17-03-2026",
    deliveryDate: "18-03-2026",
    lensType: "Bifocal",
    prescription: {
      rightEye: {
        dv: { sph: "+0.75", cyl: "+1.75", axis: "180" },
        nv: { sph: "+3.00", cyl: "+1.75", axis: "180" },
        add: "+2.25"
      },
      leftEye: {
        dv: { sph: "0", cyl: "0", axis: "0" },
        nv: { sph: "0", cyl: "0", axis: "0" },
        add: "+2.25"
      }
    },
    billing: {
      total: 900,
      paid: 500,
      balance: 400
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg border border-gray-200 my-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-blue-900">OPTICAL POINT</h1>
          <p className="text-sm text-gray-600 italic">See better than yesterday</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Order #: {data.orderNumber}</p>
          <p>Date: {data.orderDate}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <p className="text-sm uppercase text-gray-500 font-semibold">Customer Name</p>
        <p className="text-xl font-bold">{data.customerName}</p>
      </div>

      {/* Prescription Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2" rowSpan="2">EYE</th>
              <th className="border border-gray-300 p-2" colSpan="3">DISTANCE (DV)</th>
              <th className="border border-gray-300 p-2" colSpan="3">NEAR (NV)</th>
              <th className="border border-gray-300 p-2" rowSpan="2">ADD</th>
            </tr>
            <tr className="text-xs">
              <th className="border border-gray-300 p-1">SPH</th>
              <th className="border border-gray-300 p-1">CYL</th>
              <th className="border border-gray-300 p-1">AXIS</th>
              <th className="border border-gray-300 p-1">SPH</th>
              <th className="border border-gray-300 p-1">CYL</th>
              <th className="border border-gray-300 p-1">AXIS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50 text-sm">RIGHT (OD)</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.dv.sph}</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.dv.cyl}</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.dv.axis}</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.nv.sph}</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.nv.cyl}</td>
              <td className="border border-gray-300 p-2">{data.prescription.rightEye.nv.axis}</td>
              <td className="border border-gray-300 p-2 font-semibold" rowSpan="2">{data.prescription.rightEye.add}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50 text-sm">LEFT (OS)</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.dv.sph}</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.cyl}</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.axis}</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.nv.sph}</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.cyl}</td>
              <td className="border border-gray-300 p-2">{data.prescription.leftEye.axis}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer & Billing */}
      <div className="flex justify-between items-end border-t border-gray-200 pt-6">
        <div>
          <p className="text-sm font-bold">Lens Type: <span className="font-normal">{data.lensType}</span></p>
          <p className="text-sm font-bold mt-1 text-gray-600">Delivery: {data.deliveryDate}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100 min-w-[200px]">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>₹{data.billing.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1 text-green-600 font-medium">
            <span>Paid:</span>
            <span>-₹{data.billing.paid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-1 mt-1 text-red-600">
            <span>Balance:</span>
            <span>₹{data.billing.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpticalPrescription;