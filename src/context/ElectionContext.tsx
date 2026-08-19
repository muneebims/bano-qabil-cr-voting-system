import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  runTransaction,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth } from '../firebase';
import {
  Candidate,
  VoteRecord,
  ElectionStatus,
  WinnerResult,
  ElectionState,
  DEFAULT_MAX_VOTES,
  ElectionHistoryItem
} from '../types';
import { INITIAL_CANDIDATES } from '../data/initialCandidates';
import { validateStudentId, generateReceiptCode } from '../utils/validation';
import { playCelebrationFanfare, playVoteSubmitChime } from '../utils/audio';

interface CastVoteResponse {
  success: boolean;
  message: string;
  receipt?: VoteRecord;
  isFinalVote?: boolean;
}

export interface VoteStatusResult {
  hasVoted: boolean;
  voteRecord?: VoteRecord;
  message: string;
  status: 'valid_voted' | 'valid_not_voted' | 'invalid_id' | 'unauthorized_id';
}

interface ElectionContextType {
  // Election state
  electionId: string;
  candidates: Candidate[];
  voteRecords: VoteRecord[];
  votedStudentIds: string[];
  status: ElectionStatus;
  maxVotes: number;
  totalVotes: number;
  remainingVotes: number;
  participationPercent: number;
  isFull: boolean;
  isCompleted: boolean;
  isActive: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  winnerResult: WinnerResult | null;
  soundEnabled: boolean;
  showWinnerModal: boolean;
  lastVoteReceipt: VoteRecord | null;
  electionHistory: ElectionHistoryItem[];

  // Admin Auth state
  adminUser: User | null;
  isAdminLoggedIn: boolean;

  // Actions
  castVote: (studentId: string, candidateId: string) => Promise<CastVoteResponse>;
  checkVoteStatus: (studentId: string) => Promise<VoteStatusResult>;
  verifyVoteStatus: (studentId: string) => VoteRecord | undefined;
  resetElectionData: () => Promise<{ success: boolean; message: string }>;
  updateMaxVotes: (newLimit: number) => Promise<{ success: boolean; message: string }>;
  togglePause: () => Promise<{ success: boolean; message: string }>;
  toggleSound: () => void;
  openWinnerModal: () => void;
  closeWinnerModal: () => void;
  clearLastVoteReceipt: () => void;
  playWinnerSound: () => void;
  simulateQuickVotes: (count: number, candidatePreference?: 'c1' | 'c2' | 'balanced') => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => Promise<void>;
  fetchElectionHistory: () => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | null>(null);

const CURRENT_ELECTION_DOC = 'current_election';
const COMMISSIONER_ADMIN_EMAIL = 'muhammadmuneebims@gmail.com';

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [electionState, setElectionState] = useState<ElectionState>({
    electionId: 'bq_cr_2025_v1',
    title: 'Bano Qabil CR Election 2025',
    version: 1,
    candidates: INITIAL_CANDIDATES.map(c => ({ ...c, votes: 0 })),
    voteRecords: [],
    votedStudentIds: [],
    status: 'ACTIVE',
    maxVotes: DEFAULT_MAX_VOTES,
    totalVotes: 0,
    soundEnabled: true,
    startedAt: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [lastVoteReceipt, setLastVoteReceipt] = useState<VoteRecord | null>(null);
  const [electionHistory, setElectionHistory] = useState<ElectionHistoryItem[]>([]);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Ref to track celebration fanfare trigger per election ID
  const celebrationTriggeredElectionId = useRef<string | null>(null);

  // Check if a Firebase User is authorized as Commissioner Administrator using /admins/{uid} and Firestore authorization
  const verifyAdminAuthorization = useCallback(async (user: User | null): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // 1. Check if user's UID is in /admins/{uid} collection
      const adminDocByUid = await getDoc(doc(db, 'admins', user.uid));
      if (adminDocByUid.exists()) {
        return true;
      }

      // 2. Check if user's email is in /admins/{email} collection
      if (user.email) {
        const adminDocByEmail = await getDoc(doc(db, 'admins', user.email.toLowerCase()));
        if (adminDocByEmail.exists()) {
          // Provision /admins/{uid} for seamless rule evaluations
          await setDoc(doc(db, 'admins', user.uid), {
            email: user.email.toLowerCase(),
            displayName: user.displayName || 'Commissioner',
            role: 'commissioner',
            authorizedAt: serverTimestamp()
          }, { merge: true });
          return true;
        }

        // 3. Check for designated primary commissioner email
        if (user.email.toLowerCase() === COMMISSIONER_ADMIN_EMAIL.toLowerCase()) {
          // Automatically seed the /admins/{uid} document so security rules evaluate exists(/admins/{uid}) to true
          await setDoc(doc(db, 'admins', user.uid), {
            email: user.email.toLowerCase(),
            displayName: user.displayName || 'Election Commissioner',
            role: 'commissioner',
            authorizedAt: serverTimestamp()
          }, { merge: true });
          return true;
        }
      }
    } catch (err) {
      console.warn('Admin authorization check notice:', err);
      if (user.email && user.email.toLowerCase() === COMMISSIONER_ADMIN_EMAIL.toLowerCase()) {
        return true;
      }
    }
    return false;
  }, []);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAuthAdmin = await verifyAdminAuthorization(user);
        if (isAuthAdmin) {
          setAdminUser(user);
          setIsAdminLoggedIn(true);
        } else {
          setAdminUser(null);
          setIsAdminLoggedIn(false);
        }
      } else {
        setAdminUser(null);
        setIsAdminLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [verifyAdminAuthorization]);

  // 1. REALTIME FIRESTORE LISTENER FOR THE CURRENT ELECTION
  useEffect(() => {
    setIsLoading(true);
    const electionDocRef = doc(db, 'elections', CURRENT_ELECTION_DOC);

    const unsubscribe = onSnapshot(
      electionDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const electionId = data.electionId || 'bq_cr_2025_v1';
          const maxVotes = typeof data.maxVotes === 'number' && data.maxVotes > 0 ? data.maxVotes : DEFAULT_MAX_VOTES;
          
          // Map candidates ensuring 0 baseline
          const candidatesData: Candidate[] = Array.isArray(data.candidates) && data.candidates.length > 0
            ? data.candidates.map((c: any) => ({
                ...c,
                votes: typeof c.votes === 'number' && !isNaN(c.votes) ? Math.max(0, c.votes) : 0
              }))
            : INITIAL_CANDIDATES.map(c => ({ ...c, votes: 0 }));

          const totalVotes = candidatesData.reduce((acc, c) => acc + c.votes, 0);
          const isCompleted = totalVotes >= maxVotes || data.status === 'COMPLETED';
          const currentStatus: ElectionStatus = isCompleted
            ? 'COMPLETED'
            : (data.status === 'PAUSED' ? 'PAUSED' : 'ACTIVE');

          setElectionState(prev => ({
            ...prev,
            electionId,
            title: data.title || 'Bano Qabil CR Election 2025',
            version: data.version || 1,
            candidates: candidatesData,
            status: currentStatus,
            maxVotes,
            totalVotes,
            startedAt: data.startedAt || prev.startedAt,
            completedAt: isCompleted ? (data.completedAt || new Date().toLocaleString()) : undefined,
            lastResetAt: data.lastResetAt
          }));
          setIsLoading(false);
        } else {
          // Initialize fresh election doc in Firestore with 0 votes
          const initialData = {
            electionId: 'bq_cr_2025_v1',
            title: 'Bano Qabil CR Election 2025',
            version: 1,
            candidates: INITIAL_CANDIDATES.map(c => ({ ...c, votes: 0 })),
            status: 'ACTIVE',
            maxVotes: DEFAULT_MAX_VOTES,
            totalVotes: 0,
            startedAt: new Date().toISOString(),
            createdAt: serverTimestamp()
          };

          try {
            await setDoc(electionDocRef, initialData);
            setElectionState(prev => ({
              ...prev,
              ...initialData,
              voteRecords: [],
              votedStudentIds: []
            }));
          } catch (initErr) {
            console.error('Failed to initialize election doc in Firestore', initErr);
          }
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        setError('Unable to connect to the voting server. Please check your network.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. REALTIME LISTENER FOR VOTE AUDIT RECORDS IN CURRENT ELECTION
  useEffect(() => {
    if (!electionState.electionId) return;

    const votesCollectionRef = collection(db, 'elections', electionState.electionId, 'votes');
    const votesQuery = query(votesCollectionRef, orderBy('voteNumber', 'desc'), limit(150));

    const unsubscribeVotes = onSnapshot(
      votesQuery,
      (snapshot) => {
        const records: VoteRecord[] = [];
        const studentIds: string[] = [];

        snapshot.forEach(docSnap => {
          const rec = docSnap.data() as VoteRecord;
          records.push(rec);
          if (rec.studentId && !studentIds.includes(rec.studentId)) {
            studentIds.push(rec.studentId);
          }
        });

        setElectionState(prev => ({
          ...prev,
          voteRecords: records,
          votedStudentIds: studentIds
        }));
      },
      (err) => {
        console.warn('Live votes listener notice:', err);
      }
    );

    return () => unsubscribeVotes();
  }, [electionState.electionId]);

  // Derived Values
  const maxVotes = electionState.maxVotes || DEFAULT_MAX_VOTES;
  const totalVotes = electionState.totalVotes || 0;
  const remainingVotes = Math.max(0, maxVotes - totalVotes);
  const participationPercent = Math.min(100, Math.round((totalVotes / maxVotes) * 100));
  const isFull = totalVotes >= maxVotes;
  const isCompleted = isFull || electionState.status === 'COMPLETED';
  const isPaused = electionState.status === 'PAUSED' && !isCompleted;
  const isActive = electionState.status === 'ACTIVE' && !isCompleted && !isPaused;

  // Calculate Winner
  const winnerResult: WinnerResult | null = React.useMemo(() => {
    const candidates = electionState.candidates;
    if (!candidates || candidates.length === 0) return null;

    const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
    const [c1, c2] = sorted;

    const isTie = c1 && c2 ? c1.votes === c2.votes : false;
    const winnerCandidate = isTie ? undefined : c1;
    const voteDifference = c1 && c2 ? Math.abs(c1.votes - c2.votes) : 0;

    return {
      isTie,
      winnerCandidate,
      candidates: sorted,
      totalVotes,
      maxVotes,
      voteDifference,
      completedAt: electionState.completedAt || new Date().toLocaleString()
    };
  }, [electionState.candidates, totalVotes, maxVotes, electionState.completedAt]);

  // Trigger celebration modal and audio on completion
  useEffect(() => {
    if (isCompleted && totalVotes >= maxVotes && celebrationTriggeredElectionId.current !== electionState.electionId) {
      celebrationTriggeredElectionId.current = electionState.electionId;
      setShowWinnerModal(true);
      if (electionState.soundEnabled) {
        playCelebrationFanfare();
      }
    }
  }, [isCompleted, totalVotes, maxVotes, electionState.electionId, electionState.soundEnabled]);

  // Synchronous Vote Check for UI helpers
  const verifyVoteStatus = useCallback((studentId: string): VoteRecord | undefined => {
    return electionState.voteRecords.find(r => r.studentId === studentId);
  }, [electionState.voteRecords]);

  // Check Vote Status from Firestore (Awaited with Full 5-State Support)
  const checkVoteStatus = useCallback(async (studentId: string): Promise<VoteStatusResult> => {
    // 1. Format validation
    const validation = validateStudentId(studentId);
    if (!validation.isValid || !validation.cleanId) {
      return {
        hasVoted: false,
        status: 'invalid_id',
        message: validation.error || 'Invalid Student ID. ID must be exactly 7 digits and start with 138 (e.g. 1384021).'
      };
    }

    const cleanId = validation.cleanId;

    // 2. Unauthorized Student ID check (e.g., test blacklist '1389999' or database roster status)
    if (cleanId === '1389999') {
      return {
        hasVoted: false,
        status: 'unauthorized_id',
        message: `Unauthorized Student ID. Student ID ${cleanId} is not registered in the authorized Bano Qabil cohort roster.`
      };
    }

    try {
      // Check Firestore authorized_students collection if seeded
      try {
        const authDocRef = doc(db, 'authorized_students', cleanId);
        const authSnap = await getDoc(authDocRef);
        if (authSnap.exists() && authSnap.data()?.authorized === false) {
          return {
            hasVoted: false,
            status: 'unauthorized_id',
            message: `Unauthorized Student ID. Student ID ${cleanId} is not eligible to vote in this election.`
          };
        }
      } catch {
        // Fallthrough if table not yet populated
      }

      // 3. Check Firestore voter ledger in active election
      const voterDocRef = doc(db, 'elections', electionState.electionId, 'voted_students', cleanId);
      const voterSnap = await getDoc(voterDocRef);

      if (voterSnap.exists()) {
        const voterData = voterSnap.data();
        const record: VoteRecord = {
          id: voterData.id || `VR-${cleanId}`,
          studentId: cleanId,
          candidateId: voterData.candidateId,
          candidateName: voterData.candidateName,
          timestamp: voterData.timestamp || 'Recorded',
          receiptCode: voterData.receiptCode || 'BQ-VERIFIED',
          voteNumber: voterData.voteNumber || 1
        };

        return {
          hasVoted: true,
          voteRecord: record,
          status: 'valid_voted',
          message: `You have already voted with Student ID ${cleanId}.`
        };
      }

      // 4. Eligible & Not Voted
      return {
        hasVoted: false,
        status: 'valid_not_voted',
        message: `You have not voted yet with Student ID ${cleanId}. You are eligible to cast your vote.`
      };
    } catch (err) {
      console.error('Error verifying vote status in Firestore:', err);
      // Local fallback
      const localRec = electionState.voteRecords.find(r => r.studentId === cleanId);
      if (localRec) {
        return {
          hasVoted: true,
          voteRecord: localRec,
          status: 'valid_voted',
          message: `You have already voted with Student ID ${cleanId}.`
        };
      }
      return {
        hasVoted: false,
        status: 'valid_not_voted',
        message: `You have not voted yet with Student ID ${cleanId}. Eligible to vote.`
      };
    }
  }, [electionState.electionId, electionState.voteRecords]);

  // SECURE ATOMIC VOTING VIA FIRESTORE TRANSACTION
  const castVote = useCallback(async (studentId: string, candidateId: string): Promise<CastVoteResponse> => {
    // 1. Format validation
    const validation = validateStudentId(studentId);
    if (!validation.isValid || !validation.cleanId) {
      return {
        success: false,
        message: validation.error || 'Student ID must be exactly 7 digits and start with 138.'
      };
    }
    const cleanId = validation.cleanId;

    // 2. Unauthorized ID check
    if (cleanId === '1389999') {
      return {
        success: false,
        message: 'Unauthorized Student ID. You are not registered in the active class roster.'
      };
    }

    try {
      const currentDocRef = doc(db, 'elections', CURRENT_ELECTION_DOC);

      // Execute atomic transaction
      const transactionResult = await runTransaction(db, async (transaction) => {
        // Read current election document
        const electionSnap = await transaction.get(currentDocRef);
        if (!electionSnap.exists()) {
          throw new Error('Unable to connect to the voting server. Election not initialized.');
        }

        const data = electionSnap.data();
        const electionId = data.electionId || 'bq_cr_2025_v1';
        const limitVotes = typeof data.maxVotes === 'number' && data.maxVotes > 0 ? data.maxVotes : DEFAULT_MAX_VOTES;

        // Check if Election is Active
        if (data.status === 'PAUSED') {
          throw new Error('Voting is temporarily paused by the commissioner.');
        }

        // Check if limit already reached or election completed
        const existingCandidates: Candidate[] = Array.isArray(data.candidates)
          ? data.candidates.map((c: any) => ({
              ...c,
              votes: typeof c.votes === 'number' && !isNaN(c.votes) ? Math.max(0, c.votes) : 0
            }))
          : INITIAL_CANDIDATES.map(c => ({ ...c, votes: 0 }));

        const currentTotal = existingCandidates.reduce((acc, c) => acc + c.votes, 0);

        if (currentTotal >= limitVotes || data.status === 'COMPLETED') {
          throw new Error('Election vote capacity limit reached.');
        }

        // Verify Candidate exists
        const candIndex = existingCandidates.findIndex(c => c.id === candidateId);
        if (candIndex === -1) {
          throw new Error('Selected candidate not found on ballot.');
        }

        // Check if Student ID has already voted in this specific election
        const voterDocRef = doc(db, 'elections', electionId, 'voted_students', cleanId);
        const voterSnap = await transaction.get(voterDocRef);

        if (voterSnap.exists()) {
          throw new Error('You have already cast your vote.');
        }

        // Atomic Increment
        const newTotalVotes = currentTotal + 1;
        if (newTotalVotes > limitVotes) {
          throw new Error('Election vote capacity limit reached.');
        }

        const targetCandidate = existingCandidates[candIndex];
        existingCandidates[candIndex] = {
          ...targetCandidate,
          votes: (targetCandidate.votes || 0) + 1
        };

        const isFinalVote = newTotalVotes >= limitVotes;
        const now = new Date();
        const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + now.toLocaleDateString();
        const receiptCode = generateReceiptCode(cleanId, targetCandidate.id, newTotalVotes);

        const newReceipt: VoteRecord = {
          id: `VR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          studentId: cleanId,
          candidateId: targetCandidate.id,
          candidateName: targetCandidate.name,
          timestamp: timestampStr,
          receiptCode,
          voteNumber: newTotalVotes
        };

        // 1. Mark student as voted in subcollection
        transaction.set(voterDocRef, {
          studentId: cleanId,
          candidateId: targetCandidate.id,
          candidateName: targetCandidate.name,
          timestamp: timestampStr,
          receiptCode,
          voteNumber: newTotalVotes,
          createdAt: serverTimestamp()
        });

        // 2. Add to votes ledger subcollection
        const voteAuditDocRef = doc(db, 'elections', electionId, 'votes', newReceipt.id);
        transaction.set(voteAuditDocRef, {
          ...newReceipt,
          createdAt: serverTimestamp()
        });

        // 3. Update main election document
        const updatePayload: any = {
          candidates: existingCandidates,
          totalVotes: newTotalVotes,
          status: isFinalVote ? 'COMPLETED' : data.status,
          updatedAt: serverTimestamp()
        };

        if (isFinalVote) {
          updatePayload.completedAt = now.toLocaleString();
        }

        transaction.update(currentDocRef, updatePayload);

        return {
          receipt: newReceipt,
          isFinalVote,
          candidateName: targetCandidate.name
        };
      });

      setLastVoteReceipt(transactionResult.receipt);

      // Play audio feedback
      if (electionState.soundEnabled) {
        if (transactionResult.isFinalVote) {
          playCelebrationFanfare();
        } else {
          playVoteSubmitChime();
        }
      }

      return {
        success: true,
        message: transactionResult.isFinalVote
          ? `Final ${maxVotes}th vote successfully recorded! Election is now COMPLETED.`
          : `Vote successfully cast for ${transactionResult.candidateName}!`,
        receipt: transactionResult.receipt,
        isFinalVote: transactionResult.isFinalVote
      };
    } catch (err: any) {
      console.error('castVote transaction failure:', err);
      return {
        success: false,
        message: err.message || 'Unable to connect to the voting server. Please try again.'
      };
    }
  }, [electionState.soundEnabled, maxVotes]);

  // Admin: Update Maximum Votes Limit in Firebase (Protected)
  const updateMaxVotes = useCallback(async (newLimit: number): Promise<{ success: boolean; message: string }> => {
    if (!isAdminLoggedIn || !auth.currentUser) {
      return { success: false, message: 'Unauthorized: Commissioner administrator login required.' };
    }

    if (newLimit < 1) {
      return { success: false, message: 'Maximum votes must be at least 1.' };
    }

    try {
      const currentDocRef = doc(db, 'elections', CURRENT_ELECTION_DOC);
      const docSnap = await getDoc(currentDocRef);
      if (!docSnap.exists()) {
        return { success: false, message: 'Election document not found.' };
      }

      const data = docSnap.data();
      const currentTotal = Array.isArray(data.candidates)
        ? data.candidates.reduce((acc: number, c: any) => acc + (c.votes || 0), 0)
        : 0;

      const isCompletedNow = currentTotal >= newLimit;

      await setDoc(currentDocRef, {
        ...data,
        maxVotes: newLimit,
        status: isCompletedNow ? 'COMPLETED' : (data.status === 'PAUSED' ? 'PAUSED' : 'ACTIVE'),
        completedAt: isCompletedNow ? (data.completedAt || new Date().toLocaleString()) : null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      return {
        success: true,
        message: `Maximum votes limit successfully updated to ${newLimit}.`
      };
    } catch (err: any) {
      console.error('Failed to update maxVotes:', err);
      return {
        success: false,
        message: err.message || 'Failed to update maximum votes limit.'
      };
    }
  }, [isAdminLoggedIn]);

  // Admin: Toggle Pause / Resume in Firebase (Protected)
  const togglePause = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!isAdminLoggedIn || !auth.currentUser) {
      return { success: false, message: 'Unauthorized: Commissioner administrator login required.' };
    }

    try {
      const currentDocRef = doc(db, 'elections', CURRENT_ELECTION_DOC);
      const docSnap = await getDoc(currentDocRef);
      if (!docSnap.exists()) {
        return { success: false, message: 'Election document not found.' };
      }

      const data = docSnap.data();
      if (data.status === 'COMPLETED' || totalVotes >= maxVotes) {
        return { success: false, message: 'Cannot pause an election that has already completed.' };
      }

      const nextStatus: ElectionStatus = data.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
      await setDoc(currentDocRef, {
        ...data,
        status: nextStatus,
        updatedAt: serverTimestamp()
      }, { merge: true });

      return {
        success: true,
        message: nextStatus === 'PAUSED' ? 'Voting has been PAUSED.' : 'Voting has RESUMED.'
      };
    } catch (err: any) {
      console.error('Failed to toggle pause in Firebase:', err);
      return {
        success: false,
        message: err.message || 'Failed to toggle pause state.'
      };
    }
  }, [isAdminLoggedIn, totalVotes, maxVotes]);

  // Admin: Reset / Start New Election in Firebase (Protected)
  const resetElectionData = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!isAdminLoggedIn || !auth.currentUser) {
      return { success: false, message: 'Unauthorized: Commissioner administrator login required.' };
    }

    try {
      const currentDocRef = doc(db, 'elections', CURRENT_ELECTION_DOC);
      const docSnap = await getDoc(currentDocRef);

      // 1. Archive previous election to election_history collection
      if (docSnap.exists()) {
        const oldData = docSnap.data();
        const oldCandidates: Candidate[] = Array.isArray(oldData.candidates) ? oldData.candidates : [];
        const oldTotal = oldCandidates.reduce((sum, c) => sum + (c.votes || 0), 0);

        if (oldTotal > 0 || oldData.status === 'COMPLETED') {
          const [c1, c2] = oldCandidates;
          const isTie = c1 && c2 && c1.votes === c2.votes;
          const winner = !isTie && c1 && c2 ? (c1.votes > c2.votes ? c1 : c2) : undefined;

          const historyDocRef = doc(collection(db, 'election_history'));
          await setDoc(historyDocRef, {
            electionId: oldData.electionId || `election_${Date.now()}`,
            title: oldData.title || 'Bano Qabil CR Election',
            startedAt: oldData.startedAt || new Date().toISOString(),
            completedAt: oldData.completedAt || new Date().toLocaleString(),
            maxVotes: oldData.maxVotes || maxVotes,
            totalVotes: oldTotal,
            candidates: oldCandidates,
            isTie,
            winnerName: winner?.name,
            winnerVotes: winner?.votes,
            archivedAt: serverTimestamp()
          });
        }
      }

      // 2. Create clean election document with 0 votes
      const newElectionId = `bq_cr_2025_v${Date.now()}`;
      const cleanCandidates = INITIAL_CANDIDATES.map(c => ({ ...c, votes: 0 }));

      await setDoc(currentDocRef, {
        electionId: newElectionId,
        title: 'Bano Qabil CR Election 2025',
        version: (electionState.version || 1) + 1,
        candidates: cleanCandidates,
        status: 'ACTIVE',
        maxVotes: electionState.maxVotes || DEFAULT_MAX_VOTES,
        totalVotes: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        lastResetAt: new Date().toLocaleString(),
        updatedAt: serverTimestamp()
      });

      // Clear local celebratory state
      celebrationTriggeredElectionId.current = null;
      setShowWinnerModal(false);
      setLastVoteReceipt(null);

      return {
        success: true,
        message: `New election initialized! All candidate votes reset to 0 / ${electionState.maxVotes || DEFAULT_MAX_VOTES}.`
      };
    } catch (err: any) {
      console.error('Failed to reset election in Firebase:', err);
      return {
        success: false,
        message: err.message || 'Failed to reset election.'
      };
    }
  }, [isAdminLoggedIn, electionState.version, electionState.maxVotes, maxVotes]);

  // Fetch Election History for Admin (Protected)
  const fetchElectionHistory = useCallback(async () => {
    try {
      const historyCollection = collection(db, 'election_history');
      const q = query(historyCollection, orderBy('archivedAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      const items: ElectionHistoryItem[] = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          electionId: d.electionId || docSnap.id,
          title: d.title || 'CR Election',
          startedAt: d.startedAt || '',
          completedAt: d.completedAt || '',
          maxVotes: d.maxVotes || DEFAULT_MAX_VOTES,
          totalVotes: d.totalVotes || 0,
          candidates: d.candidates || [],
          isTie: !!d.isTie,
          winnerName: d.winnerName,
          winnerVotes: d.winnerVotes
        });
      });
      setElectionHistory(items);
    } catch (err) {
      console.warn('Could not fetch election history:', err);
    }
  }, []);

  // Admin Login via Firebase Google Authentication (NO PASSWORDS)
  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      // Optional: prompt user to select account
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const isAuth = await verifyAdminAuthorization(user);

      if (!isAuth) {
        // Immediate sign out if unauthorized
        await signOut(auth);
        setAdminUser(null);
        setIsAdminLoggedIn(false);
        return {
          success: false,
          message: `Access Denied: Google account (${user.email || user.uid}) is not authorized as an Election Commissioner.`
        };
      }

      setAdminUser(user);
      setIsAdminLoggedIn(true);

      return {
        success: true,
        message: `Welcome Commissioner! Authenticated securely as ${user.displayName || user.email}.`
      };
    } catch (err: any) {
      console.error('Firebase Google Auth error during admin login:', err);
      let errorMsg = 'Google Sign-In failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in popup closed before completion.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Sign-in popup was blocked by browser. Please allow popups for this site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Only one sign-in window allowed at a time.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network connection error. Please check your internet connection.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      return {
        success: false,
        message: errorMsg
      };
    }
  }, [verifyAdminAuthorization]);

  // Admin Logout
  const logoutAdmin = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setAdminUser(null);
      setIsAdminLoggedIn(false);
    }
  }, []);

  // Sound toggle
  const toggleSound = useCallback(() => {
    setElectionState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  }, []);

  const openWinnerModal = useCallback(() => setShowWinnerModal(true), []);
  const closeWinnerModal = useCallback(() => setShowWinnerModal(false), []);
  const clearLastVoteReceipt = useCallback(() => setLastVoteReceipt(null), []);
  const playWinnerSound = useCallback(() => {
    if (electionState.soundEnabled) playCelebrationFanfare();
  }, [electionState.soundEnabled]);

  // Quick simulation helper for admin testing
  const simulateQuickVotes = useCallback(async (count: number, preference: 'c1' | 'c2' | 'balanced' = 'balanced') => {
    if (isCompleted || totalVotes >= maxVotes) return;

    const availableSlots = maxVotes - totalVotes;
    const votesToAdd = Math.min(count, availableSlots);
    if (votesToAdd <= 0) return;

    for (let i = 0; i < votesToAdd; i++) {
      const mockId = `138${Math.floor(1000 + Math.random() * 8999)}`;
      let candIdx = 0;
      if (preference === 'c1') candIdx = 0;
      else if (preference === 'c2') candIdx = 1;
      else candIdx = Math.random() > 0.5 ? 0 : 1;

      const chosen = electionState.candidates[candIdx] || electionState.candidates[0];
      await castVote(mockId, chosen.id);
    }
  }, [isCompleted, totalVotes, maxVotes, electionState.candidates, castVote]);

  return (
    <ElectionContext.Provider
      value={{
        electionId: electionState.electionId,
        candidates: electionState.candidates,
        voteRecords: electionState.voteRecords,
        votedStudentIds: electionState.votedStudentIds,
        status: electionState.status,
        maxVotes,
        totalVotes,
        remainingVotes,
        participationPercent,
        isFull,
        isCompleted,
        isActive,
        isPaused,
        isLoading,
        error,
        winnerResult,
        soundEnabled: electionState.soundEnabled,
        showWinnerModal,
        lastVoteReceipt,
        electionHistory,
        adminUser,
        isAdminLoggedIn,
        castVote,
        checkVoteStatus,
        verifyVoteStatus,
        resetElectionData,
        updateMaxVotes,
        togglePause,
        toggleSound,
        openWinnerModal,
        closeWinnerModal,
        clearLastVoteReceipt,
        playWinnerSound,
        simulateQuickVotes,
        loginWithGoogle,
        logoutAdmin,
        fetchElectionHistory
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
