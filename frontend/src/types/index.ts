export interface Case {
  _id: string;
  case_id: string;
  case_text: string;
  category: string;
  priority: string;
  status: string;
  start_date: string;
  next_hearing_date: string;
  last_hearing_date: string;
  pending_years: number;
  summary: string;
  created_at?: string;
  updated_at?: string;
} 