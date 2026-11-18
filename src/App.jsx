import LiquidGlassEngine from "./components/GlassEngine";
import VideoBackground from "./components/VideoBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialBar from "./components/SocialBar";
import HorizontalScroll from "./components/HorizontalScroll";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Placeholder from "./components/Placeholder";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <VideoBackground />
      <LiquidGlassEngine />
      <Navbar />
      <SocialBar />
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
