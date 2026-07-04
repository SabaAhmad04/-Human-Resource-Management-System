import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Wallet,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const Payroll = () => {
  const salaryOverview = {
    monthly: 7500,
    yearly: 90000,
  }

  const salaryBreakdown = {
    basic: 3500,
    hra: 1500,
    conveyance: 500,
    medical: 300,
    special: 700,
    gross: 6500,
    pf: 1800,
    esi: 0,
    tds: 500,
    professionalTax: 200,
    totalDeductions: 2500,
    netPay: 7500,
  }

  const mockPayslips = [
    { id: 1, month: 'January 2026', gross: 7500, deductions: 2500, net: 5000, status: 'paid' },
    { id: 2, month: 'December 2023', gross: 7500, deductions: 2500, net: 5000, status: 'paid' },
    { id: 3, month: 'November 2023', gross: 7500, deductions: 2500, net: 5000, status: 'paid' },
    { id: 4, month: 'October 2023', gross: 7500, deductions: 2500, net: 5000, status: 'paid' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>

      {/* Salary Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
              <DollarSign size={28} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Salary</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salaryOverview.monthly)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center">
              <Wallet size={28} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Yearly Salary</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salaryOverview.yearly)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Salary Breakdown */}
      <Card title="Salary Breakdown">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <h3 className="text-sm font-semibold text-success-700 mb-4 flex items-center gap-2">
              <TrendingUp size={16} />
              Earnings
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.basic)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">HRA</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.hra)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Conveyance Allowance</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.conveyance)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Medical Allowance</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.medical)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Special Allowance</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.special)}</span>
              </div>
              <div className="flex justify-between py-2 bg-success-50 px-3 rounded-lg">
                <span className="font-semibold text-success-700">Gross Salary</span>
                <span className="font-bold text-success-700">{formatCurrency(salaryBreakdown.gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-sm font-semibold text-danger-700 mb-4 flex items-center gap-2">
              <TrendingDown size={16} />
              Deductions
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Provident Fund</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.pf)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">ESI</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.esi)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">TDS</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.tds)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-medium">{formatCurrency(salaryBreakdown.professionalTax)}</span>
              </div>
              <div className="flex justify-between py-2 bg-danger-50 px-3 rounded-lg">
                <span className="font-semibold text-danger-700">Total Deductions</span>
                <span className="font-bold text-danger-700">{formatCurrency(salaryBreakdown.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="mt-8 p-4 bg-primary-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary-700">Net Pay</span>
            <span className="text-2xl font-bold text-primary-700">{formatCurrency(salaryBreakdown.netPay)}</span>
          </div>
        </div>
      </Card>

      {/* Payslips */}
      <Card title="Payslips">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gross</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deductions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Net Pay</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockPayslips.map((payslip) => (
                <tr key={payslip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{payslip.month}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(payslip.gross)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatCurrency(payslip.deductions)}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(payslip.net)}</td>
                  <td className="px-4 py-4">
                    <Badge variant="success">{payslip.status}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="sm">
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Payroll
