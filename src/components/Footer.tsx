import { Github, Linkedin, Mail } from 'lucide-react'
import { config } from '../config'

export default function Footer() {
  return (
    <footer className="border-t border-theme bg-theme-alt transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-theme-muted">
            &copy; {new Date().getFullYear()} {config.name}. Built with React & deployed on Azure.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-muted hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-muted hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${config.email}`}
              className="text-theme-muted hover:text-primary-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
