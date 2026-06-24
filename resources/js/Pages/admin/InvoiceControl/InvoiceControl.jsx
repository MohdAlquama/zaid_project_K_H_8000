// // // import AdminLayout from '@/Layouts/AdminLayout';
// // // import React from 'react';
// // // import { useForm } from '@inertiajs/react';

// // // // shadcn components
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";

// // // function InvoiceControl({ settings }) {
// // //   const { data, setData, post, processing, errors } = useForm({
// // //     business_name: settings?.business_name || '',
// // //     mobile_number: settings?.mobile_number || '',
// // //     address: settings?.address || '',
// // //     logo: null, 
// // //     customer_copy: settings?.customer_copy || false,
// // //     shop_copy: settings?.shop_copy || false,
// // //     order_no: settings?.order_no || false,
// // //     show_logo: settings?.show_logo || false,
// // //     vertical_line_show: settings?.vertical_line_show || false,
// // //     line_type: settings?.line_type || 'customizable',
// // //     custom_line_width: settings?.custom_line_width || '',
// // //     custom_line_type: settings?.custom_line_type || '',
// // //   });

// // //   const tailwindMarginOptions = [
// // //     "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
// // //     "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
// // //     "20", "24", "28", "32", "36", "40", "44", "48", "52",
// // //     "56", "60", "64", "72", "80", "96"
// // //   ];

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     post(route('admin.invoice-control.store'), {
// // //       preserveScroll: true,
// // //       onSuccess: () => alert('Settings Saved Successfully!'),
// // //     });
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit} className="space-y-6">

// // //       {/* Header Section */}
// // //       <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm flex justify-between items-center">
// // //         <div>
// // //           <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
// // //             Invoice Control
// // //           </p>
// // //           <h1 className="text-2xl font-bold mt-1 text-slate-900">
// // //             Invoice Settings
// // //           </h1>
// // //           <p className="text-sm text-slate-500 mt-2">
// // //             Manage your invoices and billing settings from this page.
// // //           </p>
// // //         </div>
        
// // //         <Button type="submit" disabled={processing} className="px-6">
// // //            {processing ? 'Saving...' : 'Save Settings'}
// // //         </Button>
// // //       </div>

// // //       {/* Form Content */}
// // //       <Card className="rounded-2xl shadow-sm border-slate-200">
// // //         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

// // //           {/* Basic Information */}
// // //           <div className="space-y-3">
// // //             <Label htmlFor="business_name">Business Name</Label>
// // //             <Input 
// // //               id="business_name" 
// // //               placeholder="Enter business name" 
// // //               value={data.business_name}
// // //               onChange={(e) => setData('business_name', e.target.value)}
// // //             />
// // //           </div>

// // //           <div className="space-y-3">
// // //             <Label htmlFor="mobile_number">Mobile Number</Label>
// // //             <Input 
// // //               id="mobile_number" 
// // //               type="tel" 
// // //               placeholder="Enter mobile number" 
// // //               value={data.mobile_number}
// // //               onChange={(e) => setData('mobile_number', e.target.value)}
// // //             />
// // //           </div>

// // //           <div className="space-y-3">
// // //             <Label htmlFor="address">Address</Label>
// // //             <Input 
// // //               id="address" 
// // //               placeholder="Enter address" 
// // //               value={data.address}
// // //               onChange={(e) => setData('address', e.target.value)}
// // //             />
// // //           </div>

// // //           <div className="space-y-3">
// // //             <Label htmlFor="logo_upload">Upload Logo</Label>
// // //             <Input 
// // //               id="logo_upload" 
// // //               type="file" 
// // //               className="cursor-pointer" 
// // //               onChange={(e) => setData('logo', e.target.files[0])}
// // //             />
// // //             {settings?.logo_path && !data.logo && (
// // //               <p className="text-xs text-green-600 mt-1">Logo already uploaded.</p>
// // //             )}
// // //           </div>

// // //           {/* Invoice Options Section */}
// // //           <div className="md:col-span-4 border-t pt-6 mt-2">
// // //             <h3 className="text-lg font-semibold mb-4 text-slate-800">Invoice Elements</h3>
// // //             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

// // //               <div className="flex items-center space-x-3">
// // //                 <Checkbox 
// // //                   id="customer_copy_check" 
// // //                   checked={data.customer_copy}
// // //                   onCheckedChange={(checked) => setData('customer_copy', !!checked)}
// // //                 />
// // //                 <Label htmlFor="customer_copy_check" className="cursor-pointer font-medium text-slate-700">
// // //                   Customer Copy
// // //                 </Label>
// // //               </div>

// // //               <div className="flex items-center space-x-3">
// // //                 <Checkbox 
// // //                   id="shop_copy_check" 
// // //                   checked={data.shop_copy}
// // //                   onCheckedChange={(checked) => setData('shop_copy', !!checked)}
// // //                 />
// // //                 <Label htmlFor="shop_copy_check" className="cursor-pointer font-medium text-slate-700">
// // //                   Shop Copy
// // //                 </Label>
// // //               </div>

// // //               <div className="flex items-center space-x-3">
// // //                 <Checkbox 
// // //                   id="order_no_check" 
// // //                   checked={data.order_no}
// // //                   onCheckedChange={(checked) => setData('order_no', !!checked)}
// // //                 />
// // //                 <Label htmlFor="order_no_check" className="cursor-pointer font-medium text-slate-700">
// // //                   Order No
// // //                 </Label>
// // //               </div>

// // //               <div className="flex items-center space-x-3">
// // //                 <Checkbox 
// // //                   id="logo_check" 
// // //                   checked={data.show_logo}
// // //                   onCheckedChange={(checked) => setData('show_logo', !!checked)}
// // //                 />
// // //                 <Label htmlFor="logo_check" className="cursor-pointer font-medium text-slate-700">
// // //                   Show Logo
// // //                 </Label>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Vertical Line Settings Section */}
// // //           <div className="md:col-span-4 border-t pt-6">
// // //             <h3 className="text-lg font-semibold mb-4 text-slate-800">Vertical Line & Type Settings</h3>

// // //             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

// // //               {/* Hide/Show Checkbox */}
// // //               <div className="flex items-center space-x-3 h-10">
// // //                 <Checkbox 
// // //                   id="line_hide_show" 
// // //                   checked={data.vertical_line_show}
// // //                   onCheckedChange={(checked) => setData('vertical_line_show', !!checked)}
// // //                 />
// // //                 <Label htmlFor="line_hide_show" className="cursor-pointer font-medium text-slate-700">
// // //                   Vertical Line Hide/Show
// // //                 </Label>
// // //               </div>

// // //               {/* Radio Group */}
// // //               <div className="space-y-4">
// // //                 <Label>Line Type</Label>
// // //                 <RadioGroup 
// // //                   value={data.line_type} 
// // //                   onValueChange={(val) => setData('line_type', val)}
// // //                   className="flex flex-col gap-3"
// // //                 >
// // //                   <div className="flex items-center space-x-3">
// // //                     <RadioGroupItem value="customizable" id="customizable" />
// // //                     <Label htmlFor="customizable" className="cursor-pointer font-normal">Custom Line Width</Label>
// // //                   </div>
// // //                   <div className="flex items-center space-x-3">
// // //                     <RadioGroupItem value="non_customizable" id="non_customizable" />
// // //                     <Label htmlFor="non_customizable" className="cursor-pointer font-normal">Optional Line Type</Label>
// // //                   </div>
// // //                 </RadioGroup>
// // //               </div>

// // //               {/* Custom Line Input */}
// // //               <div className="space-y-3">
// // //                 <Label htmlFor="custom_line_px">Custom Line Width</Label>
// // //                 <Input 
// // //                   id="custom_line_px" 
// // //                   placeholder="e.g. 15px" 
// // //                   value={data.custom_line_width}
// // //                   onChange={(e) => setData('custom_line_width', e.target.value)}
// // //                 />
// // //               </div>

// // //               {/* Select Dropdown */}
// // //               <div className="space-y-3">
// // //                 <Label>Custom Line Type</Label>
// // //                 <Select 
// // //                   value={data.custom_line_type} 
// // //                   onValueChange={(val) => setData('custom_line_type', val)}
// // //                 >
// // //                   <SelectTrigger>
// // //                     <SelectValue placeholder="Select Custom Line Type" />
// // //                   </SelectTrigger>
// // //                   <SelectContent className="max-h-64">
// // //                     {tailwindMarginOptions.map((margin) => (
// // //                       <SelectItem key={`mt-${margin}`} value={`mt-${margin}`}>
// // //                         mt-{margin}
// // //                       </SelectItem>
// // //                     ))}
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>

// // //             </div>
// // //           </div>

// // //         </CardContent>
// // //       </Card>
// // //     </form>
// // //   );
// // // }

// // // InvoiceControl.layout = (page) => <AdminLayout>{page}</AdminLayout>;

// // // export default InvoiceControl;






// // import AdminLayout from '@/Layouts/AdminLayout';
// // import React from 'react';
// // import { useForm } from '@inertiajs/react';

// // // shadcn components
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // function InvoiceControl({ settings }) {
// //   const { data, setData, post, processing, errors } = useForm({
// //     business_name: settings?.business_name || '',
// //     mobile_number: settings?.mobile_number || '',
// //     address: settings?.address || '',
// //     logo: null, 
// //     customer_copy: settings?.customer_copy || false,
// //     shop_copy: settings?.shop_copy || false,
// //     order_no: settings?.order_no || false,
// //     show_logo: settings?.show_logo || false,
// //     vertical_line_show: settings?.vertical_line_show || false,
// //     line_type: settings?.line_type || 'customizable',
// //     custom_line_width: settings?.custom_line_width || '',
// //     custom_line_type: settings?.custom_line_type || '',
// //     header_line_show: settings?.header_line_show ?? false,
// //     header_line_width: settings?.header_line_width ?? '',
// //     header_line_spacing: settings?.header_line_spacing ?? '',
// //   });

// //   const tailwindMarginOptions = [
// //     "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
// //     "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
// //     "20", "24", "28", "32", "36", "40", "44", "48", "52",
// //     "56", "60", "64", "72", "80", "96"
// //   ];

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     post(route('admin.invoice-control.store'), {
// //       preserveScroll: true,
// //       onSuccess: () => alert('Settings Saved Successfully!'),
// //     });
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-6">

// //       {/* Header Section */}
// //       <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm flex justify-between items-center">
// //         <div>
// //           <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
// //             Invoice Control
// //           </p>
// //           <h1 className="text-2xl font-bold mt-1 text-slate-900">
// //             Invoice Settings
// //           </h1>
// //           <p className="text-sm text-slate-500 mt-2">
// //             Manage your invoices and billing settings from this page.
// //           </p>
// //         </div>
        
// //         <Button type="submit" disabled={processing} className="px-6">
// //            {processing ? 'Saving...' : 'Save Settings'}
// //         </Button>
// //       </div>

// //       {/* Form Content */}
// //       <Card className="rounded-2xl shadow-sm border-slate-200">
// //         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

// //           {/* Basic Information */}
// //           <div className="space-y-3">
// //             <Label htmlFor="business_name">Business Name</Label>
// //             <Input 
// //               id="business_name" 
// //               placeholder="Enter business name" 
// //               value={data.business_name}
// //               onChange={(e) => setData('business_name', e.target.value)}
// //             />
// //           </div>

// //           <div className="space-y-3">
// //             <Label htmlFor="mobile_number">Mobile Number</Label>
// //             <Input 
// //               id="mobile_number" 
// //               type="tel" 
// //               placeholder="Enter mobile number" 
// //               value={data.mobile_number}
// //               onChange={(e) => setData('mobile_number', e.target.value)}
// //             />
// //           </div>

// //           <div className="space-y-3">
// //             <Label htmlFor="address">Address</Label>
// //             <Input 
// //               id="address" 
// //               placeholder="Enter address" 
// //               value={data.address}
// //               onChange={(e) => setData('address', e.target.value)}
// //             />
// //           </div>

// //           <div className="space-y-3">
// //             <Label htmlFor="logo_upload">Upload Logo</Label>
// //             <Input 
// //               id="logo_upload" 
// //               type="file" 
// //               className="cursor-pointer" 
// //               onChange={(e) => setData('logo', e.target.files[0])}
// //             />
// //             {settings?.logo_path && !data.logo && (
// //               <p className="text-xs text-green-600 mt-1">Logo already uploaded.</p>
// //             )}
// //           </div>

// //           {/* Invoice Options Section */}
// //           <div className="md:col-span-4 border-t pt-6 mt-2">
// //             <h3 className="text-lg font-semibold mb-4 text-slate-800">Invoice Elements</h3>
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

// //               <div className="flex items-center space-x-3">
// //                 <Checkbox 
// //                   id="customer_copy_check" 
// //                   checked={data.customer_copy}
// //                   onCheckedChange={(checked) => setData('customer_copy', !!checked)}
// //                 />
// //                 <Label htmlFor="customer_copy_check" className="cursor-pointer font-medium text-slate-700">
// //                   Customer Copy
// //                 </Label>
// //               </div>

// //               <div className="flex items-center space-x-3">
// //                 <Checkbox 
// //                   id="shop_copy_check" 
// //                   checked={data.shop_copy}
// //                   onCheckedChange={(checked) => setData('shop_copy', !!checked)}
// //                 />
// //                 <Label htmlFor="shop_copy_check" className="cursor-pointer font-medium text-slate-700">
// //                   Shop Copy
// //                 </Label>
// //               </div>

// //               <div className="flex items-center space-x-3">
// //                 <Checkbox 
// //                   id="order_no_check" 
// //                   checked={data.order_no}
// //                   onCheckedChange={(checked) => setData('order_no', !!checked)}
// //                 />
// //                 <Label htmlFor="order_no_check" className="cursor-pointer font-medium text-slate-700">
// //                   Order No
// //                 </Label>
// //               </div>

// //               <div className="flex items-center space-x-3">
// //                 <Checkbox 
// //                   id="logo_check" 
// //                   checked={data.show_logo}
// //                   onCheckedChange={(checked) => setData('show_logo', !!checked)}
// //                 />
// //                 <Label htmlFor="logo_check" className="cursor-pointer font-medium text-slate-700">
// //                   Show Logo
// //                 </Label>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Vertical Line Settings Section */}
// //           <div className="md:col-span-4 border-t pt-6">
// //             <h3 className="text-lg font-semibold mb-4 text-slate-800">Vertical Line & Type Settings</h3>

// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

// //               {/* Hide/Show Checkbox */}
// //               <div className="flex items-center space-x-3 h-10">
// //                 <Checkbox 
// //                   id="line_hide_show" 
// //                   checked={data.vertical_line_show}
// //                   onCheckedChange={(checked) => setData('vertical_line_show', !!checked)}
// //                 />
// //                 <Label htmlFor="line_hide_show" className="cursor-pointer font-medium text-slate-700">
// //                   Vertical Line Hide/Show
// //                 </Label>
// //               </div>

// //               {/* Radio Group */}
// //               <div className="space-y-4">
// //                 <Label>Line Type</Label>
// //                 <RadioGroup 
// //                   value={data.line_type} 
// //                   onValueChange={(val) => setData('line_type', val)}
// //                   className="flex flex-col gap-3"
// //                 >
// //                   <div className="flex items-center space-x-3">
// //                     <RadioGroupItem value="customizable" id="customizable" />
// //                     <Label htmlFor="customizable" className="cursor-pointer font-normal">Custom Line Width</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-3">
// //                     <RadioGroupItem value="non_customizable" id="non_customizable" />
// //                     <Label htmlFor="non_customizable" className="cursor-pointer font-normal">Optional Line Type</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>

// //               {/* Custom Line Input */}
// //               <div className="space-y-3">
// //                 <Label htmlFor="custom_line_px">Custom Line Width</Label>
// //                 <Input 
// //                   id="custom_line_px" 
// //                   placeholder="e.g. 15px" 
// //                   value={data.custom_line_width}
// //                   onChange={(e) => setData('custom_line_width', e.target.value)}
// //                 />
// //               </div>

// //               {/* Select Dropdown */}
// //               <div className="space-y-3">
// //                 <Label>Custom Line Type</Label>
// //                 <Select 
// //                   value={data.custom_line_type} 
// //                   onValueChange={(val) => setData('custom_line_type', val)}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select Custom Line Type" />
// //                   </SelectTrigger>
// //                   <SelectContent className="max-h-64">
// //                     {tailwindMarginOptions.map((margin) => (
// //                       <SelectItem key={`mt-${margin}`} value={`mt-${margin}`}>
// //                         mt-{margin}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //             </div>
// //           </div>

// //           {/* Header Divider Line Settings Section */}
// //           <div className="md:col-span-4 border-t pt-6">
// //             <h3 className="text-lg font-semibold mb-1 text-slate-800">Header Divider Line Settings</h3>
// //             <p className="text-sm text-slate-500 mb-4">
// //               This is the line below "Order No.", above the Name/Mobile/Order Date/Delivery boxes.
// //               Increasing spacing pushes everything below it down; decreasing brings it up.
// //             </p>

// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

// //               {/* Hide/Show Checkbox */}
// //               <div className="flex items-center space-x-3 h-10">
// //                 <Checkbox 
// //                   id="header_line_show_check" 
// //                   checked={data.header_line_show}
// //                   onCheckedChange={(checked) => setData('header_line_show', !!checked)}
// //                 />
// //                 <Label htmlFor="header_line_show_check" className="cursor-pointer font-medium text-slate-700">
// //                   Header Line Hide/Show
// //                 </Label>
// //               </div>

// //               {/* Thickness */}
// //               <div className="space-y-3">
// //                 <Label htmlFor="header_line_width">Line Thickness (px)</Label>
// //                 <Input 
// //                   id="header_line_width" 
// //                   type="number"
// //                   min="0"
// //                   placeholder="e.g. 2" 
// //                   value={data.header_line_width}
// //                   onChange={(e) => setData('header_line_width', e.target.value)}
// //                 />
// //               </div>

// //               {/* Spacing */}
// //               <div className="space-y-3">
// //                 <Label htmlFor="header_line_spacing">Spacing Above/Below (px)</Label>
// //                 <Input 
// //                   id="header_line_spacing" 
// //                   type="number"
// //                   min="0"
// //                   placeholder="e.g. 8" 
// //                   value={data.header_line_spacing}
// //                   onChange={(e) => setData('header_line_spacing', e.target.value)}
// //                 />
// //               </div>

// //             </div>
// //           </div>

// //         </CardContent>
// //       </Card>
// //     </form>
// //   );
// // }

// // InvoiceControl.layout = (page) => <AdminLayout>{page}</AdminLayout>;

// // export default InvoiceControl;













// import AdminLayout from '@/Layouts/AdminLayout';
// import React from 'react';
// import { useForm } from '@inertiajs/react';

// // shadcn components
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function InvoiceControl({ settings }) {
//   const { data, setData, post, processing, errors } = useForm({
//     business_name: settings?.business_name || '',
//     mobile_number: settings?.mobile_number || '',
//     address: settings?.address || '',
//     logo: null, 
//     customer_copy: settings?.customer_copy || false,
//     shop_copy: settings?.shop_copy || false,
//     order_no: settings?.order_no || false,
//     show_logo: settings?.show_logo || false,
//     vertical_line_show: settings?.vertical_line_show || false,
//     line_type: settings?.line_type || 'customizable',
//     custom_line_width: settings?.custom_line_width || '',
//     custom_line_type: settings?.custom_line_type || '',
//     header_line_show: settings?.header_line_show ?? false,
//     header_line_width: settings?.header_line_width ?? '',
//     header_line_spacing_top: settings?.header_line_spacing_top ?? '',
//     header_line_spacing_bottom: settings?.header_line_spacing_bottom ?? '',
//   });

//   const tailwindMarginOptions = [
//     "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
//     "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
//     "20", "24", "28", "32", "36", "40", "44", "48", "52",
//     "56", "60", "64", "72", "80", "96"
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     post(route('admin.invoice-control.store'), {
//       preserveScroll: true,
//       onSuccess: () => alert('Settings Saved Successfully!'),
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">

//       {/* Header Section */}
//       <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm flex justify-between items-center">
//         <div>
//           <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
//             Invoice Control
//           </p>
//           <h1 className="text-2xl font-bold mt-1 text-slate-900">
//             Invoice Settings
//           </h1>
//           <p className="text-sm text-slate-500 mt-2">
//             Manage your invoices and billing settings from this page.
//           </p>
//         </div>
        
//         <Button type="submit" disabled={processing} className="px-6">
//            {processing ? 'Saving...' : 'Save Settings'}
//         </Button>
//       </div>

//       {/* Form Content */}
//       <Card className="rounded-2xl shadow-sm border-slate-200">
//         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

//           {/* Basic Information */}
//           <div className="space-y-3">
//             <Label htmlFor="business_name">Business Name</Label>
//             <Input 
//               id="business_name" 
//               placeholder="Enter business name" 
//               value={data.business_name}
//               onChange={(e) => setData('business_name', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="mobile_number">Mobile Number</Label>
//             <Input 
//               id="mobile_number" 
//               type="tel" 
//               placeholder="Enter mobile number" 
//               value={data.mobile_number}
//               onChange={(e) => setData('mobile_number', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="address">Address</Label>
//             <Input 
//               id="address" 
//               placeholder="Enter address" 
//               value={data.address}
//               onChange={(e) => setData('address', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="logo_upload">Upload Logo</Label>
//             <Input 
//               id="logo_upload" 
//               type="file" 
//               className="cursor-pointer" 
//               onChange={(e) => setData('logo', e.target.files[0])}
//             />
//             {settings?.logo_path && !data.logo && (
//               <p className="text-xs text-green-600 mt-1">Logo already uploaded.</p>
//             )}
//           </div>

//           {/* Invoice Options Section */}
//           <div className="md:col-span-4 border-t pt-6 mt-2">
//             <h3 className="text-lg font-semibold mb-4 text-slate-800">Invoice Elements</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="customer_copy_check" 
//                   checked={data.customer_copy}
//                   onCheckedChange={(checked) => setData('customer_copy', !!checked)}
//                 />
//                 <Label htmlFor="customer_copy_check" className="cursor-pointer font-medium text-slate-700">
//                   Customer Copy
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="shop_copy_check" 
//                   checked={data.shop_copy}
//                   onCheckedChange={(checked) => setData('shop_copy', !!checked)}
//                 />
//                 <Label htmlFor="shop_copy_check" className="cursor-pointer font-medium text-slate-700">
//                   Shop Copy
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="order_no_check" 
//                   checked={data.order_no}
//                   onCheckedChange={(checked) => setData('order_no', !!checked)}
//                 />
//                 <Label htmlFor="order_no_check" className="cursor-pointer font-medium text-slate-700">
//                   Order No
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="logo_check" 
//                   checked={data.show_logo}
//                   onCheckedChange={(checked) => setData('show_logo', !!checked)}
//                 />
//                 <Label htmlFor="logo_check" className="cursor-pointer font-medium text-slate-700">
//                   Show Logo
//                 </Label>
//               </div>
//             </div>
//           </div>

//           {/* Vertical Line Settings Section */}
//           <div className="md:col-span-4 border-t pt-6">
//             <h3 className="text-lg font-semibold mb-4 text-slate-800">Vertical Line & Type Settings</h3>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

//               {/* Hide/Show Checkbox */}
//               <div className="flex items-center space-x-3 h-10">
//                 <Checkbox 
//                   id="line_hide_show" 
//                   checked={data.vertical_line_show}
//                   onCheckedChange={(checked) => setData('vertical_line_show', !!checked)}
//                 />
//                 <Label htmlFor="line_hide_show" className="cursor-pointer font-medium text-slate-700">
//                   Vertical Line Hide/Show
//                 </Label>
//               </div>

//               {/* Radio Group */}
//               <div className="space-y-4">
//                 <Label>Line Type</Label>
//                 <RadioGroup 
//                   value={data.line_type} 
//                   onValueChange={(val) => setData('line_type', val)}
//                   className="flex flex-col gap-3"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <RadioGroupItem value="customizable" id="customizable" />
//                     <Label htmlFor="customizable" className="cursor-pointer font-normal">Custom Line Width</Label>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <RadioGroupItem value="non_customizable" id="non_customizable" />
//                     <Label htmlFor="non_customizable" className="cursor-pointer font-normal">Optional Line Type</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Custom Line Input */}
//               <div className="space-y-3">
//                 <Label htmlFor="custom_line_px">Custom Line Width</Label>
//                 <Input 
//                   id="custom_line_px" 
//                   placeholder="e.g. 15px" 
//                   value={data.custom_line_width}
//                   onChange={(e) => setData('custom_line_width', e.target.value)}
//                 />
//               </div>

//               {/* Select Dropdown */}
//               <div className="space-y-3">
//                 <Label>Custom Line Type</Label>
//                 <Select 
//                   value={data.custom_line_type} 
//                   onValueChange={(val) => setData('custom_line_type', val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Custom Line Type" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-64">
//                     {tailwindMarginOptions.map((margin) => (
//                       <SelectItem key={`mt-${margin}`} value={`mt-${margin}`}>
//                         mt-{margin}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//             </div>
//           </div>

//           {/* Header Divider Line Settings Section */}
//           <div className="md:col-span-4 border-t pt-6">
//             <h3 className="text-lg font-semibold mb-1 text-slate-800">Header Divider Line Settings</h3>
//             <p className="text-sm text-slate-500 mb-4">
//               This is the line below "Order No.", above the Name/Mobile/Order Date/Delivery boxes.
//               Increasing spacing pushes everything below it down; decreasing brings it up.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

//               {/* Hide/Show Checkbox */}
//               <div className="flex items-center space-x-3 h-10">
//                 <Checkbox 
//                   id="header_line_show_check" 
//                   checked={data.header_line_show}
//                   onCheckedChange={(checked) => setData('header_line_show', !!checked)}
//                 />
//                 <Label htmlFor="header_line_show_check" className="cursor-pointer font-medium text-slate-700">
//                   Header Line Hide/Show
//                 </Label>
//               </div>

//               {/* Thickness */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_width">Line Thickness (px)</Label>
//                 <Input 
//                   id="header_line_width" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 2" 
//                   value={data.header_line_width}
//                   onChange={(e) => setData('header_line_width', e.target.value)}
//                 />
//               </div>

//               {/* Spacing Above */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_spacing_top">Spacing Above (px)</Label>
//                 <Input 
//                   id="header_line_spacing_top" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 8" 
//                   value={data.header_line_spacing_top}
//                   onChange={(e) => setData('header_line_spacing_top', e.target.value)}
//                 />
//               </div>

//               {/* Spacing Below */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_spacing_bottom">Spacing Below (px)</Label>
//                 <Input 
//                   id="header_line_spacing_bottom" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 8" 
//                   value={data.header_line_spacing_bottom}
//                   onChange={(e) => setData('header_line_spacing_bottom', e.target.value)}
//                 />
//               </div>

//             </div>
//           </div>

//         </CardContent>
//       </Card>
//     </form>
//   );
// }

// InvoiceControl.layout = (page) => <AdminLayout>{page}</AdminLayout>;

// export default InvoiceControl;


// import AdminLayout from '@/Layouts/AdminLayout';
// import React from 'react';
// import { useForm } from '@inertiajs/react';
// import { toast } from 'sonner';

// // shadcn components
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function InvoiceControl({ settings }) {
//   const { data, setData, post, processing, errors } = useForm({
//     business_name: settings?.business_name || '',
//     mobile_number: settings?.mobile_number || '',
//     address: settings?.address || '',
//     logo: null, 
//     customer_copy: settings?.customer_copy || false,
//     shop_copy: settings?.shop_copy || false,
//     order_no: settings?.order_no || false,
//     show_logo: settings?.show_logo || false,
//     vertical_line_show: settings?.vertical_line_show || false,
//     line_type: settings?.line_type || 'customizable',
//     custom_line_width: settings?.custom_line_width || '',
//     custom_line_type: settings?.custom_line_type || '',
//     header_line_show: settings?.header_line_show ?? false,
//     header_line_width: settings?.header_line_width ?? '',
//     header_line_spacing_top: settings?.header_line_spacing_top ?? '',
//     header_line_spacing_bottom: settings?.header_line_spacing_bottom ?? '',
//   });

//   const tailwindMarginOptions = [
//     "0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
//     "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
//     "20", "24", "28", "32", "36", "40", "44", "48", "52",
//     "56", "60", "64", "72", "80", "96"
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     post(route('admin.invoice-control.store'), {
//       preserveScroll: true,
//       onSuccess: () => {
//         toast.success('Settings saved successfully!');
//       },
//       onError: (errors) => {
//         const messages = Object.values(errors).flat();
//         if (messages.length > 0) {
//           toast.error('Please fix the following:', {
//             description: messages.join(' • '),
//           });
//         } else {
//           toast.error('Something went wrong. Please try again.');
//         }
//       },
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">

//       {/* Header Section */}
//       <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm flex justify-between items-center">
//         <div>
//           <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
//             Invoice Control
//           </p>
//           <h1 className="text-2xl font-bold mt-1 text-slate-900">
//             Invoice Settings
//           </h1>
//           <p className="text-sm text-slate-500 mt-2">
//             Manage your invoices and billing settings from this page.
//           </p>
//         </div>
        
//         <Button type="submit" disabled={processing} className="px-6">
//            {processing ? 'Saving...' : 'Save Settings'}
//         </Button>
//       </div>

//       {/* Form Content */}
//       <Card className="rounded-2xl shadow-sm border-slate-200">
//         <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

//           {/* Basic Information */}
//           <div className="space-y-3">
//             <Label htmlFor="business_name">Business Name</Label>
//             <Input 
//               id="business_name" 
//               placeholder="Enter business name" 
//               value={data.business_name}
//               onChange={(e) => setData('business_name', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="mobile_number">Mobile Number</Label>
//             <Input 
//               id="mobile_number" 
//               type="tel" 
//               placeholder="Enter mobile number" 
//               value={data.mobile_number}
//               onChange={(e) => setData('mobile_number', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="address">Address</Label>
//             <Input 
//               id="address" 
//               placeholder="Enter address" 
//               value={data.address}
//               onChange={(e) => setData('address', e.target.value)}
//             />
//           </div>

//           <div className="space-y-3">
//             <Label htmlFor="logo_upload">Upload Logo</Label>
//             <Input 
//               id="logo_upload" 
//               type="file" 
//               className="cursor-pointer" 
//               onChange={(e) => setData('logo', e.target.files[0])}
//             />
//             {settings?.logo_path && !data.logo && (
//               <p className="text-xs text-green-600 mt-1">Logo already uploaded.</p>
//             )}
//           </div>

//           {/* Invoice Options Section */}
//           <div className="md:col-span-4 border-t pt-6 mt-2">
//             <h3 className="text-lg font-semibold mb-4 text-slate-800">Invoice Elements</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="customer_copy_check" 
//                   checked={data.customer_copy}
//                   onCheckedChange={(checked) => setData('customer_copy', !!checked)}
//                 />
//                 <Label htmlFor="customer_copy_check" className="cursor-pointer font-medium text-slate-700">
//                   Customer Copy
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="shop_copy_check" 
//                   checked={data.shop_copy}
//                   onCheckedChange={(checked) => setData('shop_copy', !!checked)}
//                 />
//                 <Label htmlFor="shop_copy_check" className="cursor-pointer font-medium text-slate-700">
//                   Shop Copy
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="order_no_check" 
//                   checked={data.order_no}
//                   onCheckedChange={(checked) => setData('order_no', !!checked)}
//                 />
//                 <Label htmlFor="order_no_check" className="cursor-pointer font-medium text-slate-700">
//                   Order No
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <Checkbox 
//                   id="logo_check" 
//                   checked={data.show_logo}
//                   onCheckedChange={(checked) => setData('show_logo', !!checked)}
//                 />
//                 <Label htmlFor="logo_check" className="cursor-pointer font-medium text-slate-700">
//                   Show Logo
//                 </Label>
//               </div>
//             </div>
//           </div>

//           {/* Vertical Line Settings Section */}
//           <div className="md:col-span-4 border-t pt-6">
//             <h3 className="text-lg font-semibold mb-4 text-slate-800">Vertical Line & Type Settings</h3>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

//               {/* Hide/Show Checkbox */}
//               <div className="flex items-center space-x-3 h-10">
//                 <Checkbox 
//                   id="line_hide_show" 
//                   checked={data.vertical_line_show}
//                   onCheckedChange={(checked) => setData('vertical_line_show', !!checked)}
//                 />
//                 <Label htmlFor="line_hide_show" className="cursor-pointer font-medium text-slate-700">
//                   Vertical Line Hide/Show
//                 </Label>
//               </div>

//               {/* Radio Group */}
//               <div className="space-y-4">
//                 <Label>Line Type</Label>
//                 <RadioGroup 
//                   value={data.line_type} 
//                   onValueChange={(val) => setData('line_type', val)}
//                   className="flex flex-col gap-3"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <RadioGroupItem value="customizable" id="customizable" />
//                     <Label htmlFor="customizable" className="cursor-pointer font-normal">Custom Line Width</Label>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <RadioGroupItem value="non_customizable" id="non_customizable" />
//                     <Label htmlFor="non_customizable" className="cursor-pointer font-normal">Optional Line Type</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Custom Line Input */}
//               <div className="space-y-3">
//                 <Label htmlFor="custom_line_px">Custom Line Width</Label>
//                 <Input 
//                   id="custom_line_px" 
//                   placeholder="e.g. 15px" 
//                   value={data.custom_line_width}
//                   onChange={(e) => setData('custom_line_width', e.target.value)}
//                 />
//               </div>

//               {/* Select Dropdown */}
//               <div className="space-y-3">
//                 <Label>Custom Line Type</Label>
//                 <Select 
//                   value={data.custom_line_type} 
//                   onValueChange={(val) => setData('custom_line_type', val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Custom Line Type" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-64">
//                     {tailwindMarginOptions.map((margin) => (
//                       <SelectItem key={`mt-${margin}`} value={`mt-${margin}`}>
//                         mt-{margin}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//             </div>
//           </div>

//           {/* Header Divider Line Settings Section */}
//           <div className="md:col-span-4 border-t pt-6">
//             <h3 className="text-lg font-semibold mb-1 text-slate-800">Header Divider Line Settings</h3>
//             <p className="text-sm text-slate-500 mb-4">
//               This is the line below "Order No.", above the Name/Mobile/Order Date/Delivery boxes.
//               Increasing spacing pushes everything below it down; decreasing brings it up.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

//               {/* Hide/Show Checkbox */}
//               <div className="flex items-center space-x-3 h-10">
//                 <Checkbox 
//                   id="header_line_show_check" 
//                   checked={data.header_line_show}
//                   onCheckedChange={(checked) => setData('header_line_show', !!checked)}
//                 />
//                 <Label htmlFor="header_line_show_check" className="cursor-pointer font-medium text-slate-700">
//                   Header Line Hide/Show
//                 </Label>
//               </div>

//               {/* Thickness */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_width">Line Thickness (px)</Label>
//                 <Input 
//                   id="header_line_width" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 2" 
//                   value={data.header_line_width}
//                   onChange={(e) => setData('header_line_width', e.target.value)}
//                 />
//               </div>

//               {/* Spacing Above */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_spacing_top">Spacing Above (px)</Label>
//                 <Input 
//                   id="header_line_spacing_top" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 8" 
//                   value={data.header_line_spacing_top}
//                   onChange={(e) => setData('header_line_spacing_top', e.target.value)}
//                 />
//               </div>

//               {/* Spacing Below */}
//               <div className="space-y-3">
//                 <Label htmlFor="header_line_spacing_bottom">Spacing Below (px)</Label>
//                 <Input 
//                   id="header_line_spacing_bottom" 
//                   type="number"
//                   min="0"
//                   placeholder="e.g. 8" 
//                   value={data.header_line_spacing_bottom}
//                   onChange={(e) => setData('header_line_spacing_bottom', e.target.value)}
//                 />
//               </div>

//             </div>
//           </div>

//         </CardContent>
//       </Card>
//     </form>
//   );
// }

// InvoiceControl.layout = (page) => <AdminLayout>{page}</AdminLayout>;

// export default InvoiceControl;
import AdminLayout from '@/Layouts/AdminLayout';
import React from 'react';
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