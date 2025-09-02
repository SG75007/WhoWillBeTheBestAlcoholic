import { useState } from "react";
import { motion } from "framer-motion";

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
    candidates: ["Personne 1", "Personne 2", "Personne 3"],
  },
  en: {
    title: "Who is the biggest alcoholic? 🍻",
    vote: "Vote",
    percentage: "% of votes",
    glass: "Glass filled 🍺",
    candidates: ["Person 1", "Person 2", "Person 3"],
  },
  de: {
    title: "Wer ist der größte Alkoholiker? 🍻",
    vote: "Abstimmen",
    percentage: "% der Stimmen",
    glass: "Gefülltes Glas 🍺",
    candidates: ["Person 1", "Person 2", "Person 3"],
  },
};

export default function App() {
  const [lang, setLang] = useState<"fr" | "en" | "de">("fr");

  const candidats: Candidat[] = [
    { id: 1, nom: translations[lang].candidates[0], image: "https://placekitten.com/200/200" },
    { id: 2, nom: translations[lang].candidates[1], image: "https://placekitten.com/201/200" },
    { id: 3, nom: translations[lang].candidates[2], image: "https://placekitten.com/202/200" },
  ];

  const [votes, setVotes] = useState<number[]>([0, 0, 0]);
  const [voted, setVoted] = useState(false);
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleVote = (id: number) => {
    if (voted) return;
    const newVotes = [...votes];
    newVotes[id] += 1;
    setVotes(newVotes);
    setVoted(true);
  };

  const getPercentage = (id: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes[id] / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 p-6 relative">

      {/* Sélecteur de langue */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <button onClick={() => setLang("fr")} className="text-2xl">🇫🇷</button>
        <button onClick={() => setLang("en")} className="text-2xl">🇬🇧</button>
        <button onClick={() => setLang("de")} className="text-2xl">🇩🇪</button>
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
              className="w-40 h-40 rounded-full object-cover mb-4"
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
