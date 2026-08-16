import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ErrorCard from '../../../components/ErrorCard';
import { supabase } from '../../../lib/supabase/client';

const ErrorPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [errorData, setErrorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchErrorData = async () => {
      if (code) {
        const { data, error } = await supabase
          .from('errors')
          .select('*')
          .eq('normalized_code', code.toString().toLowerCase())
          .single();

        if (error) {
          setError(error.message);
        } else {
          setErrorData(data);
        }
        setLoading(false);
      }
    };

    fetchErrorData();
  }, [code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!errorData) {
    return <div>Error not found.</div>;
  }

  return (
    <div>
      <h1>{errorData.title}</h1>
      <ErrorCard error={errorData} />
      {/* Additional components and information can be added here */}
    </div>
  );
};

export default ErrorPage;