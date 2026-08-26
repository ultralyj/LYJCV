import { Bio } from './components/Bio';
import { News } from './components/News';
import { Publications } from './components/Publications';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Awards } from './components/Awards';
import { Notes } from './components/Notes';
import { CustomSections } from './components/CustomSections';
import { Footer } from './components/Footer';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { profile } from './data/profile';
import { news } from './data/news';
import { publications } from './data/publications';
import { projects } from './data/projects';
import { services } from './data/services';
import { awards } from './data/awards';
import { notes } from './data/notes';
import { customSections } from './data/customSections';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div id="top" className="site-container">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <main className="py-4">
        <header id="about" className="scroll-mt-20">
          <Bio profile={profile} />
        </header>
        <News items={news} />
        <Publications publications={publications} />
        <Projects projects={projects} />
        <Services groups={services} />
        <Awards awards={awards} />
        <Notes notes={notes} />
        <CustomSections sections={customSections} />
      </main>
      <Footer name={profile.nameEn} />
    </div>
  );
}
