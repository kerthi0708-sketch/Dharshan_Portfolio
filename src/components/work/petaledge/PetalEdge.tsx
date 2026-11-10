import Image from "next/image";
import { Reveal, WordsReveal } from "@/components/ui/Reveal";
import { Contribution, StackGroups } from "../shared";
import { DepthStack } from "./DepthStack";
import { Journey, type Stage } from "./Journey";
import { PrecisionPanel } from "./PrecisionPanel";

import labeling from "@/assets/work/petaledge/labeling.webp";
import aiLabeling from "@/assets/work/petaledge/ai-labeling.webp";
import dataAcq from "@/assets/work/petaledge/data-acquisition.webp";
import impulse from "@/assets/work/petaledge/impulse.webp";
import trainingLog from "@/assets/work/petaledge/training-log.webp";
import features from "@/assets/work/petaledge/features.webp";
import deployTarget from "@/assets/work/petaledge/deploy-target.webp";
import unoQ from "@/assets/work/petaledge/uno-q.webp";
import rpi from "@/assets/work/petaledge/raspberry-pi.webp";

/*
 * Every statement below is verified against the PetalEdge source
 * (edge.petalsautomation-dev): CreateProjectModal, Sidebar, samples/ingestion
 * endpoints, ai_labeling, dsp, model-display-names, ObjectDetectionTraining,
 * workers/queues, model_variants, PrecisionSelector, benchmarks/on_device,
 * DeploymentContent, deployment_worker and the user docs.
 */

const shot = "rounded-xl border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]";

const MODELS = [
  {
    name: "Vision Pro",
    tag: "Developer preview",
    body: "PetalEdge's own anchor-free object detector, written from scratch in Keras. Five sizes, from Nano (smallest, fastest) to Large.",
  },
  {
    name: "NanoVision",
    tag: "Default",
    body: "A compact detection architecture built for constrained devices. Its default input is 96×96 and it outputs a coarse heatmap grid instead of anchor boxes.",
  },
  {
    name: "MobileNetV2 0.35",
    tag: "Backbone",
    body: "The width-multiplier-0.35 MobileNetV2 that NanoVision runs on, chosen to keep the model small enough for edge targets.",
  },
];

const STAGES: Stage[] = [
  {
    key: "data",
    label: "Data",
    title: "Collect, label and split the dataset.",
    lead: "Choose an Image, Motion or Audio project, then bring data in from files, folders or connected devices.",
    points: [
      "Upload CSV, JSON, Parquet, WAV, images or video, with an automatic 80/20 train/test split.",
      "A bounding-box editor, plus AI Labeling: describe an object in plain text and review the proposed boxes.",
      "Motion data can stream live from an Arduino UNO Q or a Raspberry Pi over Web Serial.",
    ],
    visual: (
      <DepthStack
        layers={[
          { src: labeling, alt: "PetalEdge Data Labeling screen with a train/test split summary and a bounding box on a sample image", className: "relative z-10 w-[88%]", depth: 0.2 },
          { src: aiLabeling, alt: "PetalEdge AI Labeling screen proposing labelled boxes for a text prompt", className: "absolute bottom-0 right-0 z-20 w-[62%]", depth: 0.55 },
          { src: dataAcq, alt: "PetalEdge data acquisition uploader with automatic training/testing split", className: "absolute -top-[12%] right-[2%] z-0 w-[46%] opacity-70", depth: -0.25 },
        ]}
      />
    ),
  },
  {
    key: "train",
    label: "Train",
    title: "Design the impulse, then train on CPU or GPU.",
    lead: "An impulse links a processing block to a learning block. Training runs in the background and streams its logs back to the studio.",
    points: [
      "Processing blocks include Image, Spectral Analysis, Flatten, Raw Data and MFCC.",
      "Separate CPU and GPU training queues. A GPU request is never silently moved to CPU.",
      "Configurable cycles, learning rate, batch size and augmentation, with early stopping.",
    ],
    visual: (
      <DepthStack
        layers={[
          { src: impulse, alt: "PetalEdge impulse designer: image data, Image processing block, Object Detection learning block and output features", className: "relative z-10 w-[92%]", depth: 0.15 },
          { src: trainingLog, alt: "PetalEdge training output log for a completed training job", className: "absolute bottom-0 right-0 z-20 w-[48%]", depth: 0.6 },
          { src: features, alt: "PetalEdge feature generation and feature explorer scatter plot", className: "absolute -top-[14%] left-[30%] z-0 w-[50%] opacity-60", depth: -0.3 },
        ]}
      />
    ),
    extra: (
      <div className="mt-16 grid gap-3 sm:grid-cols-3">
        {MODELS.map((m, i) => (
          <Reveal key={m.name} delay={i * 80} className="rounded-2xl border border-edge/20 bg-edge/[0.04] p-5">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-edge">{m.tag}</p>
            <p className="mt-3 text-xl font-semibold text-fg">{m.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
          </Reveal>
        ))}
      </div>
    ),
  },
  {
    key: "optimize",
    label: "Optimize",
    title: "Export variants, compare them and measure on hardware.",
    lead: "A trained model is not finished until it fits the device. Each run exports TensorFlow Lite variants to compare before deploying.",
    points: [
      "Float32 and calibrated INT8 variants after every run; Float16 on demand.",
      "A precision picker recommends a variant and warns when INT8 is not suitable.",
      "On-device benchmarks on UNO Q and Raspberry Pi: median and p95 latency, load time and peak memory.",
    ],
    visual: <PrecisionPanel />,
  },
  {
    key: "deploy",
    label: "Deploy",
    title: "Package for the edge device.",
    lead: "Deployment produces a package for a specific target, checks it, and makes it downloadable.",
    points: [
      "Targets: Generic TensorFlow Lite (.pe), and Raspberry Pi or Arduino UNO Q (.pxe).",
      "A .pxe bundles the model, manifest, DSP config, labels and post-processing config.",
      "Every build runs TFLite validation, a smoke test and a golden test.",
    ],
    visual: (
      <div className="relative space-y-5">
        <Reveal>
          <Image src={deployTarget} alt="PetalEdge target device panel showing UNO Q with a .pxe package" className={shot} sizes="(min-width:1024px) 55vw, 92vw" placeholder="blur" />
        </Reveal>
        <div className="grid grid-cols-2 gap-5">
          <Reveal delay={120}>
            <figure>
              <Image src={unoQ} alt="Arduino UNO Q product visual from PetalEdge" className="aspect-[4/3] rounded-xl object-cover" sizes="(min-width:1024px) 27vw, 46vw" placeholder="blur" />
              <figcaption className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">Arduino UNO Q · .pxe</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={180}>
            <figure>
              <Image src={rpi} alt="Raspberry Pi product visual from PetalEdge" className="aspect-[4/3] rounded-xl object-cover" sizes="(min-width:1024px) 27vw, 46vw" placeholder="blur" />
              <figcaption className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">Raspberry Pi · .pxe</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    ),
  },
];

export function PetalEdge() {
  return (
    <article id="petaledge" aria-labelledby="petaledge-title" className="relative bg-[#070908] text-fg">
      {/* Opening */}
      <div className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-8 md:pt-36 lg:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-edge/[0.07] blur-[140px]" />
        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="eyebrow"><span className="text-edge">Flagship</span></p>
            <p className="eyebrow">Edge AI platform · 2026</p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 id="petaledge-title" className="display text-[clamp(3.6rem,12vw,11rem)]">
                <WordsReveal text="Petal" />
                <span className="text-edge"><WordsReveal text="Edge" /></span>
              </h3>
              <Reveal delay={150}>
                <p className="mt-8 max-w-xl text-xl leading-snug text-fg md:text-2xl">
                  An end-to-end Edge AI platform for building, training, optimizing and deploying
                  machine-learning models.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <p className="mt-6 font-serif text-2xl italic text-edge md:text-3xl">
                  From raw data to optimized models and Edge deployment.
                </p>
              </Reveal>
              <Reveal delay={300} className="mt-10 flex flex-wrap gap-2">
                {["Image", "Motion", "Audio"].map((t) => (
                  <span key={t} className="rounded-full border border-edge/30 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-edge">
                    {t} projects
                  </span>
                ))}
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:pt-6">
              <Contribution
                accent="var(--edge)"
                items={[
                  "Built the object detection pipeline end to end: data collection and labeling, training, model optimization and deployment to edge devices.",
                  "Built the motion recognition pipeline end to end: sensor and camera-landmark input, live device streaming, signal processing and gesture classification.",
                  "Built the project-type foundation that lets one studio run Image, Motion and Audio projects.",
                  "Built the model optimizer for exporting, comparing and choosing TensorFlow Lite variants.",
                  "Added visual anomaly detection and contributed to the audio pipeline.",
                ]}
                note="I designed and built PetalEdge's object detection and motion recognition pipelines."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-driven journey */}
      <Journey stages={STAGES} />

      {/* Architecture */}
      <div className="px-4 pb-28 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal className="mb-8 flex items-end justify-between border-b border-line pb-5">
            <p className="eyebrow">Architecture</p>
            <p className="eyebrow hidden sm:block">Studio · API · Workers · Storage</p>
          </Reveal>
          <StackGroups
            groups={[
              { label: "Studio", items: ["Next.js (App Router, static export)", "TypeScript", "Tailwind CSS", "Zustand", "SWR", "Recharts", "Konva"] },
              { label: "API", items: ["FastAPI", "SQLAlchemy + Alembic", "PostgreSQL", "JWT + Google Sign-In", "WebSockets for devices and live classification"] },
              { label: "Jobs & storage", items: ["Celery on Redis", "Separate CPU / GPU training queues", "DSP, deployment and post-processing queues", "S3-compatible storage (MinIO / S3)"] },
              { label: "ML", items: ["TensorFlow / Keras", "TensorFlow Lite", "PyTorch (OWL-ViT for AI Labeling)", "ONNX Runtime", "OpenCV", "librosa", "MediaPipe landmarks"] },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
