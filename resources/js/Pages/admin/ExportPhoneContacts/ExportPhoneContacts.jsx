import React, { useMemo, useState } from 'react'
import AdminLayout from '@/Layouts/AdminLayout'
import { router } from '@inertiajs/react'
import { Download, Filter, Phone, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const tokens = [
  { value: '{name}', label: 'Customer name' },
  { value: '{number}', label: 'Phone number' },
  { value: '{order_number}', label: 'Order number' },
  { value: '{order_date}', label: 'Order date' },
  { value: '{delivery_date}', label: 'Delivery date' },
]

const presets = [
  { label: 'Name only', value: '{name}' },
  { label: 'Name + number', value: '{name} - {number}' },
  { label: 'Name + order', value: '{name} - {order_number}' },
  { label: 'Full details', value: '{name} - {number} - {order_number} - {order_date} - {delivery_date}' },
]

const isNumericPhone = (value) => /^[0-9]+$/.test(`${value ?? ''}`)

const renderTemplate = (template, customer = {}) => {
  const values = {
    '{name}': customer.customer_name || 'Customer Name',
    '{number}': customer.mobile_number || '9876543210',
    '{order_number}': customer.order_number || 'ORD-001',
    '{order_date}': customer.order_date || '2026-07-12',
    '{delivery_date}': customer.delivery_date || '2026-07-13',
  }

  return Object.entries(values).reduce(
    (result, [token, value]) => result.split(token).join(value),
    template,
  )
}

export default function ExportPhoneContacts({ customers, filters, defaultPhoneLength = 10 }) {
  const [startDate, setStartDate] = useState(filters?.start_date || '')
  const [endDate, setEndDate] = useState(filters?.end_date || '')
  const [uniqueNumbers, setUniqueNumbers] = useState(
    filters?.unique_numbers === '1' || filters?.unique_numbers === true,
  )
  const [includeNa, setIncludeNa] = useState(
    filters?.include_na === '1' || filters?.include_na === true,
  )
  const [filterLength, setFilterLength] = useState(
    filters?.filter_length === '1' || filters?.filter_length === true,
  )
  const [phoneLength, setPhoneLength] = useState(filters?.phone_length || defaultPhoneLength)
  const [selectedIds, setSelectedIds] = useState([])
  const [nameTemplate, setNameTemplate] = useState('{name} - {order_number}')
  const [fileName, setFileName] = useState('Customer Contacts')

  const selectableCustomers = useMemo(
    () => customers.data.filter((customer) => isNumericPhone(customer.mobile_number)),
    [customers.data],
  )
  const pageSelectableIds = selectableCustomers.map((customer) => customer.id)
  const isAllSelected = pageSelectableIds.length > 0
    && pageSelectableIds.every((id) => selectedIds.includes(id))
  const previewCustomer = selectableCustomers[0]

  const applyFilters = () => {
    setSelectedIds([])
    router.get(route('admin.export.contacts.index'), {
      start_date: startDate,
      end_date: endDate,
      unique_numbers: uniqueNumbers ? 1 : 0,
      include_na: includeNa ? 1 : 0,
      filter_length: filterLength ? 1 : 0,
      phone_length: phoneLength,
    }, {
      preserveState: true,
      replace: true,
    })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds((current) => [...new Set([...current, ...pageSelectableIds])])
      return
    }

    setSelectedIds((current) => current.filter((id) => !pageSelectableIds.includes(id)))
  }

  const handleSelectOne = (id, checked) => {
    setSelectedIds((current) => checked
      ? [...new Set([...current, id])]
      : current.filter((selectedId) => selectedId !== id))
  }

  const appendToken = (token) => {
    setNameTemplate((current) => `${current}${current.trim() ? ' - ' : ''}${token}`)
  }

  const handleExport = () => {
    if (selectedIds.length === 0 || !nameTemplate.trim()) return

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = route('admin.export.contacts.download')
    form.hidden = true

    const fields = {
      _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      name_template: nameTemplate,
      file_name: fileName,
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    })

    selectedIds.forEach((id) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'ids[]'
      input.value = id
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    form.remove()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-slate-900 p-3 text-white">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact tools</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Export Phone Contacts</h1>
              <p className="mt-2 text-sm text-slate-500">
                Filter billing customers, choose many contacts, and control exactly how each saved contact name appears.
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" /> Filter contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Start Order Date</Label>
                <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Order Date</Label>
                <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Required Number Length</Label>
                <Input
                  type="number"
                  min="1"
                  max="15"
                  value={phoneLength}
                  disabled={!filterLength}
                  onChange={(event) => setPhoneLength(event.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Checkbox id="unique" checked={uniqueNumbers} onCheckedChange={(value) => setUniqueNumbers(Boolean(value))} />
                <Label htmlFor="unique" className="cursor-pointer">Unique numbers only</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="include-na" checked={includeNa} onCheckedChange={(value) => setIncludeNa(Boolean(value))} />
                <Label htmlFor="include-na" className="cursor-pointer">Show n/a numbers</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="filter-length" checked={filterLength} onCheckedChange={(value) => setFilterLength(Boolean(value))} />
                <Label htmlFor="filter-length" className="cursor-pointer">Only exact digit length</Label>
              </div>
              <Button onClick={applyFilters} className="ml-auto">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Contact name designer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button key={preset.label} type="button" variant="outline" size="sm" onClick={() => setNameTemplate(preset.value)}>
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Custom Contact Name Template</Label>
                <Input value={nameTemplate} onChange={(event) => setNameTemplate(event.target.value)} placeholder="{name} - {order_number}" />
                <div className="flex flex-wrap gap-2 pt-1">
                  {tokens.map((token) => (
                    <button
                      key={token.value}
                      type="button"
                      onClick={() => appendToken(token.value)}
                      className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
                    >
                      + {token.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Export File Name</Label>
                <Input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="Customer Contacts" />
                <div className="rounded-xl border border-dashed bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact preview</p>
                  <p className="mt-1 break-words font-medium text-slate-900">{renderTemplate(nameTemplate, previewCustomer)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Users className="h-4 w-4" /> {selectedIds.length} valid contact(s) selected
          </div>
          <Button onClick={handleExport} disabled={selectedIds.length === 0 || !nameTemplate.trim()}>
            <Download className="mr-2 h-4 w-4" /> Export Selected as ZIP
          </Button>
        </div>

        <Card className="overflow-hidden rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-800">
                <tr>
                  <th className="w-12 p-4"><Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} /></th>
                  <th className="p-4 font-semibold">Customer Name</th>
                  <th className="p-4 font-semibold">Mobile Number</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Order No.</th>
                  <th className="p-4 font-semibold">Order Date</th>
                  <th className="p-4 font-semibold">Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.data.map((customer) => {
                  const valid = isNumericPhone(customer.mobile_number)
                  const exactLength = valid && `${customer.mobile_number}`.length === Number(phoneLength)

                  return (
                    <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <Checkbox
                          disabled={!valid}
                          checked={selectedIds.includes(customer.id)}
                          onCheckedChange={(checked) => handleSelectOne(customer.id, Boolean(checked))}
                        />
                      </td>
                      <td className="p-4 font-medium text-slate-900">{customer.customer_name || 'Unnamed'}</td>
                      <td className="p-4 font-mono">{customer.mobile_number || 'n/a'}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${valid && exactLength ? 'bg-emerald-100 text-emerald-700' : valid ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {valid && exactLength ? `${phoneLength} digits` : valid ? `${customer.mobile_number.length} digits` : 'Not exportable'}
                        </span>
                      </td>
                      <td className="p-4">{customer.order_number || '—'}</td>
                      <td className="p-4">{customer.order_date || '—'}</td>
                      <td className="p-4">{customer.delivery_date || '—'}</td>
                    </tr>
                  )
                })}
                {customers.data.length === 0 && (
                  <tr><td colSpan="7" className="p-10 text-center text-slate-500">No contacts found for these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {customers.links?.length > 3 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border bg-white p-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Showing {customers.from || 0}–{customers.to || 0} of {customers.total || 0} contacts
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {customers.links.map((link, index) => (
                <Button
                  key={`${link.label}-${index}`}
                  type="button"
                  size="sm"
                  variant={link.active ? 'default' : 'outline'}
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
