export type Category = 'Data Engineering' | 'Data Analytics' | 'Business Intelligence' | 'Machine Learning'
export interface Project {
  id: string; title: string; category: Category; shortDescription: string
  technologies: string[]; metrics: { label: string; value: string }[]
  github: string; dashboard?: string; featured: boolean
  problem: string; solution: string; insights: string[]; challenges: string[]; learnings: string[]; futureImprovements: string[]
}
const repo = 'https://github.com/OmkarYelsange/Data-Analytics-Projects'
const blank = { problem: '', solution: '', insights: [], challenges: [], learnings: [], futureImprovements: [] } // TODO: fill real content
export const projects: Project[] = [
  { id: 'goodcabs', title: 'GoodCabs Analytics Platform', category: 'Data Engineering',
    shortDescription: 'End-to-end pipeline turning raw transportation data into analytics-ready datasets and business insights.',
    technologies: ['AWS S3', 'Databricks', 'PySpark', 'SQL', 'Power BI'], metrics: [], github: repo, featured: true, ...blank },
  { id: 'ola', title: 'OLA Ride Analytics', category: 'Data Analytics',
    shortDescription: 'Analysis of ride bookings: revenue, cancellations, customer behaviour, vehicles and payments.',
    technologies: ['SQL', 'Power BI', 'Excel'], metrics: [{ label: 'Bookings', value: '100K+' }, { label: 'Attributes', value: '19' }], github: repo, featured: true, ...blank },
  { id: 'airbnb', title: 'Airbnb Market Analysis', category: 'Data Analytics',
    shortDescription: 'Cleaning, EDA and visualisation of listing data to understand pricing and market trends.',
    technologies: ['Python', 'Pandas', 'NumPy', 'EDA'], metrics: [{ label: 'Listings', value: '20,770' }, { label: 'Attributes', value: '22' }], github: repo, featured: true, ...blank },
  { id: 'zepto', title: 'Zepto Analytics Dashboard', category: 'Business Intelligence',
    shortDescription: 'Power BI dashboard for quick-commerce analytics.', technologies: ['Power BI', 'SQL'], metrics: [], github: repo, featured: true, ...blank },
  { id: 'm2', title: 'M2 Material Data Analysis', category: 'Business Intelligence',
    shortDescription: 'Data preparation, analysis and dashboarding of material data.', technologies: ['Excel', 'Power BI', 'SQL'], metrics: [], github: repo, featured: true, ...blank },
  { id: 'chatbot', title: 'AI Chatbot', category: 'Machine Learning',
    shortDescription: 'NLP chatbot served through a Flask app using the Gemini API.', technologies: ['Python', 'NLP', 'Flask', 'Gemini API'], metrics: [], github: 'https://github.com/OmkarYelsange', featured: false, ...blank },
]
