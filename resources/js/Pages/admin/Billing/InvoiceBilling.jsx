import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const terms = [
  "We are not responsible if the glasses are not collected within one month.",
  "50% advance payment is mandatory at the time of placing the order.",
  "Orders will be treated as cancelled if advance payment is not made.",
];

const logoSrc = "/assets/logo1.png";

const formatValue = (value) => {
  const text = `${value ?? ""}`.trim();
  return text !== "" ? text : "-";
};

const formatMoney = (value) => Number(value || 0).toFixed(2);

const hasAmount = (value) => Number(value || 0) > 0;

const formatDate = (value) => {
  const text = `${value ?? ""}`.trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
};

function DetailBox({ label, value }) {
  return (
    <div className="min-h-[34px] border border-black px-2 py-1 break-words [overflow-wrap:anywhere]">
      <div className="text-[10px] font-semibold uppercase leading-tight text-gray-700">
        {label}
      </div>
      <div className="mt-0.5 text-[11px] font-semibold leading-tight">
        {formatValue(value)}
      </div>
    </div>
  );
}

const getLinkedLensName = (lens, lenses) => {
  const linkedIndex = Number(lens.linked_to_index || 0);
  if (!linkedIndex) return "";
  const currentName = formatValue(lens.lens_type);
  const linkedName = formatValue(lenses[linkedIndex - 1]?.lens_type);
  return linkedName !== "-" && linkedName !== currentName ? linkedName : "";
};

const getLensLabel = (lens, lenses) => {
  const linkedName = getLinkedLensName(lens, lenses);
  const lensName = formatValue(lens.lens_type);
  return linkedName ? `${lensName} - Linked with ${linkedName}` : lensName;
};

const getPrescriptionKey = (lens) => {
  return [
    lens.right_sph,
    lens.right_cyl,
    lens.right_axis,
    lens.right_va,
    lens.left_sph,
    lens.left_cyl,
    lens.left_axis,
    lens.left_va,
  ]
    .map(formatValue)
    .join("|");
};

const getGroupedLenses = (lenses) => {
  return lenses.reduce((groups, lens, index) => {
    const key = getPrescriptionKey(lens);
    const existingGroup = groups.find((group) => group.key === key);
    const lensInfo = { lens, index };
    if (existingGroup) {
      existingGroup.items.push(lensInfo);
      return groups;
    }
    return [...groups, { key, items: [lensInfo] }];
  }, []);
};

const getGroupTitle = (group, lenses) => {
  return group.items
    .map(({ lens, index }) => `Lens ${index + 1}: ${getLensLabel(lens, lenses)}`)
    .join(" | ");
};

function LensTable({ lenses }) {
  if (!lenses.length) return null;
  const lensGroups = getGroupedLenses(lenses);

  return (
    <div className="mt-3 space-y-3">
      {lensGroups.map((group, groupIndex) => {
        const primaryLens = group.items[0].lens;
        const hasSharedPrescription = group.items.length > 1;

        return (
          <table
            key={`${group.key}-${groupIndex}`}
            className="w-full border border-black text-center text-[10px]"
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-left" colSpan="5">
                  <span className="flex flex-wrap gap-x-2 gap-y-1 break-words [overflow-wrap:anywhere]">
                    <span>{getGroupTitle(group, lenses)}</span>
                    {hasSharedPrescription && (
                      <span className="font-normal">(Same prescription)</span>
                    )}
                  </span>
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-black p-1">Eye</th>
                <th className="border border-black p-1">SPH</th>
                <th className="border border-black p-1">CYL</th>
                <th className="border border-black p-1">AXIS</th>
                <th className="border border-black p-1">VN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1 font-semibold">Right</td>
                <td className="border border-black p-1">{formatValue(primaryLens.right_sph)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.right_cyl)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.right_axis)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.right_va)}</td>
              </tr>
              <tr>
                <td className="border border-black p-1 font-semibold">Left</td>
                <td className="border border-black p-1">{formatValue(primaryLens.left_sph)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.left_cyl)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.left_axis)}</td>
                <td className="border border-black p-1">{formatValue(primaryLens.left_va)}</td>
              </tr>
              <tr>
                <td className="border border-black p-1">ADD</td>
                <td className="border border-black p-1" colSpan="4">
                  {formatValue(primaryLens.add)}
                </td>
              </tr>
            </tbody>
          </table>
        );
      })}
    </div>
  );
}

function ItemTable({ items }) {
  return (
    <div className="mt-2">
      <table className="w-full border border-black text-[10px]">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="w-8 border border-black p-1">Sr.</th>
            <th className="border border-black p-1">Item</th>
            <th className="w-20 border border-black p-1">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td className="border border-black p-1 text-center">{index + 1}</td>
                <td className="border border-black p-1 break-words [overflow-wrap:anywhere]">
                  {formatValue(item.name)}
                </td>
                <td className="border border-black p-1 text-right">
                  {formatMoney(item.price)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-black p-1 text-center" colSpan="3">
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TermsList() {
  return (
    <div>
      <h2 className="text-[11px] font-bold uppercase">Terms & Conditions</h2>
      <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-[9px] leading-snug">
        {terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ol>
    </div>
  );
}

function TotalsBox({ total, discount, advance, balance, showDiscount }) {
  return (
    <div className="border border-black text-[10px]">
      <div className="flex justify-between border-b border-black px-2 py-1">
        <span>Total</span>
        <span>Rs. {formatMoney(total)}</span>
      </div>
      {showDiscount && (
        <div className="flex justify-between border-b border-black px-2 py-1">
          <span>Discount</span>
          <span>Rs. {formatMoney(discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-b border-black px-2 py-1">
        <span>Advance</span>
        <span>Rs. {formatMoney(advance)}</span>
      </div>
      <div className="flex justify-between bg-gray-100 px-2 py-1 font-bold">
        <span>Balance</span>
        <span>Rs. {formatMoney(balance)}</span>
      </div>
    </div>
  );
}

function InvoiceCopy({
  customerName,
  customerNumber,
  orderNumber,
  orderDate,
  deliveryDate,
  lenses,
  items,
  total,
  discount,
  advance,
  balance,
  showDiscount,
  copyLabel,
}) {
  return (
    <section className="min-w-0 px-4 py-2 text-black">
      <div className="grid grid-cols-[23mm_1fr] items-center gap-2 leading-tight">
        <div className="flex h-[18mm] w-[23mm] items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt="Bhairahawa Eye Care & Optical logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-base font-bold">Bhairahawa Eye Care & Optical</p>
          <p className="mt-1 text-[10px] font-semibold">
            Phone No.: 8052595575, 9648277796
          </p>
          <p className="mt-0.5 text-[9px]">
  <strong>Mehdawal</strong> Bus Stand Ke Samne, District Sant Kabir Nagar
</p>
          <p className="mt-1 text-[10px] font-bold uppercase">{copyLabel}</p>
        </div>
      </div>

      <div className="my-2 border-t-2 border-black" />

      <div className="grid grid-cols-2 gap-1 text-center">
        <DetailBox label="Name" value={customerName} />
        <DetailBox label="Mobile" value={customerNumber} />
        <DetailBox label="Order Date" value={orderDate} />
        <DetailBox label="Delivery" value={deliveryDate} />
        
      </div>

      <LensTable lenses={lenses} />
      <ItemTable items={items} />

      <div className="avoid-break mt-2 grid grid-cols-[1fr_34mm] gap-2">
        <div className="border border-black p-2">
          <TermsList />
        </div>
        <TotalsBox
          total={total}
          discount={discount}
          advance={advance}
          balance={balance}
          showDiscount={showDiscount}
        />
      </div>
    </section>
  );
}

function InvoiceBilling({ billing }) {
  const printRef = useRef();

  const customerName = billing?.customer_name;
  const customerNumber = billing?.mobile_number;
  const orderNumber = billing?.order_number;
  const orderDate = formatDate(billing?.order_date);
  const deliveryDate = formatDate(billing?.delivery_date);

  const lenses = billing?.lenses || [];

  const frameItems = (billing?.frames || []).map((frame) => ({
    name: `Frame (${formatValue(frame.name)})`,
    price: Number(frame.price || 0),
  }));

  const lensItems = lenses.map((lens) => ({
    name: `Lens (${getLensLabel(lens, lenses)})`,
    price: Number(lens.price || 0),
  }));

  const items = [...frameItems, ...lensItems];

  const total = billing?.net_total;
  const discount = billing?.discount;
  const advance = billing?.advance_paid;
  const balance = billing?.balance;
  const showDiscount = hasAmount(discount);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${formatValue(orderNumber)}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }

      @media print {
        html,
        body {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          overflow: visible !important;
        }

        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          transform: scale(1) !important;
          transform-origin: top left !important;
          zoom: 1 !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }

        .invoice-paper {
          box-shadow: none !important;
          margin: 0 !important;
          width: 200mm !important;
          max-width: 200mm !important;
          min-height: 0 !important;
          padding: 2mm 2mm 2mm 4mm !important;
          transform: scale(1) !important;
          transform-origin: top left !important;
          zoom: 1 !important;
        }

        .print-cut-line {
          border-left: 1px dashed #000000 !important;
          left: 50.5% !important;
        }

        table {
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        table, th, td {
          border: 1px solid #000000 !important;
        }

        .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }

        thead,
        tbody,
        tr,
        th,
        td,
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .invoice-paper {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        a,
        a:visited {
          color: inherit !important;
          text-decoration: none !important;
        }

        a[href]::after {
          content: "" !important;
        }
      }
    `,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <button
        onClick={handlePrint}
        className="mb-3 rounded bg-blue-600 px-5 py-2 text-white print:hidden"
      >
        Print Invoice
      </button>

      <div
        ref={printRef}
        className="invoice-paper relative mx-auto grid grid-cols-2 bg-white text-black shadow-md"
        style={{
          width: "200mm",
          minHeight: 0,
          padding: "2mm 2mm 2mm 4mm",
        }}
      >
        <InvoiceCopy
          customerName={customerName}
          customerNumber={customerNumber}
          orderNumber={orderNumber}
          orderDate={orderDate}
          deliveryDate={deliveryDate}
          lenses={lenses}
          items={items}
          total={total}
          discount={discount}
          advance={advance}
          balance={balance}
          showDiscount={showDiscount}
          copyLabel="Customer Copy"
        />

        <div className="print-cut-line absolute left-[50.5%] top-0 h-full -translate-x-1/2 border-l border-dashed border-black" />

        <InvoiceCopy
          customerName={customerName}
          customerNumber={customerNumber}
          orderNumber={orderNumber}
          orderDate={orderDate}
          deliveryDate={deliveryDate}
          lenses={lenses}
          items={items}
          total={total}
          discount={discount}
          advance={advance}
          balance={balance}
          showDiscount={showDiscount}
          copyLabel="Shop Copy"
        />
      </div>
    </div>
  );
}

export default InvoiceBilling;
