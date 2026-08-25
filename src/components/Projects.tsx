import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Section } from './Section';

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Section id="projects" title="Selected Projects">
      <div className="paper-rows">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </Section>
  );
}
