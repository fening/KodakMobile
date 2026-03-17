import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';

interface Record {
  id: number;
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  dh_miles: string | number;
  miles: string | number;
  fuel: string | number;
  food: string | number;
  lumper: string | number;
  pay: string | number;
}

const RecordDetail: React.FC = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axios.get(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setRecord(response.data);
      } catch (error) {
        console.error('There was an error fetching the record!', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('An error occurred while fetching the record. Please try again.');
        }
      }
    };

    fetchRecord();
  }, [id, navigate]);

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gray-500 animate-spin mr-2" />
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Record Detail</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">PO Number</h3>
            <p className="text-gray-600">{record.po_number}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Date</h3>
            <p className="text-gray-600">{record.date}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">From</h3>
            <p className="text-gray-600">{record.location_from}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">To</h3>
            <p className="text-gray-600">{record.location_to}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">DH Miles</h3>
            <p className="text-gray-600">{formatNumber(record.dh_miles)}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Miles</h3>
            <p className="text-gray-600">{formatNumber(record.miles)}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Fuel</h3>
            <p className="text-gray-600">${formatNumber(record.fuel)}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Food</h3>
            <p className="text-gray-600">${formatNumber(record.food)}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Lumper</h3>
            <p className="text-gray-600">${formatNumber(record.lumper)}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h3 className="font-semibold text-gray-700">Pay</h3>
            <p className="text-gray-600">${formatNumber(record.pay)}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-white flex justify-between">
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Link>
        <Link to={`/records/${record.id}/edit`} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </div>
    </div>
  );
};

export default RecordDetail;