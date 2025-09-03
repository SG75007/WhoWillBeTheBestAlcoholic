import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Confettis
const ConfettiPiece = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
    style={{ left: x, top: y }}
    animate={{ y: 400, rotate: rotate + 360 }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
  />
);

interface Candidat {
  id: number;
  nom: string;
  image: string;
}

const translations = {
  fr: {
    title: "Résultats 🍻",
    percentage: "% des votes",
    candidates: ["Sylvain", "Jonathan", "Nicolas"],
  },
  en: {
    title: "Results 🍻",
    percentage: "% of votes",
    candidates: ["Sylvain", "Jonathan", "Nicholas"],
  },
  de: {
    title: "Ergebnisse 🍻",
    percentage: "% der Stimmen",
    candidates: ["Sylvain", "Jonathan", "Nikolaus"],
  },
  zh: {
    title: "结果 🍻",
    percentage: "% 的投票",
    candidates: ["西尔万", "乔纳森", "尼古拉斯"],
  },
  ja: {
    title: "結果 🍻",
    percentage: "％の投票",
    candidates: ["シルヴァン", "ジョナサン", "ニコラス"],
  },
  es: {
    title: "Resultados 🍻",
    percentage: "% de votos",
    candidates: ["Sylvain", "Jonathan", "Nicolás"],
  },
};

export default function Results() {
  const [votes, setVotes] = useState([0, 0, 0]);
  const [lang, setLang] = useState<keyof typeof translations>("fr");

  // 🔥 Récupération votes en temps réel
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as keyof typeof translations;
    if (savedLang && translations[savedLang]) setLang(savedLang);

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
  const winnerIndex = votes.indexOf(Math.max(...votes));

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], image: "/assets/SG_Positif.png" },
    { id: 1, nom: translations[lang].candidates[1], image: "https://placekitten.com/201/200" },
    { id: 2, nom: translations[lang].candidates[2], image: "https://placekitten.com/202/200" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-6 relative">
      <h1 className="text-3xl font-bold mb-12">{translations[lang].title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl relative">
        {candidats.map((c, idx) => {
          const percentage = totalVotes === 0 ? 0 : (votes[idx] / totalVotes) * 100;

          return (
            <div key={c.id} className="flex flex-col items-center relative">
              {/* Confettis si gagnant */}
              {idx === winnerIndex &&
                Array.from({ length: 20 }).map((_, i) => (
                  <ConfettiPiece
                    key={i}
                    x={Math.random() * 80 - 10}
                    y={Math.random() * -50}
                    rotate={Math.random() * 360}
                  />
                ))}

              {/* Tête du candidat */}
              <motion.img
                src={c.image}
                alt={c.nom}
                className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg ring-4 ring-white"
                animate={
                  idx === winnerIndex
                    ? { rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.2, 1, 1.2, 1] }
                    : {}
                }
                transition={{ repeat: idx === winnerIndex ? Infinity : 0, duration: 1 }}
              />

              {/* Bière */}
              <div className="relative w-20 h-60 border-4 border-amber-900 rounded-b-3xl overflow-hidden bg-gray-100">
                <motion.div
                  className="bg-amber-500 w-full absolute bottom-0"
                  initial={{ height: 0 }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>

              <p className="mt-2 font-semibold">{c.nom}</p>
              <p className="text-sm text-gray-600">{Math.round(percentage)}{translations[lang].percentage}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
