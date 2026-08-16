import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import EvidenceForm from '@/components/EvidenceForm';
import EvidenceList from '@/components/EvidenceList';

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
        setEvidence(data);
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
      <h1>Manage Evidence</h1>
      <EvidenceForm />
      <EvidenceList evidence={evidence} />
    </div>
  );
};

export default EvidencePage;