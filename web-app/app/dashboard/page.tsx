"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"
import { motion } from "framer-motion"
import { API_URL } from '@/lib/constants'

// Add these interfaces for type safety
interface SkillData {
  name: string;
  value: number;
}

interface EducationData {
  name: string;
  value: number;
}

interface SimilarityData {
  score: string;
  count: number;
}

interface CandidateData {
  name: string;
  score: number;
}

interface StatusData {
  name: string;
  value: number;
}

const COLORS = [
  '#4299E1', // blue
  '#48BB78', // green
  '#ED64A6', // pink
  '#ECC94B', // yellow
  '#9F7AEA', // purple
]

const CHART_MARGIN = { top: 20, right: 30, left: 120, bottom: 20 }

const CustomLabel = ({ name, percent }: { name: string; percent: number }) => {
  if (percent < 0.05) return null; // Don't show labels for small segments
  return `${name}: ${(percent * 100).toFixed(0)}%`
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [skillsData, setSkillsData] = useState<SkillData[]>([])
  const [educationData, setEducationData] = useState<EducationData[]>([])
  const [similarityData, setSimilarityData] = useState<SimilarityData[]>([])
  const [candidatesData, setCandidatesData] = useState<CandidateData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [skills, education, similarity, candidates, status] = await Promise.all([
        fetch(`${API_URL}/api/analytics/skills`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
        fetch(`${API_URL}/api/analytics/education`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
        fetch(`${API_URL}/api/analytics/similarity-scores`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
        fetch(`${API_URL}/api/analytics/top-candidates`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
        fetch(`${API_URL}/api/analytics/selection-status`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()),
      ])

      setSkillsData(skills)
      setEducationData(education)
      setSimilarityData(similarity)
      setCandidatesData(candidates)
      setStatusData(status)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Resume Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Skills Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 Skills</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={skillsData} 
                layout="vertical" 
                margin={CHART_MARGIN}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickCount={6}
                  allowDecimals={false}
                  stroke="currentColor"
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  stroke="currentColor"
                  fontSize={12}
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Frequency']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={COLORS[0]}
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Education Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Education Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={educationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={CustomLabel}
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {educationData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(255,255,255,0.1)"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => value.length > 30 ? `${value.substring(0, 30)}...` : value}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Similarity Score Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Similarity Score Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={similarityData}
                margin={CHART_MARGIN}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="score"
                  stroke="currentColor"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill={COLORS[1]}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Candidates */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Candidates</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={candidatesData}
                margin={CHART_MARGIN}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name"
                  stroke="currentColor"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis 
                  stroke="currentColor"
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Match Score']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill={COLORS[2]}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Selection Status */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Candidate Selection Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={CHART_MARGIN}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}