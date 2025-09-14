import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { translations } from "./translations";

// Vidéos dans le sous-dossier "videos"
import SylvainWin from "./assets/videos/sylvain_win.mp4";
import SylvainLose from "./assets/videos/sylvain_lose.mp4";
import JoeWin from "./assets/videos/joe_win.mp4";
import JoeLose from "./assets/videos/joe_lose.mp4";
import NicoWin from "./assets/videos/nico_win.mp4";
import NicoLose from "./assets/videos/nico_lose.mp4";

import Licorne from "./assets/licorne.png";

// Interface
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

export default function Results() {
  const [votes, setVotes] = useState([0, 0, 0]);
  const lang = (localStorage.getItem("lang") as keyof typeof translations) || "fr";

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "votes", "resultats"), (snap) => {
      const data = snap.data();
      if (data) {
        setVotes([data.candidat1 || 0, data.candidat2 || 0, data.candidat3 || 0]);
      }
    });
    return () => unsub();
  }, []);

  // Calculs
  const maxVotes = Math.max(...votes);
  const percentages = votes.map((v) => (maxVotes ? (v / maxVotes) * 100 : 0));
  const winners = votes.map((v) => v === maxVotes);

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], winVideo: SylvainWin, loseVideo: SylvainLose },
    { id: 1, nom: translations[lang].candidates[1], winVideo: JoeWin, loseVideo: JoeLose },
    { id: 2, nom: translations[lang].candidates[2], winVideo: NicoWin, loseVideo: NicoLose },
  ];

  return (
    <div
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
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          textShadow: "1px 1px 2px #aaa",
        }}
      >
        {translations[lang].voteTitle}
      </h1>

      {/* Licorne */}
      <motion.img
        src={Licorne}
        alt="Licorne"
        style={{ position: "absolute", top: "20%", width: 120 }}
        initial={{ x: -200 }}
        animate={{ x: 1000 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "2rem",
          flexWrap: "wrap",
          zIndex: 2,
        }}
      >
        {candidats.map((c, index) => {
          const isWinner = winners[index];
          return (
            <motion.div
              key={c.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
            >
              {/* Vidéo (toujours la même taille) */}
              <motion.video
                src={isWinner ? c.winVideo : c.loseVideo}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: 160,          // largeur fixe
                  height: 220,         // hauteur fixe
                  borderRadius: "12px", // coins arrondis
                  border: "4px solid white",
                  marginBottom: "0.5rem",
                  objectFit: "cover",   // garde le ratio et découpe si besoin
                  boxShadow: isWinner ? "0 0 20px gold" : "0 0 5px #aaa",
                }}
              />

              {/* Verre de bière animé */}
              <div
                style={{
                  width: 70,
                  height: 180,
                  border: "3px solid #B77F1C",
                  borderRadius: "0 0 20px 20px",
                  overflow: "hidden",
                  background: "#FFF8E1",
                  position: "relative",
                }}
              >
                <motion.div
                  style={{
                    backgroundColor: "#FFC107",
                    width: "100%",
                    borderRadius: "0 0 20px 20px",
                    position: "absolute",
                    bottom: 0,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${percentages[index]}%` }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  {/* Écume */}
                  <div
                    style={{
                      position: "absolute",
                      top: `${100 - percentages[index]}%`,
                      left: 0,
                      width: "100%",
                      height: 10,
                      background: "radial-gradient(circle at 50% 50%, #fff, transparent 70%)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Vague */}
                  <svg viewBox="0 0 100 10" style={{ width: "100%", height: 20, position: "absolute", bottom: 0 }}>
                    <motion.path
                      fill="#FFD54F"
                      d="M0 5 Q25 0 50 5 T100 5 V10 H0 Z"
                      animate={{
                        d: [
                          "M0 5 Q25 0 50 5 T100 5 V10 H0 Z",
                          "M0 4 Q25 1 50 4 T100 4 V10 H0 Z",
                        ],
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
                {/* Bulles */}
                {[...Array(5)].map((_, i) => (
                  <Bubble key={i} delay={i * 0.3} left={10 + i * 12} />
                ))}
              </div>

              {/* Nom + Votes */}
              <span
                style={{
                  marginTop: "0.5rem",
                  fontWeight: isWinner ? "bold" : "normal",
                  fontSize: isWinner ? "1.2rem" : "1rem",
                }}
              >
                {c.nom}
              </span>
              <span style={{ fontSize: "0.9rem", color: "#444" }}>
                {votes[index]} {translations[lang].vote} ({percentages[index].toFixed(1)}%)
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
