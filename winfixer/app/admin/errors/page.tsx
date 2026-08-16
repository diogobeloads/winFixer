'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import ErrorCard from '@/components/ErrorCard';
import { ErrorType } from '@/types/database';

const AdminErrorsPage = () => {
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchErrors = async () => {
      const { data, error } = await supabase
        .from('errors')
        .select('*')
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching errors:', error);
      } else {
        setErrors(data);
      }
      setLoading(false);
    };

    fetchErrors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Errors</h1>
      <div className="grid grid-cols-1 gap-4">
        {errors.map((error) => (
          <ErrorCard key={error.id} error={error} />
        ))}
      </div>
    </div>
  );
};

export default AdminErrorsPage;