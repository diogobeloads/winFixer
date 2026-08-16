export type Error = {
  id: string;
  code: string;
  normalized_code: string;
  name?: string;
  title: string;
  description?: string;
  category?: string;
  severity?: string;
  aliases?: string[];
  seo_title?: string;
  seo_description?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ErrorContext = {
  id: string;
  error_id: string;
  name: string;
  slug: string;
  description?: string;
  operating_systems?: string[];
  symptoms?: string[];
  created_at: string;
};

export type Fix = {
  id: string;
  error_id: string;
  context_id: string;
  title: string;
  summary?: string;
  instructions?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'easy' | 'medium' | 'advanced' | 'expert';
  source_type?: string;
  source_url?: string;
  evidence_score: number;
  confidence_level: 'verified' | 'high' | 'medium' | 'low' | 'unknown';
  status: 'draft' | 'review' | 'testing' | 'verified' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
};

export type FixStep = {
  id: string;
  fix_id: string;
  step_number: number;
  title?: string;
  instruction: string;
  command?: string;
  expected_result?: string;
  warning?: string;
};

export type Evidence = {
  id: string;
  fix_id: string;
  evidence_type: string;
  source_name: string;
  source_url?: string;
  citation?: string;
  notes?: string;
  reliability?: number;
  verified_at?: string;
  created_at: string;
};

export type FixTest = {
  id: string;
  fix_id: string;
  windows_version?: string;
  windows_build?: string;
  architecture?: string;
  context?: string;
  result: 'success' | 'failure' | 'partial' | 'unknown';
  notes?: string;
  tested_at: string;
};

export type DiagnosticQuestion = {
  id: string;
  error_id: string;
  context_id: string;
  question: string;
  question_type: 'single_choice' | 'multiple_choice';
  options: Record<string, string>;
  order_index: number;
};

export type DiagnosticSession = {
  id: string;
  user_id?: string;
  error_id: string;
  context_id: string;
  answers: Record<string, any>;
  recommended_fix_id?: string;
  status: 'started' | 'in_progress' | 'completed' | 'resolved' | 'failed';
  created_at: string;
  completed_at?: string;
};

export type FixFeedback = {
  id: string;
  session_id: string;
  fix_id: string;
  result: 'worked' | 'did_not_work' | 'partially_worked' | 'not_attempted';
  notes?: string;
  created_at: string;
};