"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, FileType, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_URL } from '@/lib/constants'

export default function UploadPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<{ score: number; analysis: string } | null>(null)
  const { toast } = useToast()

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        toast({
          title: "File uploaded successfully",
          description: `File: ${acceptedFiles[0].name}`,
        })
      }
    }
  })

  const handleSubmit = async () => {
    if (!acceptedFiles.length || !jobDescription) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a resume and enter a job description.",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      formData.append('job_desc', jobDescription)

      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const result = await response.json()
      setAnalysis(result)
      
      toast({
        title: "Analysis Complete",
        description: `Match Score: ${result.score * 100}%`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Upload Your Resume</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resume</h2>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Drag & drop your resume here, or click to select</p>
              <p className="text-sm text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>
            </div>
            {acceptedFiles.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg flex items-center space-x-2">
                <FileType className="h-5 w-5" />
                <span>{acceptedFiles[0].name}</span>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px] mb-4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={handleSubmit} disabled={isLoading || !acceptedFiles.length || !jobDescription}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Match Resume'}
          </Button>
        </div>
      </motion.div>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg">
                <span className="font-medium text-lg">Match Score</span>
                <span className="text-2xl font-bold text-primary">{(analysis.score * 100).toFixed(1)}%</span>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Top Matching Qualifications</h3>
                  <ul className="list-none space-y-2">
                    <li><span className="font-medium">Programming languages:</span> The job description requires proficiency in one or more programming languages, and the resume mentions proficiency in Python, Java, C, C++, and JavaScript, which matches the requirement.</li>
                    <li><span className="font-medium">Software development experience:</span> The job description requires 4+ years of experience in software development, and the resume mentions experience as a software engineering virtual intern at Hewlett Packard Enterprise and Walmart Global Tech, which partially matches the requirement.</li>
                    <li><span className="font-medium">Problem-solving skills:</span> The job description requires strong problem-solving skills, and the resume mentions solving software engineering challenges, participating in coding competitions, and practicing on platforms like LeetCode, which matches the requirement.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Missing Skills</h3>
                  <ul className="list-none space-y-2">
                    <li><span className="font-medium">Cloud-based technologies:</span> The job description mentions experience with cloud-based technologies like Google Cloud or AWS as a nice-to-have, but the resume does not mention any experience with cloud-based technologies.</li>
                    <li><span className="font-medium">Machine learning or artificial intelligence:</span> The job description mentions knowledge of machine learning or artificial intelligence as a nice-to-have, but the resume only mentions building an AI-powered resume screening project, which is not directly related to machine learning or artificial intelligence.</li>
                    <li><span className="font-medium">Containerization and orchestration:</span> The job description mentions experience with containerization (e.g., Docker) and orchestration (e.g., Kubernetes) as a nice-to-have, but the resume does not mention any experience with these technologies.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Improvement Suggestions</h3>
                  <ul className="list-none space-y-2">
                    <li><span className="font-medium">Gain experience with cloud-based technologies:</span> Consider taking online courses or working on projects that involve cloud-based technologies like Google Cloud or AWS to enhance your skills.</li>
                    <li><span className="font-medium">Develop skills in machine learning or artificial intelligence:</span> Consider taking online courses or working on projects that involve machine learning or artificial intelligence to enhance your skills.</li>
                    <li><span className="font-medium">Highlight transferable skills:</span> While the resume mentions experience as a software engineering virtual intern, it would be helpful to highlight transferable skills like problem-solving, collaboration, and communication to demonstrate how they can be applied to a full-time software engineering role.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
