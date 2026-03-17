import { Link } from 'react-router-dom'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import TechBadge from './TechBadge'

interface Project {
  id: string
  title: string
  shortDescription: string
  githubUrl: string
  technologies: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 card-hover">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors pr-4">
            {project.title}
          </h3>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary-400 transition-colors shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.slice(0, 5).map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
          {project.technologies.length > 5 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-500">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Repo
          </a>
        </div>
      </div>
    </div>
  )
}
