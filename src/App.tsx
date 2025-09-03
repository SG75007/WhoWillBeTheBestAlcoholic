import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import PhotoSylvainHappy from "./assets/SG_Positif.png";

interface Candidat {
  id: number;
  nom: string;
  image: string;
}

const translations = {
  fr: {
    title: "Qui est le plus alcoolique ? 🍻",
    vote: "Voter",
    percentage: "% des votes",
    glass: "Verre rempli 🍺",
    candidates: ["Sylvain", "Jonathan", "Nicolas"],
  },
  en: {
    title: "Who is the biggest alcoholic? 🍻",
    vote: "Vote",
    percentage: "% of votes",
    glass: "Glass filled 🍺",
    candidates: ["Sylvain", "Jonathan", "Nicholas"],
  },
  de: {
    title: "Wer ist der größte Alkoholiker? 🍻",
    vote: "Abstimmen",
    percentage: "% der Stimmen",
    glass: "Gefülltes Glas 🍺",
    candidates: ["Sylvain", "Jonathan", "Nikolaus"],
  },
  zh: {
    title: "谁是最大的酒鬼？🍻",
    vote: "投票",
    percentage: "% 的投票",
    glass: "满杯 🍺",
    candidates: ["西尔万", "乔纳森", "尼古拉斯"],
  },
  ja: {
    title: "誰が一番の酒豪？🍻",
    vote: "投票する",
    percentage: "％の投票",
    glass: "満杯のグラス 🍺",
    candidates: ["シルヴァン", "ジョナサン", "ニコラス"],
  },
  es: {
    title: "¿Quién es el más alcohólico? 🍻",
    vote: "Votar",
    percentage: "% de votos",
    glass: "Vaso lleno 🍺",
    candidates: ["Sylvain", "Jonathan", "Nicolás"],
  },
};

export default function App() {
  const [lang, setLang] = useState<keyof typeof translations>("fr");
  const [votes, setVotes] = useState<number[]>([0, 0, 0]);
  const [voted, setVoted] = useState(false);

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

  const changeLang = (lng: keyof typeof translations) => {
    setLang(lng);
    localStorage.setItem("lang", lng);
  };

  const candidats: Candidat[] = [
    { id: 0, nom: translations[lang].candidates[0], image: PhotoSylvainHappy },
    { id: 1, nom: translations[lang].candidates[1], image: "https://placekitten.com/201/200" },
    { id: 2, nom: translations[lang].candidates[2], image: "https://placekitten.com/202/200" },
  ];

  const handleVote = async (id: number) => {
    if (voted) return;
    setVoted(true);

    const candidatKey = `candidat${id + 1}`;
    const ref = doc(db, "votes", "resultats");

    await updateDoc(ref, {
      [candidatKey]: increment(1),
    });
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const getPercentage = (id: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes[id] / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 p-6 relative">
      {/* Sélecteur de langue */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <button onClick={() => changeLang("fr")} className="text-2xl">🇫🇷</button>
        <button onClick={() => changeLang("en")} className="text-2xl">🇬🇧</button>
        <button onClick={() => changeLang("de")} className="text-2xl">🇩🇪</button>
        <button onClick={() => changeLang("zh")} className="text-2xl">🇨🇳</button>
        <button onClick={() => changeLang("ja")} className="text-2xl">🇯🇵</button>
        <button onClick={() => changeLang("es")} className="text-2xl">🇪🇸</button>
      </div>

      <h1 className="text-3xl font-bold mb-8">{translations[lang].title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {candidats.map((c, index) => (
          <div
            key={c.id}
            className="p-4 flex flex-col items-center shadow-xl rounded-2xl bg-white"
          >
            <motion.img
              src={c.image}
              alt={c.nom}
              className="w-40 h-40 rounded-full object-cover mb-4 ring-4 ring-white shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <h2 className="text-lg font-semibold mb-2">{c.nom}</h2>
            <button
              onClick={() => handleVote(index)}
              disabled={voted}
              className="rounded-2xl px-6 py-2 bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:bg-gray-300"
            >
              {translations[lang].vote}
            </button>
            {voted && (
              <p className="mt-2 text-sm text-gray-600">
                {getPercentage(index)}{translations[lang].percentage}
              </p>
            )}
          </div>
        ))}
      </div>

      {voted && (
        <div className="mt-12 w-40 h-64 relative flex items-end justify-center">
          <div className="absolute bottom-0 w-full h-full border-4 border-amber-900 rounded-b-3xl overflow-hidden">
            <motion.div
              className="bg-amber-500 w-full"
              initial={{ height: 0 }}
              animate={{ height: `${(Math.max(...votes) / totalVotes) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="absolute -bottom-8 font-semibold">
            {translations[lang].glass}
          </p>
        </div>
      )}
    </div>
  );
}
