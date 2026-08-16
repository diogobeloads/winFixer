import React from 'react';

interface FixFeedbackProps {
  onFeedbackSubmit?: (result: any, notes?: any) => void;
  onFeedback?: (result: any) => void;
  [key: string]: any;
}

const FixFeedback: React.FC<FixFeedbackProps> = ({ onFeedbackSubmit, onFeedback }) => {
  const [result, setResult] = React.useState<any>('worked');
  const [notes, setNotes] = React.useState<any>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFeedbackSubmit) onFeedbackSubmit(result, notes);
    if (onFeedback) onFeedback(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Esta solução resolveu o problema?</h2>
      <div className="flex space-x-4">
        <label>
          <input
            type="radio"
            value="worked"
            checked={result === 'worked'}
            onChange={() => setResult('worked')}
          />
          Sim, resolveu
        </label>
        <label>
          <input
            type="radio"
            value="did_not_work"
            checked={result === 'did_not_work'}
            onChange={() => setResult('did_not_work')}
          />
          Não resolveu
        </label>
        <label>
          <input
            type="radio"
            value="partially_worked"
            checked={result === 'partially_worked'}
            onChange={() => setResult('partially_worked')}
          />
          Parcialmente
        </label>
      </div>
      <textarea
        placeholder="Notas adicionais..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Enviar Feedback
      </button>
    </form>
  );
};

export default FixFeedback;