import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { translations } from "./translations";

// 🎥 Import des vidéos
import VideoSylvainHappy from "./assets/SG_Positif.mp4";
import VideoNicolasHappy from "./assets/NB_Positif.mp4";
import VideoJoessHappy from "./assets/JC_Positif.mp4";

// 🍺 Import de l’icône bière
import BeerIcon from "./assets/beer.png";

interface Candidat {
  id: number;
  nom: string;
  video: string;
}

// 🍺 Composant pour une bière qui tombe avec taille aléatoire
function FallingBeer() {
  const x = `${Math.random() * 100}%`; // position horizontale aléatoire
  const delay = Math.random() * 5; // délai aléatoire pour commencer
  const duration = 4 + Math.random() * 3; // durée de la chute
  const size = 12 + Math.random() * 64; // taille aléatoire entre 12px et 28px

  return (
    <motion.img
      src={BeerIcon}
      className="absolute opacity-70"
      style={{ left: x, top: -50, width: size, height: size }}
      animate={{ y: ["-50px", "110vh"] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
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
    { id: 0, nom: translations[lang].candidates[0], video: VideoSylvainHappy },
    { id: 1, nom: translations[lang].candidates[1], video: VideoJoessHappy },
    { id: 2, nom: translations[lang].candidates[2], video: VideoNicolasHappy },
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 p-6 relative overflow-hidden">
      {/* 🍺 Pluie de bières avec taille aléatoire */}
      {Array.from({ length: 30 }).map((_, i) => (
        <FallingBeer key={i} />
      ))}

      {/* 🌍 Sélecteur de langue */}
      <div className="absolute top-4 right-4 z-10">
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

      <h1 className="text-3xl font-bold mb-8 relative z-10">
        {translations[lang].siteTitle}
      </h1>

      {/* 🎥 Grille des 3 candidats */}
      <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 sm:gap-4 place-items-center relative z-10">
        {candidats.map((c, index) => (
          <div key={c.id} className="flex flex-col items-center">
            {/* Avatar rond */}
            <div className="w-full aspect-square rounded-full overflow-hidden ring-2 shadow-md">
              <video
                src={c.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <span className="mt-1 text-[10px] sm:text-xs font-medium text-center">
              {c.nom}
            </span>
            <button
              onClick={() => handleVote(index)}
              disabled={voted}
              className="mt-1 px-2 py-1 text-[10px] sm:text-xs rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:bg-gray-300"
            >
              {translations[lang].vote}
            </button>
          </div>
        ))}
      </div>

      {/* Verre rempli après vote */}
      {voted && (
        <div className="mt-12 w-40 h-64 relative flex items-end justify-center z-10">
          <div className="absolute bottom-0 w-full h-full border-4 border-amber-900 rounded-b-3xl overflow-hidden">
            <motion.div
              className="bg-amber-500 w-full"
              initial={{ height: 0 }}
              animate={{
                height: `${(Math.max(...votes) / totalVotes) * 100}%`,
              }}
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
