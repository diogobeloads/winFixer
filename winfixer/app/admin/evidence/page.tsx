'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import EvidenceBadge from '@/components/EvidenceBadge';

const EvidencePage = () => {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching evidence:', error);
      } else {
        setEvidence(data || []);
      }
      setLoading(false);
    };

    fetchEvidence();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Evidence</h1>
      <div className="space-y-4">
        {evidence.length === 0 ? (
          <p>No evidence found.</p>
        ) : (
          evidence.map((ev) => (
            <div key={ev.id} className="p-4 border rounded">
              <h2 className="font-semibold">{ev.title || 'Untitled'}</h2>
              <p className="text-sm text-gray-600">{ev.description}</p>
              <div className="mt-2">
                <EvidenceBadge evidenceType={ev.type || 'community'} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EvidencePage;