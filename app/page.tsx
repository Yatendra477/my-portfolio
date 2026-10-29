import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import Resume from "@/components/Resume";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import {
  getSiteSettings,
  getSectionVisibility,
  getAboutHighlights,
  getAboutStats,
  getEducation,
  getSkillCategories,
  getExperience,
  getProjects,
  getCertifications,
  getAchievements,
  getTestimonials,
  getNavLinks,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all data in parallel
  const [
    settings,
    visibility,
    aboutHighlights,
    aboutStats,
    education,
    skillCategories,
    experience,
    projects,
    certifications,
    achievements,
    testimonials,
  ] = await Promise.all([
    getSiteSettings(),
    getSectionVisibility(),
    getAboutHighlights(),
    getAboutStats(),
    getEducation(),
    getSkillCategories(),
    getExperience(),
    getProjects(),
    getCertifications(),
    getAchievements(),
    getTestimonials(),
  ]);

  const navLinks = await getNavLinks(visibility);

  const showTestimonials = visibility.testimonials !== false && testimonials.length > 0;

  return (
    <>
      <LoadingScreen />
      <Navigation navLinks={navLinks} settings={settings} />
      <main>
        {visibility.home !== false && (
          <section id="home" className="pt-[var(--nav-h)] pb-3 bg-[#F4F4F9]">
            <Hero settings={settings} projects={projects} certifications={certifications} />
          </section>
        )}
        {visibility.about !== false && (
          <section id="about">
            <About
              settings={settings}
              highlights={aboutHighlights}
              stats={aboutStats}
              skillCategories={skillCategories}
            />
          </section>
        )}
        {visibility.education !== false && (
          <section id="education">
            <Education education={education} />
          </section>
        )}
        {visibility.skills !== false && (
          <section id="skills">
            <Skills skillCategories={skillCategories} />
          </section>
        )}
        {visibility.experience !== false && (
          <section id="experience">
            <Experience experience={experience} />
          </section>
        )}
        {visibility.projects !== false && (
          <section id="projects">
            <Projects projects={projects} />
          </section>
        )}
        {visibility.certifications !== false && (
          <section id="certifications">
            <Certifications certifications={certifications} />
          </section>
        )}
        {visibility.achievements !== false && (
          <section id="achievements">
            <Achievements achievements={achievements} />
          </section>
        )}
        {visibility.resume !== false && (
          <section id="resume">
            <Resume settings={settings} />
          </section>
        )}
        {showTestimonials && (
          <section id="testimonials">
            <Testimonials testimonials={testimonials} />
          </section>
        )}
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} navLinks={navLinks} />
      <BackToTop />
    </>
  );
}
