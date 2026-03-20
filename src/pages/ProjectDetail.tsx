import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Github, ExternalLink, FileText, Image } from 'lucide-react'
import projectsData from '../data/projects.json'
import TechBadge from '../components/TechBadge'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projectsData.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-primary-400 hover:text-primary-300 transition-colors">
          &larr; Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{project.title}</h1>
          <p className="text-lg text-gray-400 leading-relaxed">{project.shortDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            View Repository
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        </div>

        {/* Detailed Description */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Overview</h2>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
            <p className="text-gray-300 leading-relaxed">{project.detailedDescription}</p>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <Image className="w-4 h-4 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Architecture Diagram</h2>
          </div>
          <div className="p-8 rounded-xl bg-gray-900/50 border border-gray-800/50 flex flex-col items-center justify-center min-h-[300px]">
            <img
              src={project.architectureDiagram}
              alt={`${project.title} architecture diagram`}
              className="w-full rounded-lg"
            />
          </div>
        </section>

        {/* Documentation */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Documentation</h2>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
            <p className="text-gray-300 leading-relaxed">{project.documentation}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
