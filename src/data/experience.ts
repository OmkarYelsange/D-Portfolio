// Only facts supplied by Omkar. Empty `points` render "Details to be added" until real responsibilities are filled in.
export interface Role { company: string; role: string; dates: string; current?: boolean; type: string; points: string[]; tech: string[] }
export const experience: Role[] = [
  { company: 'Autoline Industries Ltd.', role: 'Data Analyst', dates: 'June 2026 – Present', current: true, type: 'Full-time',
    points: ['Collected live sensor data from physical industrial grinding machines.'], tech: [] },
  { company: 'Autoline Industries Ltd.', role: 'Data Analyst Intern', dates: '', type: 'Internship', points: [], tech: [] },
  { company: 'Lumax Cornaglia Auto Technologies', role: 'Project Management Intern', dates: '', type: 'Internship', points: [], tech: [] },
  { company: 'Drushya Digital India Pvt. Ltd.', role: 'Full Stack Developer Intern', dates: '', type: 'Internship', points: [], tech: [] },
]
