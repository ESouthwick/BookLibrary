import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {},
}))

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: () => 'Bar Chart',
  Pie: () => 'Pie Chart',
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  Link: ({ children, to }: any) => `Link to ${to}: ${children}`,
  NavLink: ({ children, to, className }: any) => `NavLink to ${to}: ${children}`,
})) 