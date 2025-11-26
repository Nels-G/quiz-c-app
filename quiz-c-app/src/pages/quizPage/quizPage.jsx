import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PopupPub from '../../components/PopupPub/PopupPub';
import Quiz from '../../components/quiz/quiz';

const QuizPage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [score, setScore] = useState(0);

  const userName = "Utilisateur";
  const niveau = "Débutant";

  return (
    <>
      <Navbar userName={userName} niveau={niveau} score={score} />
      <Quiz />
      <PopupPub
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
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

export default QuizPage;