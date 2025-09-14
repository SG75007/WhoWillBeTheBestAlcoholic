import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "./translations";

import SylvainWin from "./assets/videos/sylvain__win.mp4";
import SylvainLose from "./assets/videos/sylvain__lose.mp4";
import JoeWin from "./assets/videos/joe__win.mp4";
import JoeLose from "./assets/videos/joe__lose.mp4";
import NicoWin from "./assets/videos/nico__win.mp4";
import NicoLose from "./assets/videos/nico__lose.mp4";

import Licorne from "./assets/licorne.png";

interface Candidat {
  id: number;
  nom: string;
  winVideo: string;
  loseVideo: string;
}

// Bulles réalistes
const Bubble = ({ delay, left }: { delay: number; left: number }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: -120, opacity: [0, 1, 0] }}
    transition={{ repeat: Infinity, duration: 2, delay }}
    style={{
      width: 6 + Math.random() * 4,
      height: 6 + Math.random() * 4,
      borderRadius: "50%",
      backgroundColor: "#FFF9C4",
      position: "absolute",
      bottom: 0,
      left,
    }}
  />
);

const Confetti = () => {
  const size = 5 + Math.random() * 8;
  const left = Math.random() * 100;
  const color = ["#FFC107","#FFEB3B","#FF9800","#F44336","#E91E63","#9C27B0"][Math.floor(Math.random()*6)];
  const shape = ["circle","square","triangle"][Math.floor(Math.random()*3)];
  const clipPath = shape === "circle" ? "circle(50%)" :
                   shape === "square" ? "none" :
                   "polygon(50% 0%, 0% 100%, 100% 100%)";

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        position: "absolute",
        left: `${left}%`,
        borderRadius: shape === "circle" ? "50%" : "0",
        clipPath,
        top: -10,
        zIndex: 10,
      }}
      animate={{
        y: 600 + Math.random()*100,
        x: [ -20,20,-10,10 ][Math.floor(Math.random()*4)],
        rotate: Math.random()*360,
      }}
      transition={{
        duration: 3 + Math.random()*2,
        repeat: Infinity,
        ease: "easeIn",
        delay: Math.random()*2,
      }}
    />
  )
};

export default function Results() {
  const [votes, setVotes] = useState([0, 0, 0]);
  const [jump, setJump] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const lang = (localStorage.getItem("lang") as keyof typeof translations) || "fr";

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "votes", "resultats"), (snap) => {
      const data = snap.data();
      if (data) setVotes([data.candidat1 || 0, data.candidat2 || 0, data.candidat3 || 0]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxVotes = Math.max(...votes);
  const percentages = votes.map(v => (maxVotes ? (v / maxVotes)*100 : 0));
  const winners = votes.map(v => v === maxVotes);

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], winVideo: SylvainWin, loseVideo: SylvainLose },
    { id: 1, nom: translations[lang].candidates[1], winVideo: JoeWin, loseVideo: JoeLose },
    { id: 2, nom: translations[lang].candidates[2], winVideo: NicoWin, loseVideo: NicoLose },
  ];

  return (
    <div
      onClick={() => setJump(true)}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #FFFBEB, #FFE0B2)",
        overflow: "hidden",
        padding: "2rem",
        position: "relative",
        cursor: "pointer"
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem", textShadow: "1px 1px 2px #aaa" }}>
        {translations[lang].voteTitle}
      </h1>

      {/* Licorne traverse tout l'écran */}
      <motion.img
        src={Licorne}
        alt="Licorne"
        style={{ position: "absolute", top: "20%", width: 120 }}
        animate={{
          x: [ -120, screenWidth + 120 ],
          y: jump ? [0, -100, 0] : [0],
        }}
        transition={{
          x: { repeat: Infinity, duration: 10, ease: "linear" },
          y: { duration: 0.5, ease: "easeOut" },
        }}
        onAnimationComplete={() => setJump(false)}
      />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", zIndex: 2 }}>
        {candidats.map((c) => {
          const isWinner = winners[c.id];
          return (
            <motion.div
              key={c.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: c.id*0.3, duration: 0.8 }}
            >
              <motion.video
                src={isWinner ? c.winVideo : c.loseVideo}
                autoPlay loop muted playsInline
                style={{
                  width: 160,
                  height: 220,
                  borderRadius: "12px",
                  border: "4px solid white",
                  marginBottom: "0.5rem",
                  objectFit: "cover",
                  boxShadow: isWinner ? "0 0 20px gold" : "0 0 5px #aaa"
                }}
              />
              <div style={{ width: 70, height: 180, border: "3px solid #B77F1C", borderRadius: "0 0 20px 20px", overflow: "hidden", background: "#FFF8E1", position: "relative" }}>
                <motion.div style={{ backgroundColor: "#FFC107", width: "100%", borderRadius: "0 0 20px 20px", position: "absolute", bottom: 0 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${percentages[c.id]}%` }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <div style={{ position: "absolute", top: `${100-percentages[c.id]}%`, left:0, width:"100%", height:10, background:"radial-gradient(circle at 50% 50%, #fff, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
                  <svg viewBox="0 0 100 10" style={{ width:"100%", height:20, position:"absolute", bottom:0 }}>
                    <motion.path fill="#FFD54F"
                      d="M0 5 Q25 0 50 5 T100 5 V10 H0 Z"
                      animate={{ d:["M0 5 Q25 0 50 5 T100 5 V10 H0 Z","M0 4 Q25 1 50 4 T100 4 V10 H0 Z"] }}
                      transition={{ repeat: Infinity, duration: 2, ease:"easeInOut" }}
                    />
                  </svg>
                </motion.div>
                {[...Array(5)].map((_, i) => <Bubble key={i} delay={i*0.3} left={10+i*12} />)}
              </div>
              <span style={{ marginTop: "0.5rem", fontWeight:isWinner ? "bold":"normal", fontSize: isWinner? "1.2rem":"1rem" }}>{c.nom}</span>
              <span style={{ fontSize:"0.9rem", color:"#444" }}>{votes[c.id]} {translations[lang].vote} ({percentages[c.id].toFixed(1)}%)</span>
              <AnimatePresence>
                {isWinner && [...Array(40)].map((_, i) => <Confetti key={i} />)}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
