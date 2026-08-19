import { Candidate } from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'candidate-1',
    name: 'Muhammad Ahmed',
    rollNumber: 'BQ-WD-138402',
    track: 'Web & App Development',
    batch: 'Bano Qabil 3.0 / Batch 2025',
    tagline: 'Empowering Students with Tech Workshops, Open Source Collaboration & Fair Representation',
    bio: 'Dedicated full-stack enthusiast and active student coordinator. Dedicated to transparent communication between students and faculty, organizing weekly coding hackathons, and ensuring every student voice is heard.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    votes: 0,
    color: 'emerald',
    accentColor: '#10B981',
    manifestoPoints: [
      'Organize weekly peer-to-peer coding study circles & revision sessions before exams.',
      'Establish a dedicated class feedback portal for rapid faculty resolution.',
      'Facilitate study materials, lab note repositories, and recorded session sharing.',
      'Host career prep mock interviews and resume reviews with industry mentors.',
      'Advocate for extended lab hours and updated development tool licenses.'
    ],
    skills: ['React & Node.js', 'Team Leadership', 'Community Building', 'Public Speaking'],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'ahmed.cr@banoqabil.edu.pk'
    }
  },
  {
    id: 'candidate-2',
    name: 'Syed Hamza Ali',
    rollNumber: 'BQ-CS-138519',
    track: 'Cyber Security & Cloud',
    batch: 'Bano Qabil 3.0 / Batch 2025',
    tagline: 'Bridging Classroom Learning with Practical Industry Projects, Discipline & Student Welfare',
    bio: 'Passionate cyber security researcher and former batch organizer. Focused on building a collaborative environment, bridging the gap between theoretical knowledge and real-world internships.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    votes: 0,
    color: 'blue',
    accentColor: '#3B82F6',
    manifestoPoints: [
      'Bridge the gap between curriculum and industry by bringing guest tech speakers.',
      'Create project teams to build real-world client apps for portfolio building.',
      'Fair, transparent scheduling of assignment deadlines and project submissions.',
      'Dedicated mental wellness & stress-relief hack nights for class bonding.',
      'One-on-one doubt clearing sessions for students needing extra help.'
    ],
    skills: ['Cyber Security', 'Cloud Systems', 'Student Advocacy', 'Project Management'],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'hamza.cr@banoqabil.edu.pk'
    }
  }
];
