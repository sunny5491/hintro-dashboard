import axios from 'axios';

export const API_BASE_URL = 'https://mock-backend-hintro.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// We'll set the x-user-id header dynamically in the context,
// or we can just pass it per request. Let's pass it per request via a wrapper function.
// Since the context holds the user ID, it's easier to expose functions that take userId.

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  login_method: string;
  status: string;
  is_hintro_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  plan: string;
  billing_cycle: string;
  status: string;
}

export interface Usage {
  kb_files: {
    used: number;
    limit: number;
    percentage: number;
  };
  vocab_terms: number;
  notes: number;
}

export interface DashboardData {
  user: UserProfile;
  subscription: Subscription | null;
  usage: Usage;
}

export interface CallStats {
  totalSessions: number;
  averageDuration: number;
  totalAIInteractions: number;
  lastSession: string[];
}

export interface CallParticipant {
  name: string;
  isUser: boolean;
}

export interface CallSession {
  _id: string;
  user_id: string;
  status: string;
  client: string;
  description: string;
  started_at: string;
  ended_at: string;
  total_duration_seconds: number;
  language: string[];
  auto_gen_ai_response: boolean;
  save_transcript: boolean;
  transcript: string | null;
  transcript_final: boolean;
  transcript_updated_at: string | null;
  ai_interactions: number;
  call_framework_id: string | null;
  participants: CallParticipant[];
  ended_reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallHistoryResponse {
  callSessions: CallSession[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const fetchProfile = async (userId: string): Promise<UserProfile> => {
  const { data } = await api.get('/api/auth/profile', { headers: { 'x-user-id': userId } });
  return data;
};

export const fetchDashboard = async (userId: string): Promise<DashboardData> => {
  const { data } = await api.get('/api/auth/dashboard', { headers: { 'x-user-id': userId } });
  return data;
};

export const fetchCallStats = async (userId: string): Promise<CallStats> => {
  const { data } = await api.get('/api/call-sessions/stats', { headers: { 'x-user-id': userId } });
  return data;
};

export const fetchCallHistory = async (userId: string, limit = 10): Promise<CallHistoryResponse> => {
  const { data } = await api.get(`/api/call-sessions?limit=${limit}`, { headers: { 'x-user-id': userId } });
  return data;
};
