import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Record {
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  dh_miles: string;
  miles: string;
  fuel: string;
  food: string;
  lumper: string;
  pay: string;
}

const RecordForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record>({
    date: '',
    po_number: '',
    location_from: '',
    location_to: '',
    dh_miles: '',
    miles: '',
    fuel: '',
    food: '',
    lumper: '',
    pay: '',
  });
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchRecord = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('user') || '{}').access;
          const response = await axios.get(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecord(response.data);
        } catch (error) {
          console.error('Error fetching the record:', error);
          setError('Failed to fetch record. Please try again.');
        }
      };
      fetchRecord();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = JSON.parse(localStorage.getItem('user') || '{}').access;
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isEditing) {
        await axios.put(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, record, axiosConfig);
      } else {
        await axios.post('https://kodaklogisticsapi.up.railway.app/api/records/add/', record, axiosConfig);
      }
      navigate('/');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} the record:`, error);
      setError(`Failed to ${isEditing ? 'update' : 'create'} record. Please try again.`);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg md:p-10 lg:max-w-2xl">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit' : 'Add'} Transport Record
        </h3>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="sr-only">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Date"
                value={record.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="po_number" className="sr-only">PO Number</label>
              <input
                id="po_number"
                name="po_number"
                type="text"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="PO Number"
                value={record.po_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="location_from" className="sr-only">Location From</label>
              <input
                id="location_from"
                name="location_from"
                type="text"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Location From"
                value={record.location_from}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="location_to" className="sr-only">Location To</label>
              <input
                id="location_to"
                name="location_to"
                type="text"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Location To"
                value={record.location_to}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="dh_miles" className="sr-only">DH Miles</label>
              <input
                id="dh_miles"
                name="dh_miles"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="DH Miles"
                value={record.dh_miles}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="miles" className="sr-only">Miles</label>
              <input
                id="miles"
                name="miles"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Miles"
                value={record.miles}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fuel" className="sr-only">Fuel</label>
              <input
                id="fuel"
                name="fuel"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Fuel"
                value={record.fuel}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="food" className="sr-only">Food</label>
              <input
                id="food"
                name="food"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Food"
                value={record.food}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lumper" className="sr-only">Lumper</label>
              <input
                id="lumper"
                name="lumper"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Lumper"
                value={record.lumper}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="pay" className="sr-only">Pay</label>
              <input
                id="pay"
                name="pay"
                type="number"
                step="0.01"
                required
                className="block w-full px-4 py-3 text-lg md:text-xl border rounded-md focus:ring-2 focus:ring-black"
                placeholder="Pay"
                value={record.pay}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {isEditing ? 'Update' : 'Create'} Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
