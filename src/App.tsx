import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PhotoSylvainHappy from "./assets/SG_Positif.png";
import PhotoNicolasHappy from "./assets/NB_Positif.png";
import PhotoJoesHappy from "./assets/JC_Positif.png";
import { translations } from "./translations";

interface Candidat {
  id: number;
  nom: string;
  image: string;
}

export default function App() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<keyof typeof translations>("fr");
  const [votes, setVotes] = useState<number[]>([0, 0, 0]);
  const [voted, setVoted] = useState(false);

  // 🔥 Change le titre du site quand la langue change
  useEffect(() => {
    document.title = translations[lang].siteTitle;
  }, [lang]);

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
    { id: 1, nom: translations[lang].candidates[1], image: PhotoJoesHappy },
    { id: 2, nom: translations[lang].candidates[2], image: PhotoNicolasHappy },
  ];

  const handleVote = async (id: number) => {
    if (voted) return;
    setVoted(true);

    const candidatKey = `candidat${id + 1}`;
    const ref = doc(db, "votes", "resultats");

    await updateDoc(ref, {
      [candidatKey]: increment(1),
    });

    // ⬅ Redirection vers la page résultats
    setTimeout(() => {
      navigate("/results");
    }, 800); // petit délai pour animation du vote
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const getPercentage = (id: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes[id] / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 p-6 relative">
    {/* 🌍 Sélecteur de langue en liste déroulante */}
    <div className="position-sticky top-4 right-25%">
      <select
        value={lang}
        onChange={(e) => changeLang(e.target.value as keyof typeof translations)}
        className="bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2 
                  text-sm md:text-base cursor-pointer focus:outline-none focus:ring-2 
                  focus:ring-amber-500"
      >
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="pt">🇵🇹 Português</option>
          <option value="nl">🇳🇱 Nederlands</option>
          <option value="pl">🇵🇱 Polski</option>
          <option value="cs">🇨🇿 Čeština</option>
          <option value="sk">🇸🇰 Slovenčina</option>
          <option value="hu">🇭🇺 Magyar</option>
          <option value="ro">🇷🇴 Română</option>
          <option value="bg">🇧🇬 Български</option>
          <option value="hr">🇭🇷 Hrvatski</option>
          <option value="sl">🇸🇮 Slovenščina</option>
          <option value="fi">🇫🇮 Suomi</option>
          <option value="sv">🇸🇪 Svenska</option>
          <option value="da">🇩🇰 Dansk</option>
          <option value="et">🇪🇪 Eesti</option>
          <option value="lv">🇱🇻 Latviešu</option>
          <option value="lt">🇱🇹 Lietuvių</option>
          <option value="el">🇬🇷 Ελληνικά</option>
          <option value="ga">🇮🇪 Gaeilge</option>
          <option value="mt">🇲🇹 Malti</option>
          <option value="uk">🇺🇦 Українська</option>
          <option value="br">🏴 Brezhoneg</option>
          <option value="co">🏴‍☠️ Corsu</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="zh">🇨🇳 中文</option>
      </select>
    </div>


      <h1 className="text-3xl font-bold mb-8">{translations[lang].siteTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {candidats.map((c, index) => (
          <div
            key={c.id}
            className="p-4 flex flex-col items-center shadow-xl rounded-2xl bg-white"
          >
            <motion.img
              src={c.image}
              alt={c.nom}
              className="w-fixed rounded-full object-cover mb-4 ring-4 shadow-lg"
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
      <div className="min-h-screen bg-amber-50 text-gray-900 flex items-center justify-center">
</div>
    </div>
    
  );
}
