import { Nav } from "@/components/Nav";
import { About } from "@/components/about/About";
import { Marquee } from "@/components/Marquee";
import { WorkIntro } from "@/components/work/WorkIntro";
import { PetalEdge } from "@/components/work/petaledge/PetalEdge";
import { CodeCraft } from "@/components/work/codecraft/CodeCraft";
import { Pramoj } from "@/components/work/pramoj/Pramoj";
import { PetalYellow } from "@/components/work/petalyellow/PetalYellow";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <About />
        <Experience />
        <Marquee />
        <section id="work" aria-labelledby="work-title">
          <WorkIntro />
          <PetalEdge />
          <CodeCraft />
          <Pramoj />
          <PetalYellow />
        </section>
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
