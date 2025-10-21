import React from "react";
import { motion } from "framer-motion";
import { Cpu, Network, Flame, Database, Shield, Zap, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Technology {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  color: string;
  year: number;
  link?: string;
}

const technologies: Technology[] = [
  {
    id: "mntrk",
    name: "MNTRK",
    tagline: "Mastomys Natalensis Real-Time Tracker",
    description:
      "An intelligent biosurveillance platform tracking rodent vector movement using hybrid IoT and AI grid signals. Integrated with MoGrid for predictive outbreak control and environmental correlation analytics.",
    status: "Operational",
    icon: <Network className="h-6 w-6" />,
    color: "text-mostar-green",
    year: 2023,
  },
  {
    id: "deepcal",
    name: "DeepCAL",
    tagline: "Hybrid Logistic Suite",
    description:
      "Deep Contextual Adaptive Logistics — a hybrid intelligence engine coordinating distributed assets in real time. Merges Reinforcement Learning, Supply Chain Optimization, and Predictive Routing through NeonDB-driven AI nodes.",
    status: "Active",
    icon: <Cpu className="h-6 w-6" />,
    color: "text-mostar-cyan",
    year: 2024,
  },
  {
    id: "flameborn",
    name: "FlameBorn",
    tagline: "AI Tokenization Layer",
    description:
      "FlameBorn enables digital asset tokenization for AI behaviors, establishing identity and provenance in synthetic cognition. Integrated with MoStar's Oracle for proof-of-reason and memory attestation.",
    status: "Deployed",
    icon: <Flame className="h-6 w-6" />,
    color: "text-mostar-magenta",
    year: 2024,
  },
  {
    id: "radxflb",
    name: "RAD-X FLB",
    tagline: "Radiometric Analysis Engine",
    description:
      "An experimental fusion platform connecting radiometric environmental inputs to adaptive neural fields. Enables anomaly prediction for climate-linked biological events.",
    status: "Research",
    icon: <Database className="h-6 w-6" />,
    color: "text-mostar-yellow",
    year: 2023,
  },
  {
    id: "tsatsefly",
    name: "TsaTse Fly",
    tagline: "Micro-Surveillance AI",
    description:
      "A miniaturized surveillance AI designed for vector tracking, low-power mesh networking, and intelligent pathogen signal analysis. Operates autonomously under Overlord oversight.",
    status: "Active",
    icon: <Shield className="h-6 w-6" />,
    color: "text-mostar-light-blue",
    year: 2024,
  },
  {
    id: "mogrid",
    name: "MoGrid",
    tagline: "AI Signal Decision Network",
    description:
      "The cognitive substrate of MoStar Industries. MoGrid orchestrates decision routing, grid intelligence, and adaptive diagnostics across all AI nodes using NeonDB + FastAPI hybrid core.",
    status: "Core System",
    icon: <Zap className="h-6 w-6" />,
    color: "text-mostar-cyan",
    year: 2025,
  },
];

const Technologies: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-mostar-dark to-black">
      <Navbar />
      
      <main className="flex-1 text-white px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-mostar-light-blue">
                MoStar Technologies
              </h1>
              <p className="text-white/70 mt-2 font-mono text-sm">
                Evolutionary Intelligence Systems | Since 2021
              </p>
            </div>
            <Globe className="h-10 w-10 text-mostar-cyan animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-mostar-blue/30 transition-all"
              >
                <div className="flex items-center mb-3">
                  <div className={`${tech.color} mr-3`}>{tech.icon}</div>
                  <div>
                    <h3 className="text-xl font-display font-semibold">{tech.name}</h3>
                    <p className="text-white/60 text-sm">{tech.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  {tech.description}
                </p>
                <div className="flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-3">
                  <span>
                    <span className="font-mono text-mostar-cyan">{tech.status}</span> • {tech.year}
                  </span>
                  {tech.link && (
                    <a
                      href={tech.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mostar-light-blue hover:text-mostar-cyan transition"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 text-center text-white/50 font-mono text-xs"
          >
            © {new Date().getFullYear()} MoStar Industries — A Division of Adaptive Cognition Systems
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Technologies;
