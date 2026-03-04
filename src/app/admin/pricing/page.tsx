'use client'

import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2, DollarSign, Clock, ListChecks, ArrowLeft } from 'lucide-react'
import { fetchPricingPlans, savePricingPlans } from './actions'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function AdminPricingPage() {
    const [plans, setPlans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPricingPlans()
                if (data) setPlans(data)
                else {
                    // Default fallback if table is empty
                    setPlans([
                        { name: "Daily VIP", price: "$4.99", period: "24 Hours", features: ["VIP Access (24h)"] },
                        { name: "Weekly VIP", price: "$14.99", period: "7 Days", features: ["VIP Access (7d)"] },
                        { name: "Monthly VIP", price: "$39.00", period: "30 Days", features: ["VIP Access (30d)"] }
                    ])
                }
            } catch (e) {
                toast.error('Failed to load pricing plans')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await savePricingPlans(plans)
            toast.success('Pricing plans updated successfully!')
        } catch (e) {
            toast.error('Failed to save plans')
        } finally {
            setSaving(false)
        }
    }

    const updatePlan = (index: number, field: string, value: any) => {
        const newPlans = [...plans]
        newPlans[index] = { ...newPlans[index], [field]: value }
        setPlans(newPlans)
    }

    const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
        const newPlans = [...plans]
        newPlans[planIndex].features[featureIndex] = value
        setPlans(newPlans)
    }

    const addFeature = (planIndex: number) => {
        const newPlans = [...plans]
        newPlans[planIndex].features = [...newPlans[planIndex].features, "New Feature"]
        setPlans(newPlans)
    }

    const removeFeature = (planIndex: number, featureIndex: number) => {
        const newPlans = [...plans]
        newPlans[planIndex].features.splice(featureIndex, 1)
        setPlans(newPlans)
    }

    if (loading) return <div className="p-20 text-center text-zinc-500 italic uppercase font-black tracking-widest">Loading pricing module...</div>

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-all text-zinc-500 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                            Pricing <span className="text-yellow-500">Settings</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Configure your VIP subscription tiers.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[0_4px_20px_rgba(255,221,0,0.2)] disabled:opacity-50"
                >
                    {saving ? 'SAVING...' : <><Save size={18} /> SAVE CHANGES</>}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-8 relative group hover:border-yellow-500/20 transition-all duration-500 overflow-hidden">
                        {/* Plan Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-yellow-500/60 uppercase tracking-[0.3em]">Plan #{i + 1}</span>
                                <div className="size-8 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                                    <DollarSign size={16} />
                                </div>
                            </div>
                            <input
                                type="text"
                                value={plan.name}
                                onChange={(e) => updatePlan(i, 'name', e.target.value)}
                                className="w-full bg-transparent text-2xl font-black text-white uppercase tracking-tighter border-none focus:ring-0 p-0"
                                placeholder="Plan Name"
                            />
                        </div>

                        {/* Price & Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <DollarSign size={10} /> Price
                                </label>
                                <input
                                    type="text"
                                    value={plan.price}
                                    onChange={(e) => updatePlan(i, 'price', e.target.value)}
                                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-yellow-500 transition-colors"
                                    placeholder="$39.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock size={10} /> Period
                                </label>
                                <input
                                    type="text"
                                    value={plan.period}
                                    onChange={(e) => updatePlan(i, 'period', e.target.value)}
                                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-yellow-500 transition-colors"
                                    placeholder="30 Days"
                                />
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <ListChecks size={12} /> Features
                                </label>
                                <button
                                    onClick={() => addFeature(i)}
                                    className="text-[9px] font-black text-yellow-500 uppercase transition-colors hover:text-white"
                                >
                                    + ADD
                                </button>
                            </div>
                            <div className="space-y-2">
                                {plan.features.map((feature: string, fi: number) => (
                                    <div key={fi} className="flex gap-2 group/feat">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(i, fi, e.target.value)}
                                            className="flex-1 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-xs text-white/70 focus:border-yellow-500 transition-colors"
                                        />
                                        <button
                                            onClick={() => removeFeature(i, fi)}
                                            className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover/feat:opacity-100"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[60px] rounded-full pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    )
}
