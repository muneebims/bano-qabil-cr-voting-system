/**
 * Bano Qabil Class Representative (CR) Voting System
 * Features:
 * - Real multi-device cloud synchronization powered by Firebase Firestore
 * - 0 initial votes (clean election slate)
 * - Configurable vote maximum cap (default 100)
 * - Atomic vote transactions preventing double voting (one student ID = one vote)
 * - Automatic winner & tie announcement
 * - Web Audio API celebration fanfare & confetti animation
 * - 7-digit 138-prefix ID verification & cryptographic receipts
 * - Full Commissioner Admin Portal with Pause/Resume, Reset, and Archive History
 * - Developer Team Recognition section
 */

import React, { useState } from 'react';
import { ElectionProvider, useElection } from './context/ElectionContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CandidatesSection } from './components/CandidatesSection';
import { DeveloperTeamSection } from './components/DeveloperTeamSection';
import { RulesSection } from './components/RulesSection';
import { AboutCRSection } from './components/AboutCRSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { VoteModal } from './components/VoteModal';
import { VerifyStatusModal } from './components/VerifyStatusModal';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import { AdminModal } from './components/AdminModal';
import { ManifestoModal } from './components/ManifestoModal';

const MainAppContent: React.FC = () => {
  const { showWinnerModal, closeWinnerModal, openWinnerModal } = useElection();

  const [voteModalOpen, setVoteModalOpen] = useState<boolean>(false);
  const [selectedCandidateForVote, setSelectedCandidateForVote] = useState<string | undefined>(undefined);
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [manifestoModalOpen, setManifestoModalOpen] = useState<boolean>(false);
  const [selectedCandidateForManifesto, setSelectedCandidateForManifesto] = useState<string | undefined>(undefined);

  const handleOpenVoteModal = (candidateId?: string) => {
    setSelectedCandidateForVote(candidateId);
    setVoteModalOpen(true);
  };

  const handleOpenManifestoModal = (candidateId?: string) => {
    setSelectedCandidateForManifesto(candidateId);
    setManifestoModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] bg-immersive-radial text-slate-100 selection:bg-[#00ff9c] selection:text-black font-sans overflow-x-hidden">
      {/* Background Dot Grid Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-dot-grid z-0" />

      {/* App Body Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onOpenVoteModal={() => handleOpenVoteModal()}
          onOpenVerifyModal={() => setVerifyModalOpen(true)}
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onOpenManifestoModal={() => handleOpenManifestoModal()}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero
            onOpenVoteModal={handleOpenVoteModal}
            onOpenVerifyModal={() => setVerifyModalOpen(true)}
            onOpenManifestoModal={() => handleOpenManifestoModal()}
          />

          <CandidatesSection
            onSelectCandidateToVote={handleOpenVoteModal}
            onOpenManifestoModal={handleOpenManifestoModal}
          />

          <DeveloperTeamSection />

          <RulesSection />

          <AboutCRSection />

          <ContactSection />
        </main>

        {/* Footer */}
        <Footer
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onOpenVerifyModal={() => setVerifyModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <VoteModal
        isOpen={voteModalOpen}
        onClose={() => {
          setVoteModalOpen(false);
          setSelectedCandidateForVote(undefined);
        }}
        initialCandidateId={selectedCandidateForVote}
        onViewWinner={openWinnerModal}
      />

      <VerifyStatusModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onOpenVoteModal={() => setVoteModalOpen(true)}
      />

      <WinnerCelebrationModal
        isOpen={showWinnerModal}
        onClose={closeWinnerModal}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      <ManifestoModal
        isOpen={manifestoModalOpen}
        onClose={() => {
          setManifestoModalOpen(false);
          setSelectedCandidateForManifesto(undefined);
        }}
        initialCandidateId={selectedCandidateForManifesto}
        onSelectCandidateToVote={handleOpenVoteModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <ElectionProvider>
      <MainAppContent />
    </ElectionProvider>
  );
}
