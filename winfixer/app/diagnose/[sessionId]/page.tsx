'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import DiagnosticQuestion from '@/components/DiagnosticQuestion';
import DiagnosticProgress from '@/components/DiagnosticProgress';
import FixFeedback from '@/components/FixFeedback';

const DiagnosePage = () => {
  const params = useParams();
  const sessionId = params?.sessionId as string | undefined;
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (sessionId) {
        const { data, error } = await supabase
          .from('diagnostic_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) {
          console.error('Error fetching session data:', error);
        } else {
          setSessionData(data);
        }
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const handleAnswer = (answer: any) => {
    setAnswers((prev: any) => ({ ...prev, [currentQuestionIndex]: answer }));
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleFeedback = (result: any) => {
    setFeedback(result);
    // Logic to save feedback to the database can be added here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sessionData) {
    return <div>No session data found.</div>;
  }

  return (
    <div>
      <h1>Diagnostic Session</h1>
      <DiagnosticProgress currentQuestionIndex={currentQuestionIndex} totalQuestions={sessionData.questions.length} />
      {currentQuestionIndex < sessionData.questions.length ? (
        <DiagnosticQuestion
          question={sessionData.questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <FixFeedback onFeedback={handleFeedback} />
      )}
    </div>
  );
};

export default DiagnosePage;