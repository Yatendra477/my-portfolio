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
import HorizontalLayout from "@/components/HorizontalLayout";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navigation />
      <HorizontalLayout>
        {/* Panel 1 — Home */}
        <div id="home-panel" style={{ width: "100%", height: "100%" }}>
          <Hero />
        </div>

        {/* Panel 2 — About */}
        <div id="about-panel" style={{ width: "100%", height: "100%" }}>
          <About />
        </div>

        {/* Panel 3 — Education */}
        <div id="education-panel" style={{ width: "100%", height: "100%" }}>
          <Education />
        </div>

        {/* Panel 4 — Skills */}
        <div id="skills-panel" style={{ width: "100%", height: "100%" }}>
          <Skills />
        </div>

        {/* Panel 5 — Experience */}
        <div id="experience-panel" style={{ width: "100%", height: "100%" }}>
          <Experience />
        </div>

        {/* Panel 6 — Projects */}
        <div id="projects-panel" style={{ width: "100%", height: "100%" }}>
          <Projects />
        </div>

        {/* Panel 7 — Certifications */}
        <div id="certifications-panel" style={{ width: "100%", height: "100%" }}>
          <Certifications />
        </div>

        {/* Panel 8 — Achievements */}
        <div id="achievements-panel" style={{ width: "100%", height: "100%" }}>
          <Achievements />
        </div>

        {/* Panel 9 — Resume */}
        <div id="resume-panel" style={{ width: "100%", height: "100%" }}>
          <Resume />
        </div>

        {/* Panel 10 — Testimonials */}
        <div id="testimonials-panel" style={{ width: "100%", height: "100%" }}>
          <Testimonials />
        </div>

        {/* Panel 11 — Contact */}
        <div id="contact-panel" style={{ width: "100%", height: "100%" }}>
          <Contact />
          <Footer />
        </div>
      </HorizontalLayout>
      <BackToTop />
    </>
  );
}
