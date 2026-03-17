import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Eye, Edit2, Trash2, Plus, ChevronUp, ChevronDown, Search } from 'lucide-react'

interface Record {
  id: number
  date: string
  po_number: string
  location_from: string
  location_to: string
  miles: number
  pay: number
}

type SortKey = keyof Record
type SortOrder = 'asc' | 'desc'

const RecordList: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRecords = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await axios.get('https://kodaklogisticsapi.up.railway.app/api/records/', {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      })
      setRecords(response.data)
    } catch (error) {
      console.error('There was an error fetching the records!', error)
      setError('Failed to fetch records. Please try again.')
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        await axios.delete(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        })
        fetchRecords()
      } catch (error) {
        console.error('There was an error deleting the record!', error)
        setError('Failed to delete record. Please try again.')
      }
    }
  }

  const handleSort = (key: SortKey) => {
    setSortOrder(sortOrder === 'asc' && sortKey === key ? 'desc' : 'asc')
    setSortKey(key)
  }

  const sortedRecords = [...records].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const filteredRecords = sortedRecords.filter(record =>
    Object.values(record).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Transport Records</h2>
        <Link to="/records/new" className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out">
          <Plus className="mr-2 h-5 w-5" />
          Add New Record
        </Link>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {['Date', 'PO Number', 'From', 'To', 'Miles', 'Pay', 'Actions'].map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => handleSort(header.toLowerCase().replace(' ', '_') as SortKey)}
                >
                  <div className="flex items-center cursor-pointer">
                    {header}
                    {sortKey === header.toLowerCase().replace(' ', '_') && (
                      sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{record.po_number}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{record.location_from}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{record.location_to}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{record.miles.toFixed(2)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">${record.pay.toFixed(2)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex space-x-3">
                    <Link to={`/records/${record.id}`} className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out">
                      <Eye className="h-5 w-5" />
                      <span className="sr-only">View</span>
                    </Link>
                    <Link to={`/records/${record.id}/edit`} className="text-yellow-600 hover:text-yellow-900 transition duration-150 ease-in-out">
                      <Edit2 className="h-5 w-5" />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecordList