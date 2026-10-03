// Only facts supplied by Omkar. Add `points` (responsibilities) when you want bullet details under a role.
export interface Role { company: string; role: string; dates: string; current?: boolean; type: string; points: string[]; tech: string[] }
export const experience: Role[] = [
  { company: 'Autoline Industries Ltd', role: 'Data Analyst', dates: 'June 2026 – Present', current: true, type: 'Full-time',
    points: ['Collected live sensor data from physical industrial grinding machines.'], tech: [] },
  { company: 'Lumax Cornaglia Auto Technologies Pvt Ltd', role: 'Project Management Internship', dates: 'Jan 2026 – Feb 2026', type: 'Internship', points: [], tech: [] },
  { company: 'Drushya Digital India Pvt Ltd', role: 'Full Stack Development Internship', dates: 'Sept 2025 – Nov 2025', type: 'Internship', points: [], tech: [] },
]
