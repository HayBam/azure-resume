import projectsData from '../data/projects.json'
import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'

export default function Projects() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="DevOps and cloud infrastructure projects demonstrating real-world expertise"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
