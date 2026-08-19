import { DeveloperProfile } from '../types';
import muneebPhoto from '../assets/images/muneeb.jpg';
import tayyabPhoto from '../assets/images/tayyab.jpg';
import moizPhoto from '../assets/images/moiz.jpg';

/**
 * Central Developer Team Configuration
 * Developers: Muhammad Muneeb, Tayyab Rajput, Moiz Rajput
 */
export const DEVELOPER_TEAM: DeveloperProfile[] = [
  {
    id: 'muneeb',
    name: 'Muhammad Muneeb',
    studentId: '1387927',
    program: 'Bano Qabil – AI Essentials',
    role: 'Developer',
    photoUrl: muneebPhoto,
    githubUrl: 'https://github.com/muneebims',
    linkedinUrl: 'https://www.linkedin.com/in/muneebims'
  },
  {
    id: 'tayyab',
    name: 'Tayyab Rajput',
    studentId: '1382642',
    program: 'Bano Qabil – AI Essentials',
    role: 'Developer',
    photoUrl: tayyabPhoto
  },
  {
    id: 'moiz',
    name: 'Moiz Rajput',
    studentId: '1382646',
    program: 'Bano Qabil – AI Essentials',
    role: 'Developer',
    photoUrl: moizPhoto
  }
];

