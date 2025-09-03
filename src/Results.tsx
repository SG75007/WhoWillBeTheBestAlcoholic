import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import PhotoSylvainHappy from "./assets/SG_Positif.png";

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

export default function Results() {
  const [votes, setVotes] = useState([0, 0, 0]);
  const lang = (localStorage.getItem("lang") as keyof typeof translations) || "fr";

  // 🔥 Récupérer votes en temps réel
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

  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const percentages = votes.map(v => totalVotes ? (v / totalVotes) * 100 : 0);

  const maxIndex = votes.indexOf(Math.max(...votes));

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], image: PhotoSylvainHappy },
    { id: 1, nom: translations[lang].candidates[1], image: "https://placekitten.com/201/200" },
    { id: 2, nom: translations[lang].candidates[2], image: "https://placekitten.com/202/200" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, #FFFBEB, #FFE0B2)", padding: "1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>{translations[lang].title}</h1>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2rem" }}>
        {candidats.map((c, index) => {
          const isWinner = index === maxIndex;
          return (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <motion.img
                src={c.image}
                alt={c.nom}
                style={{
                  width: isWinner ? 120 : 100,
                  height: isWinner ? 120 : 100,
                  borderRadius: "50%",
                  border: "4px solid white",
                  marginBottom: "0.5rem",
                }}
                animate={isWinner ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1, 1.2] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <div style={{ width: 60, height: 150, border: "2px solid #B77F1C", borderRadius: "0 0 15px 15px", overflow: "hidden", background: "#FFF8E1" }}>
                <motion.div
                  style={{ backgroundColor: "#FFC107", width: "100%", height: "0%" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${percentages[index]}%` }}
                  transition={{ duration: 2 }}
                />
              </div>
              <span style={{ marginTop: "0.5rem" }}>{c.nom}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}