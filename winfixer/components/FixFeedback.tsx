'use client';

import { useState } from 'react';

// Ajuste a tipagem das props de acordo com o que o componente já recebe
interface FixFeedbackProps {
  sessionId: string;
  fixId: string;
}

export default function FixFeedback({ sessionId, fixId }: FixFeedbackProps) {
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          fix_id: fixId,
          result: result,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar o feedback.');
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md">
        <p><strong>Sucesso!</strong> Seu feedback foi enviado e gravado com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">A solução funcionou?</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Resultado:</label>
          <select 
            value={result} 
            onChange={(e) => setResult(e.target.value)}
            required
            className="w-full border rounded p-2"
          >
            <option value="" disabled>Selecione uma opção...</option>
            <option value="success">Sim, resolveu meu problema</option>
            <option value="partial">Melhorou, mas não resolveu 100%</option>
            <option value="failed">Não, o problema continua</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações (opcional):</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border rounded p-2"
            placeholder="Detalhe o que aconteceu após aplicar a solução..."
          />
        </div>

        {errorMessage && (
          <p className="text-red-600 text-sm">{errorMessage}</p>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
        </button>
      </form>
    </div>
  );
}