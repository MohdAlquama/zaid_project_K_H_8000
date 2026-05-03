import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function ItemTable({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mt-4">
      <table className="w-full border border-black text-xs text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2">Item</th>
            <th className="border border-black p-2">Price (₹)</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border border-black p-2 text-left">
                {item.name}
              </td>
              <td className="border border-black p-2">
                {item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="flex justify-end mt-2 text-sm font-semibold">
        Total: ₹ {total}
      </div>
    </div>
  );
}

 function LensTable({ data }) {
  return (
    <div className="mt-3">
      <table className="w-full border border-black text-xs text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2"></th>
            <th className="border border-black p-2">SPH</th>
            <th className="border border-black p-2">CYL</th>
            <th className="border border-black p-2">AXIS</th>
            <th className="border border-black p-2">VA</th>
          </tr>
        </thead>

        <tbody>
          {/* RIGHT EYE */}
          <tr>
            <td className="border border-black p-2 font-semibold">Right</td>
            <td className="border border-black p-2">{data.right.sph}</td>
            <td className="border border-black p-2">{data.right.cyl}</td>
            <td className="border border-black p-2">{data.right.axis}</td>
            <td className="border border-black p-2">{data.right.va}</td>
          </tr>

          {/* LEFT EYE */}
          <tr>
            <td className="border border-black p-2 font-semibold">Left</td>
            <td className="border border-black p-2">{data.left.sph}</td>
            <td className="border border-black p-2">{data.left.cyl}</td>
            <td className="border border-black p-2">{data.left.axis}</td>
            <td className="border border-black p-2">{data.left.va}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function OpticalInvoice() {
  const printRef = useRef();
  const items = [
  { name: "Frame", price: 1200 },
  { name: "Lens (Single Vision)", price: 800 },
  { name: "Coating", price: 300 },
];

const lensData = {
  right: {
    sph: "-1.25",
    cyl: "-0.50",
    axis: "90",
    va: "6/6",
  },
  left: {
    sph: "-1.00",
    cyl: "-0.25",
    axis: "80",
    va: "6/6",
  },
};
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        hr {
          border: 0 !important;
          height: 2px !important;
          background-color: black !important;
          margin: 10px 0 !important;
        }

        * {
          box-sizing: border-box;
        }
      }
        table {
  page-break-inside: avoid;
}
    `,
  });

  return (
    <div className="pt-2 pb-5 px-5 bg-gray-100 min-h-screen">

      {/* PRINT BUTTON */}
      <button
        onClick={handlePrint}
        className="mb-3 bg-blue-600 text-white px-5 py-2 rounded print:hidden"
      >
        Print Invoice
      </button>

      {/* A4 PAGE */}
      <div
        ref={printRef}
        className="bg-white mx-auto pt-3 px-6 pb-6 shadow-md"
        style={{ width: "210mm", minHeight: "297mm" }}
      >

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between -mt-2">

          {/* LEFT: LOGO */}
          <div className="w-1/2 flex items-center">
            <img
              src="/assets/logo1.png"
              alt="logo"
              className="h-32 w-auto object-contain"
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-1/2 text-right text-sm leading-relaxed">
            <p className="font-semibold text-xl">
              Bhairahawa Eye Care & Optical
            </p>

            <p className="mt-1">
              Phone No.: 8052595575, 9648277796
            </p>

            <p className="text-xs mt-1">
              Address: Roadways ke saamne, Mehndawal, District Sant Kabir Nagar
            </p>
          </div>
        </div>

        {/* ===== LINE ===== */}
        <hr />

        {/* ===== DETAILS ROW ===== */}
        <div className="grid grid-cols-5 gap-2 text-xs text-center">

          <div>
            <b>Name</b>
            <p className="mt-1 font-medium">Mohd Alquama</p>
          </div>

          <div>
            <b>Ph. No.</b>
            <p className="mt-1 font-medium">9026226199</p>
          </div>

          <div>
            <b>Date</b>
            <p className="mt-1 font-medium">
              {new Date().toLocaleDateString()}
            </p>
          </div>

          <div>
            <b>Del.</b>
            <p className="mt-1 font-medium">05/05/2026</p>
          </div>

          <div>
            <b>Inv. No.</b>
            <p className="mt-1 font-medium">INV-001</p>
          </div>

        </div>

        <hr />

       <div className="mt-3 break-inside-avoid">
  <LensTable data={lensData} />
</div>

<ItemTable items={items} />

      </div>
    </div>
  );
}

export default OpticalInvoice;