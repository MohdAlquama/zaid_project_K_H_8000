import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { Download } from "lucide-react"

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value

  return new Date(normalizedValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatDateTime = (value) => {
  if (!value) {
    return "-"
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const escapeCsvValue = (value) => {
  const stringValue = `${value ?? ""}`.replace(/"/g, '""')

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue}"`
  }

  return stringValue
}

const escapeHtml = (value) => `${value ?? ""}`
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;")

const truncate = (value, length) => {
  const stringValue = `${value ?? ""}`

  if (stringValue.length <= length) {
    return stringValue
  }

  return `${stringValue.slice(0, Math.max(length - 1, 1))}...`
}

const downloadBlob = (content, mimeType, extension, fileName) => {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = `${fileName}.${extension}`
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 0)
}

const buildFileName = (filters = {}) => {
  const today = new Date().toISOString().slice(0, 10)
  const fromDate = filters.from_date || "all"
  const toDate = filters.to_date || "all"

  return `financial-report-${fromDate}-to-${toDate}-${today}`.replace(/[^a-zA-Z0-9-_]/g, "-")
}

function FinancialReportExport({ rows = [], summary = {}, filters = {}, generatedAt = null, loading = false }) {
  const fileName = buildFileName(filters)

  const summaryEntries = [
    ["Generated At", formatDateTime(generatedAt)],
    ["From Date", filters.from_date || "All"],
    ["To Date", filters.to_date || "All"],
    ["Customer Filter", filters.customer_name || "All"],
    ["Mobile Filter", filters.mobile_number || "All"],
    ["Order Filter", filters.order_number || "All"],
    ["Payment Status", filters.payment_status || "All"],
    ["Total Orders", summary.total_billings ?? 0],
    ["Gross Amount", formatCurrency(summary.gross_amount)],
    ["Discount", formatCurrency(summary.discount_amount)],
    ["Collected Amount", formatCurrency(summary.collected_amount)],
    ["Due Amount", formatCurrency(summary.due_amount)],
    ["Net Amount", formatCurrency(summary.net_amount)],
  ]

  const detailHeaders = [
    "Order Number",
    "Customer Name",
    "Mobile Number",
    "Order Date",
    "Delivery Date",
    "Gross Amount",
    "Discount",
    "Collected Amount",
    "Due Amount",
    "Net Amount",
    "Payment Status",
  ]

  const detailRows = rows.map((row) => ([
    row.order_number || "-",
    row.customer_name || "-",
    row.mobile_number || "-",
    formatDate(row.order_date),
    formatDate(row.delivery_date),
    Number(row.gross_amount || 0).toFixed(2),
    Number(row.discount || 0).toFixed(2),
    Number(row.advance_paid || 0).toFixed(2),
    Number(row.balance || 0).toFixed(2),
    Number(row.net_total || 0).toFixed(2),
    row.payment_status || "-",
  ]))

  const exportCsv = () => {
    const lines = [
      ["Financial Report"],
      ...summaryEntries,
      [],
      detailHeaders,
      ...detailRows,
    ]

    const csvContent = lines
      .map((line) => line.map((value) => escapeCsvValue(value)).join(","))
      .join("\n")

    downloadBlob(csvContent, "text/csv;charset=utf-8", "csv", fileName)
  }

  const exportExcel = () => {
    const summaryTableRows = summaryEntries
      .map(([label, value]) => `<tr><th style="text-align:left;padding:6px 10px;background:#f8fafc;">${escapeHtml(label)}</th><td style="padding:6px 10px;">${escapeHtml(value)}</td></tr>`)
      .join("")

    const detailTableRows = detailRows
      .map((row) => `<tr>${row.map((value) => `<td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(value)}</td>`).join("")}</tr>`)
      .join("")

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Financial Report</title>
        </head>
        <body>
          <h2 style="font-family: Arial, sans-serif;">Financial Report</h2>
          <table style="border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif;">
            ${summaryTableRows}
          </table>
          <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <thead>
              <tr>
                ${detailHeaders.map((header) => `<th style="padding:8px 10px;border:1px solid #94a3b8;background:#e2e8f0;text-align:left;">${escapeHtml(header)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${detailTableRows}
            </tbody>
          </table>
        </body>
      </html>
    `

    downloadBlob(`\ufeff${htmlContent}`, "application/vnd.ms-excel;charset=utf-8", "xls", fileName)
  }

  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const columns = [
      { label: "Order", x: 10, getter: (row) => truncate(row.order_number || "-", 14) },
      { label: "Customer", x: 34, getter: (row) => truncate(row.customer_name || "-", 20) },
      { label: "Mobile", x: 76, getter: (row) => truncate(row.mobile_number || "-", 14) },
      { label: "Order Dt", x: 102, getter: (row) => truncate(formatDate(row.order_date), 12) },
      { label: "Delivery", x: 126, getter: (row) => truncate(formatDate(row.delivery_date), 12) },
      { label: "Gross", x: 151, getter: (row) => truncate(formatCurrency(row.gross_amount), 12) },
      { label: "Disc", x: 173, getter: (row) => truncate(formatCurrency(row.discount), 12) },
      { label: "Paid", x: 194, getter: (row) => truncate(formatCurrency(row.advance_paid), 12) },
      { label: "Due", x: 216, getter: (row) => truncate(formatCurrency(row.balance), 12) },
      { label: "Net", x: 237, getter: (row) => truncate(formatCurrency(row.net_total), 12) },
      { label: "Status", x: 259, getter: (row) => truncate(row.payment_status || "-", 10) },
    ]

    let y = 14

    const drawTableHeader = () => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      columns.forEach((column) => {
        doc.text(column.label, column.x, y)
      })
      doc.line(10, y + 2, 287, y + 2)
      y += 6
      doc.setFont("helvetica", "normal")
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("Financial Report", 10, y)
    y += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(`Generated: ${formatDateTime(generatedAt)}`, 10, y)
    y += 5
    const filterLines = doc.splitTextToSize(
      `Filters: From ${filters.from_date || "All"} | To ${filters.to_date || "All"} | Customer ${filters.customer_name || "All"} | Mobile ${filters.mobile_number || "All"} | Order ${filters.order_number || "All"} | Status ${filters.payment_status || "All"}`,
      270,
    )
    doc.text(filterLines, 10, y)
    y += filterLines.length * 5 + 2

    const pdfSummaryEntries = [
      `Total Orders: ${summary.total_billings ?? 0}`,
      `Gross Amount: ${formatCurrency(summary.gross_amount)}`,
      `Discount: ${formatCurrency(summary.discount_amount)}`,
      `Collected Amount: ${formatCurrency(summary.collected_amount)}`,
      `Due Amount: ${formatCurrency(summary.due_amount)}`,
      `Net Amount: ${formatCurrency(summary.net_amount)}`,
    ]

    pdfSummaryEntries.forEach((entry, index) => {
      const column = index % 2
      const rowIndex = Math.floor(index / 2)
      const x = column === 0 ? 10 : 110
      const lineY = y + rowIndex * 6

      doc.text(entry, x, lineY)
    })

    y += Math.ceil(pdfSummaryEntries.length / 2) * 6 + 4
    drawTableHeader()

    rows.forEach((row) => {
      if (y > 192) {
        doc.addPage()
        y = 14
        drawTableHeader()
      }

      doc.setFontSize(7.5)
      columns.forEach((column) => {
        doc.text(column.getter(row), column.x, y)
      })
      y += 5
    })

    doc.save(`${fileName}.pdf`)
  }

  const handleExport = async (type) => {
    if (type === "pdf") {
      await exportPdf()
      return
    }

    if (type === "excel") {
      exportExcel()
      return
    }

    exportCsv()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" disabled={loading || rows.length === 0}>
          {loading ? <Spinner className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {loading ? "Preparing report..." : "Download Report"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault()
          void handleExport("pdf")
        }}>
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault()
          void handleExport("csv")
        }}>
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault()
          void handleExport("excel")
        }}>
          Download Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FinancialReportExport
