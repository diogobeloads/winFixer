import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import FixCard from '@/components/FixCard';
import { Fix } from '@/types/database';

const FixesPage = () => {
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixes = async () => {
      const { data, error } = await supabase
        .from('fixes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching fixes:', error);
      } else {
        setFixes(data);
      }
      setLoading(false);
    };

    fetchFixes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Fixes</h1>
      <div className="grid grid-cols-1 gap-4">
        {fixes.map((fix) => (
          <FixCard key={fix.id} fix={fix} />
        ))}
      </div>
    </div>
  );
};

export default FixesPage;