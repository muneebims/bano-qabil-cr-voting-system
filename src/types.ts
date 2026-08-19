export const DEFAULT_MAX_VOTES = 100;
export const MAX_TOTAL_VOTES = 100; // Kept for backwards compatibility fallback

export interface Candidate {
  id: string;
  name: string;
  rollNumber: string;
  track: string;
  batch: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  votes: number;
  color: string;
  accentColor: string;
  manifestoPoints: string[];
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface VoteRecord {
  id: string;
  studentId: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
  receiptCode: string;
  voteNumber: number;
}

export type ElectionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface WinnerResult {
  isTie: boolean;
  winnerCandidate?: Candidate;
  candidates: Candidate[];
  totalVotes: number;
  maxVotes: number;
  voteDifference: number;
  completedAt: string;
}

export interface ElectionHistoryItem {
  id: string;
  electionId: string;
  title: string;
  startedAt: string;
  completedAt: string;
  maxVotes: number;
  totalVotes: number;
  candidates: Candidate[];
  isTie: boolean;
  winnerName?: string;
  winnerVotes?: number;
}

export interface ElectionState {
  electionId: string;
  title: string;
  version: number;
  candidates: Candidate[];
  voteRecords: VoteRecord[];
  votedStudentIds: string[];
  status: ElectionStatus;
  maxVotes: number;
  totalVotes: number;
  soundEnabled: boolean;
  startedAt: string;
  completedAt?: string;
  lastResetAt?: string;
}

export interface DeveloperProfile {
  id: string;
  name: string;
  studentId: string;
  program: string;
  role: string;
  education?: string;
  bio?: string;
  skills?: string[];
  certifications?: string[];
  photoUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isLead?: boolean;
}

