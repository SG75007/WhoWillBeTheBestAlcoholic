import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import PhotoSylvainBad from "./assets/SG_Bad.png";
import PhotoNicoBad from "./assets/NB_Bad.png";
import PhotoJoeBad from "./assets/JC_Bad.png";
import Licorne from "./assets/licorne.png"; // ajoute ton image de licorne

interface Candidat {
  id: number;
  nom: string;
  image: string;
}

const translations = {
  fr: { title: "Résultats 🍻", candidates: ["Sylvain", "Jonathan", "Nicolas"] },
  en: { title: "Results 🍻", candidates: ["Sylvain", "Jonathan", "Nicholas"] },
  de: { title: "Ergebnisse 🍻", candidates: ["Sylvain", "Jonathan", "Nikolaus"] },
  zh: { title: "结果 🍻", candidates: ["西尔万", "乔纳森", "尼古拉斯"] },
  ja: { title: "結果 🍻", candidates: ["シルヴァン", "ジョナサン", "ニコラス"] },
  es: { title: "Resultados 🍻", candidates: ["Sylvain", "Jonathan", "Nicolás"] },
};

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
        setVotes([
          data.candidat1 || 0,
          data.candidat2 || 0,
          data.candidat3 || 0,
        ]);
      }
    });
    return () => unsub();
  }, []);

  // Trouver le maximum
  const maxVotes = Math.max(...votes);
  // Calculer le pourcentage par rapport au maximum
  const percentages = votes.map(v => maxVotes ? (v / maxVotes) * 100 : 0);
  const maxIndex = votes.indexOf(Math.max(...votes));

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], image: PhotoSylvainBad },
    { id: 1, nom: translations[lang].candidates[1], image: PhotoJoeBad },
    { id: 2, nom: translations[lang].candidates[2], image: PhotoNicoBad },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, #FFFBEB, #FFE0B2)", overflow: "hidden", padding: "2rem", position: "relative" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem", textShadow: "1px 1px 2px #aaa" }}>{translations[lang].title}</h1>

      {/* Licorne qui traverse */}
      <motion.img
        src={Licorne}
        alt="Licorne"
        style={{ position: "absolute", top: "20%", width: 120 }}
        initial={{ x: -200 }}
        animate={{ x: 1000 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "3rem", zIndex: 2 }}>
        {candidats.map((c, index) => {
          const isWinner = index === maxIndex;
          return (
            <motion.div
              key={c.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
            >
              {/* Image */}
              <motion.img
                src={c.image}
                alt={c.nom}
                style={{
                  width: isWinner ? 140 : 100,
                  height: isWinner ? 140 : 100,
                  borderRadius: "50%",
                  border: "4px solid white",
                  marginBottom: "0.5rem",
                  zIndex: 2,
                  boxShadow: isWinner ? "0 0 20px gold" : "0 0 5px #aaa"
                }}
                animate={isWinner ? { rotate: [0, 15, -15, 0], scale: [1, 1.3, 1, 1.3] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              {/* Verre de bière avec vague */}
              <div style={{ width: 70, height: 180, border: "3px solid #B77F1C", borderRadius: "0 0 20px 20px", overflow: "hidden", background: "#FFF8E1", position: "relative" }}>
                {/* Bière animée */}
                <motion.div
                  style={{
                    backgroundColor: "#FFC107",
                    width: "100%",
                    borderRadius: "0 0 20px 20px",
                    position: "absolute",
                    bottom: 0,
                    overflow: "hidden",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${percentages[index]}%` }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                   {/* Écume */}
                    <div style={{
                      position: "absolute",
                      top: `${100 - percentages[index]}%`,
                      left: 0,
                      width: "100%",
                      height: 10,
                      background: "radial-gradient(circle at 50% 50%, #fff, transparent 70%)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }} />

                  {/* vague réaliste */}
                  <svg viewBox="0 0 100 10" style={{ width: "100%", height: 20, position: "absolute", bottom: 0 }}>
                    <motion.path
                      fill="#FFD54F"
                      d="M0 5 Q25 0 50 5 T100 5 V10 H0 Z"
                      animate={{ d: ["M0 5 Q25 0 50 5 T100 5 V10 H0 Z", "M0 4 Q25 1 50 4 T100 4 V10 H0 Z"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>

                {/* Bulles */}
                {[...Array(5)].map((_, i) => <Bubble key={i} delay={i*0.3} left={10 + i*12} />)}
              </div>

              <span style={{ marginTop: "0.5rem", fontWeight: isWinner ? "bold" : "normal", fontSize: isWinner ? "1.2rem" : "1rem" }}>
                {c.nom}
              </span>

              {/* Confettis gagnant */}
              {isWinner && [...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: ["#FFC107","#FFEB3B","#FF9800"][i%3],
                    position: "absolute",
                    top: 0,
                    left: 30,
                    borderRadius: "50%",
                  }}
                  animate={{ y: 150 + Math.random()*30, x: [-30,30][i%2], rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i*0.1 }}
                />
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
