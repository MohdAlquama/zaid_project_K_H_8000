// import AdminLayout from '@/Layouts/AdminLayout'
// import React from 'react'

// function CreateBilling() {
//   return (
//     <>
//       <div className="space-y-6">

//         {/* Header Section */}
//         <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
//           <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
//             Billing Management
//           </p>

//           <h1 className="text-2xl font-bold mt-1">
//             Billing & Invoice Dashboard
//           </h1>

//           <p className="text-sm text-slate-600 mt-2">
//             Manage customer billing, generate invoices, track payments, and maintain financial records efficiently.
//           </p>
//         </div>

//       <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">

//         </div>

//       </div>
//     </>
//   )
// }

// export default CreateBilling

// CreateBilling.layout = page => <AdminLayout children={page} />

import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";

// shadcn components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CreateBilling() {
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    // ================= STATES =================
    const [frames, setFrames] = useState([]);
    const [lenses, setLenses] = useState([]);
    const [advancePaid, setAdvancePaid] = useState(0);
    // ================= FRAMES =================
    const addFrame = () => {
        setFrames([...frames, { name: "", price: "" }]);
    };

    const removeFrame = (index) => {
        setFrames(frames.filter((_, i) => i !== index));
    };

    const handleFrameChange = (index, field, value) => {
        const updated = [...frames];
        updated[index][field] = value;
        setFrames(updated);
    };

    // ================= LENSES =================
    const addLens = () => {
        setLenses([
            ...lenses,
            {
                lensType: "",
                price: "",
                right: { sph: "", axis: "", va: "" },
                left: { sph: "", axis: "", va: "" },
            },
        ]);
    };

    const removeLens = (index) => {
        setLenses(lenses.filter((_, i) => i !== index));
    };

    const handleLensChange = (index, section, field, value) => {
        const updated = [...lenses];

        if (section === "right" || section === "left") {
            updated[index][section][field] = value;
        } else {
            updated[index][section] = value;
        }

        setLenses(updated);
    };
    const frameTotal = frames.reduce((sum, f) => sum + Number(f.price || 0), 0);
    const lensTotal = lenses.reduce((sum, l) => sum + Number(l.price || 0), 0);

    const netTotal = frameTotal + lensTotal;
    const balance = netTotal - Number(advancePaid || 0);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-2xl border bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Billing Management
                    </p>
                    <h1 className="text-2xl font-bold mt-1">
                        Billing & Invoice Dashboard
                    </h1>
                    <p className="text-sm text-slate-600 mt-2">
                        Manage customer billing, generate invoices, track
                        payments, and maintain records efficiently.
                    </p>
                </div>

                {/* Basic Form */}
                <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Customer Name */}
                        <div className="space-y-2">
                            <Label>Customer Name</Label>
                            <Input
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                placeholder="Enter customer name"
                            />
                        </div>

                        {/* Mobile Number 🔥 */}
                        <div className="space-y-2">
                            <Label>Mobile Number</Label>
                            <Input
                                value={mobileNumber}
                                onChange={(e) =>
                                    setMobileNumber(e.target.value)
                                }
                                placeholder="Enter mobile number"
                                maxLength={10}
                            />
                        </div>

                        {/* Order Date */}
                        <div className="space-y-2">
                            <Label>Order Date</Label>
                            <Input
                                type="date"
                                value={orderDate}
                                onChange={(e) => setOrderDate(e.target.value)}
                            />
                        </div>

                        {/* Delivery Date */}
                        <div className="space-y-2">
                            <Label>Delivery Date</Label>
                            <Input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) =>
                                    setDeliveryDate(e.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ================= FRAMES ================= */}
                <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Frames</h2>
                            <Button onClick={addFrame}>+ Add Frame</Button>
                        </div>

                        {frames.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No frames added yet
                            </p>
                        )}

                        {frames.map((frame, index) => (
                            <div
                                key={index}
                                className="grid md:grid-cols-3 gap-4 border p-4 rounded-xl items-end"
                            >
                                <div>
                                    <Label>Frame Name</Label>
                                    <Input
                                        value={frame.name}
                                        onChange={(e) =>
                                            handleFrameChange(
                                                index,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        value={frame.price}
                                        onChange={(e) =>
                                            handleFrameChange(
                                                index,
                                                "price",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <Button
                                    variant="destructive"
                                    onClick={() => removeFrame(index)}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* ================= LENSES ================= */}
                <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Lens</h2>
                            <Button onClick={addLens}>+ Add Lens</Button>
                        </div>

                        {lenses.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No lenses added yet
                            </p>
                        )}

                        {lenses.map((lens, index) => (
                            <div
                                key={index}
                                className="border rounded-xl p-5 space-y-4 relative"
                            >
                                {/* DELETE BUTTON TOP RIGHT */}
                                <div className="absolute top-4 right-4">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeLens(index)}
                                    >
                                        Delete
                                    </Button>
                                </div>

                                {/* Eye Inputs */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Right Eye */}
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Right Eye (OD)
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                placeholder="SPH"
                                                value={lens.right.sph}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "right",
                                                        "sph",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Input
                                                placeholder="AXIS"
                                                value={lens.right.axis}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "right",
                                                        "axis",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Input
                                                placeholder="VA"
                                                value={lens.right.va}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "right",
                                                        "va",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Left Eye (OS)
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                placeholder="SPH"
                                                value={lens.left.sph}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "left",
                                                        "sph",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Input
                                                placeholder="AXIS"
                                                value={lens.left.axis}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "left",
                                                        "axis",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Input
                                                placeholder="VA"
                                                value={lens.left.va}
                                                onChange={(e) =>
                                                    handleLensChange(
                                                        index,
                                                        "left",
                                                        "va",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Lens Type + Price */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Lens Type</Label>
                                        <Input
                                            placeholder="e.g. Single Vision"
                                            value={lens.lensType}
                                            onChange={(e) =>
                                                handleLensChange(
                                                    index,
                                                    "lensType",
                                                    null,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            value={lens.price}
                                            onChange={(e) =>
                                                handleLensChange(
                                                    index,
                                                    "price",
                                                    null,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                {/*  */}
                {/* ================= PAYMENT SUMMARY ================= */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Payment Summary
                        </h2>
                        <hr className="mt-2 border-gray-200" />
                    </div>

                    {/* Amount Inputs */}
                    <div className="grid md:grid-cols-3 gap-6 items-end">
                        {/* Advance Paid */}
                        <div className="space-y-2">
                            <Label>Advance Paid</Label>
                            <Input
                                type="number"
                                value={advancePaid}
                                onChange={(e) => setAdvancePaid(e.target.value)}
                                placeholder="Enter advance amount"
                            />
                        </div>

                        {/* Balance */}
                        <div className="space-y-2">
                            <Label>Balance Payable</Label>
                            <Input
                                value={balance}
                                readOnly
                                className="bg-gray-100 font-semibold"
                            />
                        </div>

                        {/* Net Total */}
                        <div className="space-y-2">
                            <Label>Net Total</Label>
                            <Input
                                value={netTotal}
                                readOnly
                                className="bg-gray-100 font-bold text-green-600"
                            />
                        </div>
                    </div>

                    {/* Extra Breakdown */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <p>Frames Total: ₹ {frameTotal}</p>
                        <p>Lenses Total: ₹ {lensTotal}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateBilling;

CreateBilling.layout = (page) => <AdminLayout children={page} />;
