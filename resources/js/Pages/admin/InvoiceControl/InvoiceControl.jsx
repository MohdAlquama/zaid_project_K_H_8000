import AdminLayout from '@/Layouts/AdminLayout';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

// shadcn components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // <-- Add this import
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


 function InfoPopupDark({ title = "Information", children }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex items-center ml-2" ref={popupRef}>
      {/* Naya Solid Icon */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="text-slate-400 hover:text-slate-800 transition-transform active:scale-95 focus:outline-none"
        title="Click for more info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 011.08.846l-1.25 5a.75.75 0 01-1.427-.294l.042-.02a.75.75 0 01-1.08-.846l1.25-5a.75.75 0 011.427.294l-.042.02a.75.75 0 011.08.846l-1.25 5a.75.75 0 01-1.427-.294l.042-.02a.75.75 0 01-1.08-.846l1.25-5a.75.75 0 011.427.294zM12 7.5a.75.75 0 110-1.5.75.75 0 010 1.5z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dark Theme Popup Box */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 p-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-white text-sm">{title}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-slate-300 space-y-2 font-normal">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
function InvoiceControl({ settings }) {
  const { data, setData, post, processing, errors } = useForm({
    business_name: settings?.business_name || '',
    mobile_number: settings?.mobile_number || '',
    address: settings?.address || '',
    logo: null,
    customer_copy: settings?.customer_copy || false,
    shop_copy: settings?.shop_copy || false,
    order_no: settings?.order_no || false,
    show_logo: settings?.show_logo || false,
    vertical_line_show: settings?.vertical_line_show || false,
    line_type: settings?.line_type || 'customizable',
    custom_line_width: settings?.custom_line_width || '',
    custom_line_type: settings?.custom_line_type || '',
    header_line_show: settings?.header_line_show ?? false,
    header_line_width: settings?.header_line_width ?? '',
    header_line_spacing_top: settings?.header_line_spacing_top ?? '',
    header_line_spacing_bottom: settings?.header_line_spacing_bottom ?? '',
    terms_and_conditions: settings?.terms_and_conditions || '',
    admin_check: Boolean(settings?.admin_check),
    staff_check: Boolean(settings?.staff_check),
    phone: settings?.phone || '',
    auto_delivery: Boolean(settings?.auto_delivery),
    delivery_days: settings?.delivery_days ?? 1,
    total_display_type: settings?.total_display_type || 'net_total',
  });

  const tailwindMarginOptions = [
    "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
    "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
    "20", "24", "28", "32", "36", "40", "44", "48", "52",
    "56", "60", "64", "72", "80", "96"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.invoice-control.store'), {
      forceFormData: true, // This ensures images and booleans upload correctly
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Settings saved successfully!');
      },
      onError: (errors) => {
        const messages = Object.values(errors).flat();
        if (messages.length > 0) {
          toast.error('Please fix the following:', {
            description: messages.join(' • '),
          });
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
            Invoice Control
          </p>
          <h1 className="text-2xl font-bold mt-1 text-slate-900">
            Invoice Settings
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage your invoices and billing settings from this page.
          </p>
        </div>

        <Button type="submit" disabled={processing} className="px-6">
           {processing ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Form Content */}
      <Card className="rounded-2xl shadow-sm border-slate-200">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Basic Information */}
          <div className="space-y-3">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              placeholder="Enter business name"
              value={data.business_name}
              onChange={(e) => setData('business_name', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              id="mobile_number"
              type="tel"
              placeholder="Enter mobile number"
              value={data.mobile_number}
              onChange={(e) => setData('mobile_number', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="logo_upload">Upload Logo</Label>
            <Input
              id="logo_upload"
              type="file"
              className="cursor-pointer"
              onChange={(e) => setData('logo', e.target.files[0])}
            />
            {settings?.logo_path && !data.logo && (
              <p className="text-xs text-green-600 mt-1">Logo already uploaded.</p>
            )}
          </div>

          {/* Delivery Date settings */}
          <div className="md:col-span-4 border-t pt-6 mt-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
            Delivery Date Settings
            <InfoPopupDark title="Delivery Date Info">
              <p className="mb-2">Automate the delivery date on the <strong>Create Billing</strong> page to save time.</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li><strong>How it works:</strong> Enter the number of days to automatically add to the order date.</li>
                <li><strong>Example:</strong> If set to <strong>1</strong>, an order placed on July 11 will default to July 12 for delivery.</li>
                <li><strong>Flexibility:</strong> The generated date is just a default. Staff can still manually select a different date if needed during billing.</li>
              </ul>
            </InfoPopupDark>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 mt-8">
              <Checkbox
                id="auto_delivery"
                checked={data.auto_delivery}
                onCheckedChange={(checked) => setData('auto_delivery', !!checked)}
              />
              <Label htmlFor="auto_delivery" className="cursor-pointer font-medium text-slate-700">
                Enable Auto-Date
              </Label>
            </div>

            <div className="space-y-3">
              <Label htmlFor="delivery_days">Days Offset</Label>
              <Input
                id="delivery_days"
                type="tel"
                maxLength={2} // Allows 0-99 days max
                placeholder="Eg: 1"
                value={data.delivery_days}
                disabled={!data.auto_delivery} // Grayed out if checkbox is off
                onChange={(e) => {
                  // Sirf (0-9) numbers ko allow karega
                  const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                  setData('delivery_days', onlyNums);
                }}
              />
              {errors.delivery_days && <p className="text-sm text-red-600">{errors.delivery_days}</p>}
            </div>
          </div>
        </div>
        {/* Invoice Total Display Settings */}
          <div className="md:col-span-4 border-t pt-6 mt-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              Invoice Total Display Option
              <InfoPopupDark title="Total Display Info">
                <p className="mb-2">Choose which total amount should be highlighted on the printed invoice.</p>
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li><strong>Net Total:</strong> Final price after discount (Recommended).</li>
                  <li><strong>Gross Total:</strong> Frame + Lens price without discount.</li>
                </ul>
              </InfoPopupDark>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="space-y-3">
                <Label htmlFor="total_display_type">Show Total As</Label>
                <Select
                  value={data.total_display_type}
                  onValueChange={(val) => setData('total_display_type', val)}
                >
                  <SelectTrigger id="total_display_type">
                    <SelectValue placeholder="Select Total to Display" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net_total">Net Total (Grand Total)</SelectItem>
                    <SelectItem value="frame_total">Gross Total (Frame + Lens)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Default is Net Total. This will change the main amount shown on customer bills.
                </p>
                {errors.total_display_type && (
                  <p className="text-sm text-red-600">{errors.total_display_type}</p>
                )}
              </div>
            </div>
          </div>
          {/* Invoice phone settings */}
          <div className="md:col-span-4 border-t pt-6 mt-2">
  {/* Yahan 'flex items-center gap-2' add kiya gaya hai perfect alignment ke liye */}
  <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
    Phone Number Settings
   <InfoPopupDark title="Phone Number Settings Info">
  <p className="mb-2">Choose where phone numbers appear on your invoices. Changes apply on the <strong>Create Billing</strong> page.</p>
  <ul className="list-disc pl-4 space-y-1 mt-2">
    <li><strong>Access:</strong> Only Admin can update these settings.</li>
    <li><strong>Usage:</strong> Tick the boxes below. During billing, simply enter a standard 10-digit Indian phone number.</li>
    <li><strong>Validation:</strong> If the number is missing or invalid, an error will appear, preventing invoice creation.</li>
    <li><strong>Format:</strong> Only 2 numbers are allowed. No letters or special characters.</li>
  </ul>
  <p className="text-sm">
    <strong>Note:</strong> Only Admin can enable this. Once ticked admin and staff, a valid <strong>10-digit phone number becomes required</strong> during billing (will show an error if missed or invalid).
  </p>
</InfoPopupDark>
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <div className="flex items-center space-x-3">
      <Checkbox
        id="admin_check"
        checked={data.admin_check}
        onCheckedChange={(checked) => setData('admin_check', !!checked)}
      />
      <Label htmlFor="admin_check" className="cursor-pointer font-medium text-slate-700">
        Admin
      </Label>
    </div>

    <div className="flex items-center space-x-3">
      <Checkbox
        id="staff_check"
        checked={data.staff_check}
        onCheckedChange={(checked) => setData('staff_check', !!checked)}
      />
      <Label htmlFor="staff_check" className="cursor-pointer font-medium text-slate-700">
        Staff
      </Label>
    </div>

  <div className="space-y-3">
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    type="tel"
    maxLength={2} // Sirf 2 characters allow honge
    placeholder="Eg: 12"
    value={data.phone}
    onChange={(e) => {
      // Ye line sirf (0-9) numbers ko hi type hone degi, alphabets ko hata degi
      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
      setData('phone', onlyNums);
    }}
  />
  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
</div>


  </div>
          </div>
          {/* Invoice Options Section */}
          <div className="md:col-span-4 border-t pt-6 mt-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Invoice Elements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="customer_copy_check"
                  checked={data.customer_copy}
                  onCheckedChange={(checked) => setData('customer_copy', !!checked)}
                />
                <Label htmlFor="customer_copy_check" className="cursor-pointer font-medium text-slate-700">
                  Customer Copy
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="shop_copy_check"
                  checked={data.shop_copy}
                  onCheckedChange={(checked) => setData('shop_copy', !!checked)}
                />
                <Label htmlFor="shop_copy_check" className="cursor-pointer font-medium text-slate-700">
                  Shop Copy
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="order_no_check"
                  checked={data.order_no}
                  onCheckedChange={(checked) => setData('order_no', !!checked)}
                />
                <Label htmlFor="order_no_check" className="cursor-pointer font-medium text-slate-700">
                  Order No
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="logo_check"
                  checked={data.show_logo}
                  onCheckedChange={(checked) => setData('show_logo', !!checked)}
                />
                <Label htmlFor="logo_check" className="cursor-pointer font-medium text-slate-700">
                  Show Logo
                </Label>
              </div>
            </div>
          </div>

          {/* Vertical Line Settings Section */}
          <div className="md:col-span-4 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Vertical Line & Type Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

              <div className="flex items-center space-x-3 h-10">
                <Checkbox
                  id="line_hide_show"
                  checked={data.vertical_line_show}
                  onCheckedChange={(checked) => setData('vertical_line_show', !!checked)}
                />
                <Label htmlFor="line_hide_show" className="cursor-pointer font-medium text-slate-700">
                  Vertical Line Hide/Show
                </Label>
              </div>

              <div className="space-y-4">
                <Label>Line Type</Label>
                <RadioGroup
                  value={data.line_type}
                  onValueChange={(val) => setData('line_type', val)}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="customizable" id="customizable" />
                    <Label htmlFor="customizable" className="cursor-pointer font-normal">Custom Line Width</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="non_customizable" id="non_customizable" />
                    <Label htmlFor="non_customizable" className="cursor-pointer font-normal">Optional Line Type</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="custom_line_px">Custom Line Width</Label>
                <Input
                  id="custom_line_px"
                  placeholder="e.g. 15px"
                  value={data.custom_line_width}
                  onChange={(e) => setData('custom_line_width', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Custom Line Type</Label>
                <Select
                  value={data.custom_line_type}
                  onValueChange={(val) => setData('custom_line_type', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Custom Line Type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {tailwindMarginOptions.map((margin) => (
                      <SelectItem key={`mt-${margin}`} value={`mt-${margin}`}>
                        mt-{margin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Header Divider Line Settings Section */}
          <div className="md:col-span-4 border-t pt-6">
            <h3 className="text-lg font-semibold mb-1 text-slate-800">Header Divider Line Settings</h3>
            <p className="text-sm text-slate-500 mb-4">
              This is the line below "Order No.", above the Name/Mobile/Order Date/Delivery boxes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

              <div className="flex items-center space-x-3 h-10">
                <Checkbox
                  id="header_line_show_check"
                  checked={data.header_line_show}
                  onCheckedChange={(checked) => setData('header_line_show', !!checked)}
                />
                <Label htmlFor="header_line_show_check" className="cursor-pointer font-medium text-slate-700">
                  Header Line Hide/Show
                </Label>
              </div>

              <div className="space-y-3">
                <Label htmlFor="header_line_width">Line Thickness (px)</Label>
                <Input
                  id="header_line_width"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  value={data.header_line_width}
                  onChange={(e) => setData('header_line_width', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="header_line_spacing_top">Spacing Above (px)</Label>
                <Input
                  id="header_line_spacing_top"
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={data.header_line_spacing_top}
                  onChange={(e) => setData('header_line_spacing_top', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="header_line_spacing_bottom">Spacing Below (px)</Label>
                <Input
                  id="header_line_spacing_bottom"
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={data.header_line_spacing_bottom}
                  onChange={(e) => setData('header_line_spacing_bottom', e.target.value)}
                />
              </div>

            </div>
          </div>
         {/* Terms & Conditions Section */}
          <div className="md:col-span-4 border-t pt-6 mt-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Terms & Conditions</h3>
            <div className="space-y-3">
              <Label htmlFor="terms_and_conditions">Invoice Footer Terms</Label>
              <Textarea
                id="terms_and_conditions"
                placeholder="Enter the terms and conditions to display at the bottom of the invoice..."
                className="min-h-[120px]"
                value={data.terms_and_conditions}
                onChange={(e) => setData('terms_and_conditions', e.target.value)}
              />
              <p className="text-xs text-slate-500">
                These terms will be printed at the bottom of the customer and shop copy invoices. <strong><code className="bg-red-100 px-1 rounded">/n</code></strong> Use to create a new line in the text.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

InvoiceControl.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default InvoiceControl;
