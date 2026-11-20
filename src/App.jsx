import LiquidGlassEngine from "./components/GlassEngine";
import VideoBackground from "./components/VideoBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialBar from "./components/SocialBar";
import ProfileBadge from "./components/ProfileBadge";
import HorizontalScroll from "./components/HorizontalScroll";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Placeholder from "./components/Placeholder";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import VisitorCounter from "./components/VisitorCounter";

export default function App() {
  return (
    <>
      <VideoBackground />
      <LiquidGlassEngine />
      <Navbar />
      <SocialBar />
      <VisitorCounter />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
