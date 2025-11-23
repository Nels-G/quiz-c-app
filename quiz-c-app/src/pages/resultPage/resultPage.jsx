import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Result from '../../components/result/result';
import PopupPub from '../../components/PopupPub/PopupPub';

const ResultPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const popupShownRef = useRef(false);
  const celebrationCalledRef = useRef(false);

  const userName = "nels Galley";
  const niveau = "Débutant";

  // Fonction appelée quand les animations de célébration sont terminées
  const handleCelebrationComplete = () => {
    // Vérifier que la fonction n'a pas déjà été appelée
    if (!celebrationCalledRef.current) {
      celebrationCalledRef.current = true;
      
      // Vérifier que la popup n'a pas déjà été affichée
      if (!popupShownRef.current) {
        popupShownRef.current = true;
        setShowPopup(true);
      }
    }
  };

  // Fonction pour fermer la popup définitivement
  const handleClosePopup = () => {
    setShowPopup(false);
    popupShownRef.current = true; // S'assurer qu'elle ne se réouvre pas
  };

  return (
    <>
      <Navbar userName={userName} niveau={niveau} score={score} />
      <Result onCelebrationComplete={handleCelebrationComplete} />
      <PopupPub
        isOpen={showPopup}
        onClose={handleClosePopup}
        image="/figmaFlyer04.jpg"
        title="Maîtrisez le Langage C"
        description="Découvrez notre formation complète pour devenir un expert en programmation C. De débutant à avancé, apprenez à votre rythme."
        ctaText="Découvrir la formation"
        ctaLink="/formation"
        badge="🔥 Offre limitée"
      />
    </>
  );
};

export default ResultPage;