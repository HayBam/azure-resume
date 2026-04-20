import { Download, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react'
import { resumeData } from '../data/resume'
import TechBadge from '../components/TechBadge'

export default function Resume() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-theme-primary mb-2">Resume</h1>
            <p className="text-theme-secondary">Professional experience and qualifications</p>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        {/* Work Experience */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary">Work Experience</h2>
          </div>

          <div className="space-y-8">
            {resumeData.experience.map((job, index) => (
              <div
                key={index}
                className="relative pl-8 border-l-2 border-theme-timeline hover:border-primary-500/50 transition-colors"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-theme-timeline-dot border-2 border-primary-500" />
                <div className="pb-2">
                  <h3 className="text-lg font-semibold text-theme-primary">{job.role}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mb-3">
                    <span className="text-primary-400 font-medium">{job.company}</span>
                    <span className="text-theme-faint">|</span>
                    <span className="text-theme-secondary">{job.period}</span>
                    <span className="text-theme-faint">|</span>
                    <span className="text-theme-muted">{job.location}</span>
                  </div>
                  <ul className="space-y-2">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="text-theme-secondary text-sm leading-relaxed flex gap-2">
                        <span className="text-accent-500 mt-1.5 shrink-0">&#8226;</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary">Certifications</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumeData.certifications.map((cert) => (
              <div
                key={cert.name}
                className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-primary-500/30 transition-colors duration-300"
              >
                <h3 className="text-theme-primary font-medium mb-1">{cert.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary text-sm">{cert.issuer}</span>
                  <span className="text-theme-muted text-sm">{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary">Technical Skills</h2>
          </div>

          <div className="space-y-6">
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-theme-secondary uppercase tracking-wider mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <TechBadge key={skill} name={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary">Education</h2>
          </div>

          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-theme-surface border border-theme transition-colors duration-300"
              >
                <h3 className="text-theme-primary font-semibold">{edu.degree}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-1">
                  <span className="text-primary-400">{edu.institution}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
