import { Navbar } from './components/Navbar';
import { Bio } from './components/Bio';
import { News } from './components/News';
import { Publications } from './components/Publications';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Talks } from './components/Talks';
import { Notes } from './components/Notes';
import { CustomSections } from './components/CustomSections';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { useTheme } from './hooks/useTheme';
import { profile } from './data/profile';
import { news } from './data/news';
import { publications } from './data/publications';
import { projects } from './data/projects';
import { services } from './data/services';
import { talks } from './data/talks';
import { notes } from './data/notes';
import { customSections } from './data/customSections';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div id="top" className="min-h-screen">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        nameEn={profile.nameEn}
        customSections={customSections}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <header id="about" className="scroll-mt-20">
          <Bio profile={profile} />
        </header>
        <News items={news} />
        <Publications publications={publications} ownName={profile.nameEn} />
        <Projects projects={projects} />
        <Services groups={services} />
        <Talks talks={talks} />
        <Notes notes={notes} />
        <CustomSections sections={customSections} />
      </main>
      <Footer name={profile.nameEn} />
      <BackToTop />
    </div>
  );
}
