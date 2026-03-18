import { Link } from 'react-router-dom'
import {
  Github, Linkedin, ArrowRight, Cloud, Container, GitBranch,
  Monitor, Shield, Server, Terminal, Network
} from 'lucide-react'
import { config } from '../config'
import VisitorCounter from '../components/VisitorCounter'
import TechBadge from '../components/TechBadge'
import SectionHeading from '../components/SectionHeading'

const technologies = [
  { name: 'Kubernetes', icon: Container },
  { name: 'Docker', icon: Container },
  { name: 'Terraform', icon: Server },
  { name: 'Azure', icon: Cloud },
  { name: 'CI/CD', icon: GitBranch },
  { name: 'Prometheus', icon: Monitor },
  { name: 'Linux', icon: Terminal },
  { name: 'Networking', icon: Network },
  { name: 'Security', icon: Shield },
]

const certifications = [
  { name: 'CKA', fullName: 'Certified Kubernetes Administrator', color: 'from-blue-500 to-blue-700' },
  { name: 'Azure Admin', fullName: 'Microsoft Azure Administrator', color: 'from-sky-400 to-blue-600' },
  { name: 'Terraform', fullName: 'HashiCorp Terraform Associate', color: 'from-purple-500 to-purple-700' },
  { name: 'CCNA', fullName: 'Cisco Certified Network Associate', color: 'from-green-500 to-teal-600' },
]

const coreTech = [
  'Kubernetes', 'Docker', 'Terraform', 'Azure', 'AWS', 'GitHub Actions',
  'Prometheus', 'Grafana', 'ArgoCD', 'Helm', 'Ansible', 'Linux',
  'Python', 'Bash', 'Go', 'Cisco', 'Nginx', 'PostgreSQL',
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
                </span>
                Open to opportunities
              </div>
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Hi, I'm <span className="gradient-text">{config.name}</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-xl sm:text-2xl text-gray-400 font-medium mb-6">
              {config.title}
            </p>

            <p className="animate-fade-in-up animation-delay-300 max-w-2xl mx-auto text-gray-400 leading-relaxed mb-8">
              I design and build reliable, scalable cloud infrastructure. Specializing in Kubernetes orchestration,
              Infrastructure as Code, and CI/CD automation. Passionate about DevOps culture, site reliability,
              and bridging the gap between development and operations.
            </p>

            <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center justify-center gap-4 mb-10">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium transition-colors"
              >
                View Resume
              </Link>
              <div className="flex items-center gap-3">
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={config.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-500">
              <VisitorCounter />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Core Technologies" subtitle="The tools and platforms I work with daily to build and maintain infrastructure" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {technologies.map((tech, i) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.name}
                  className={`animate-fade-in-up opacity-0 animation-delay-${(i % 6 + 1) * 100} group flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-primary-500/30 transition-all`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center group-hover:bg-primary-600/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{tech.name}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {coreTech.map((tech) => (
              <TechBadge key={tech} name={tech} variant="outline" />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Certifications" subtitle="Industry-recognized certifications validating expertise" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="group relative p-5 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-gray-700 card-hover text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center`}>
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{cert.name}</h3>
                <p className="text-gray-400 text-sm">{cert.fullName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DevOps Highlights */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="What I Do" subtitle="End-to-end DevOps expertise from infrastructure to observability" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Cloud,
                title: 'Cloud Infrastructure',
                desc: 'Design and deploy scalable cloud architectures on Azure and AWS using Infrastructure as Code with Terraform and ARM templates.',
                items: ['Azure Landing Zones', 'Hub-Spoke Networks', 'Auto-scaling', 'Disaster Recovery'],
              },
              {
                icon: Container,
                title: 'Container Orchestration',
                desc: 'Build and manage production Kubernetes clusters with automated deployments, scaling policies, and service mesh integration.',
                items: ['AKS / EKS', 'Helm Charts', 'GitOps with ArgoCD', 'Service Mesh'],
              },
              {
                icon: GitBranch,
                title: 'CI/CD Pipelines',
                desc: 'Implement end-to-end CI/CD pipelines with automated testing, security scanning, and multi-environment deployments.',
                items: ['GitHub Actions', 'Azure DevOps', 'Blue-Green Deploys', 'Canary Releases'],
              },
              {
                icon: Monitor,
                title: 'Observability',
                desc: 'Deploy comprehensive monitoring, logging, and tracing stacks for full visibility into application and infrastructure health.',
                items: ['Prometheus & Grafana', 'Loki & Jaeger', 'SLI/SLO Tracking', 'Alerting'],
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-primary-500/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.items.map((tag) => (
                      <TechBadge key={tag} name={tag} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in working together?</h2>
          <p className="text-gray-400 mb-8">
            Check out my projects to see my work in action, or download my resume for a detailed overview of my experience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`mailto:${config.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
