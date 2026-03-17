import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Record {
  id: number
  date: string
  po_number: string
  miles: number
  pay: number
}

interface DashboardData {
  totalMiles: number
  totalPay: number
  recordCount: number
  recentRecords: Record[]
  monthlyData: { month: string; miles: number; pay: number }[]
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get('https://kodaklogisticsapi.up.railway.app/api/dashboard/', {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate
          }
        })
        setDashboardData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to fetch dashboard data. Please try again.')
      }
    }

    fetchDashboardData()
  }, [startDate, endDate])

  if (error) return <div className="text-red-500 font-semibold text-center py-8">{error}</div>
  if (!dashboardData) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div></div>

  return (
    <div className="dashboard bg-white min-h-screen p-8">
      <div className="mb-8">
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            placeholder="End Date"
          />
          <button
            onClick={() => { setStartDate(null); setEndDate(null); }}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"
          >
            Clear Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Miles</h2>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.totalMiles.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Pay</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.totalPay)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Records</h2>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.recordCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Records</h2>
          <ul className="space-y-3">
            {dashboardData.recentRecords.map(record => (
              <li key={record.id} className="border-b border-gray-300 pb-2">
                <Link to={`/records/${record.id}`} className="text-gray-700 hover:text-black transition duration-300 ease-in-out">
                  <span className="font-semibold">{record.date}</span> - {record.po_number} - <span className="font-semibold">{formatCurrency(record.pay)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#4B5563" />
                <YAxis yAxisId="right" orientation="right" stroke="#1F2937" />
                <Tooltip formatter={(value, name) => [name === 'Pay' ? formatCurrency(value as number) : value, name]} />
                <Legend />
                <Bar yAxisId="left" dataKey="miles" fill="#4B5563" name="Miles" />
                <Bar yAxisId="right" dataKey="pay" fill="#1F2937" name="Pay" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link to="/records/new" className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
            Add New Record
          </Link>
          <Link to="/records" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
            View All Records
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
