import React, { useState, useEffect } from 'react';
import './PopupPub.css';

/**
 * Liste des publicités à afficher
 * Ajoutez vos pubs ici depuis votre dashboard
 * 
 * Image - Dimensions recommandées :
 * - Standard : 420px x 200px
 * - Retina (recommandé) : 840px x 400px
 * - Haute résolution : 1260px x 600px
 * - Ratio : 2.1:1
 * - Format : JPG ou WebP
 */
const defaultAds = [
  {
    id: 1,
    image: "/68ecf652b7124ab0033f358b_c.jpg",
    title: "Maîtrisez le Langage C",
    description: "Découvrez notre formation complète pour devenir un expert en programmation C. De débutant à avancé, apprenez à votre rythme.",
    ctaText: "Découvrir la formation",
    ctaLink: "/formation-c",
    badge: "🔥 Offre limitée"
  },
  {
    id: 2,
    image: "/java-script.jpg",
    title: "Formation JavaScript Avancé",
    description: "Apprenez les concepts avancés de JavaScript : async/await, closures, prototypes et bien plus encore.",
    ctaText: "S'inscrire maintenant",
    ctaLink: "/formation-js",
    badge: "⭐ Nouveau"
  },
  {
    id: 3,
    image: "/HTML&CSS2.jpg",
    title: "Pack Développeur Web Complet",
    description: "HTML, CSS, JavaScript, React, Node.js - Tout ce qu'il faut pour devenir développeur web professionnel.",
    ctaText: "Voir le programme",
    ctaLink: "/pack-dev-web",
    badge: "💎 Best-seller"
  }
];

const PopupPub = ({ 
  isOpen = true,
  onClose,
  ads = defaultAds,
  rotationMode = "random" // "random" | "sequential" | "shuffle"
}) => {
  const [visible, setVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);

  useEffect(() => {
    if (isOpen && ads.length > 0) {
      selectAd();
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const selectAd = () => {
    if (ads.length === 0) return;

    let selectedAd;
    const lastAdId = localStorage.getItem('lastAdId');
    const viewedAds = JSON.parse(localStorage.getItem('viewedAds') || '[]');

    switch (rotationMode) {
      case "sequential":
        // Affiche les pubs dans l'ordre, une après l'autre
        const lastIndex = ads.findIndex(ad => ad.id.toString() === lastAdId);
        const nextIndex = (lastIndex + 1) % ads.length;
        selectedAd = ads[nextIndex];
        break;

      case "shuffle":
        // Affiche toutes les pubs une fois avant de recommencer
        const remainingAds = ads.filter(ad => !viewedAds.includes(ad.id));
        if (remainingAds.length === 0) {
          // Toutes les pubs ont été vues, on recommence
          localStorage.setItem('viewedAds', '[]');
          selectedAd = ads[Math.floor(Math.random() * ads.length)];
        } else {
          selectedAd = remainingAds[Math.floor(Math.random() * remainingAds.length)];
        }
        // Enregistre la pub vue
        const updatedViewedAds = [...viewedAds, selectedAd?.id];
        localStorage.setItem('viewedAds', JSON.stringify(updatedViewedAds));
        break;

      case "random":
      default:
        // Sélection aléatoire (évite de répéter la même pub 2 fois de suite)
        let availableAds = ads.length > 1 
          ? ads.filter(ad => ad.id.toString() !== lastAdId)
          : ads;
        selectedAd = availableAds[Math.floor(Math.random() * availableAds.length)];
        break;
    }

    if (selectedAd) {
      localStorage.setItem('lastAdId', selectedAd.id.toString());
      setCurrentAd(selectedAd);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const handleCtaClick = () => {
    if (currentAd?.ctaLink) {
      window.location.href = currentAd.ctaLink;
    }
  };

  if (!isOpen || !currentAd) return null;

  return (
    <div className={`PopupPub-overlay ${visible ? 'PopupPub-overlay--visible' : ''}`} onClick={handleClose}>
      <div 
        className={`PopupPub-container ${visible ? 'PopupPub-container--visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="PopupPub-close" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="PopupPub-image-wrapper">
          {currentAd.badge && <span className="PopupPub-badge">{currentAd.badge}</span>}
          <img src={currentAd.image} alt={currentAd.title} className="PopupPub-image" />
        </div>

        <div className="PopupPub-content">
          <h2 className="PopupPub-title">{currentAd.title}</h2>
          <p className="PopupPub-description">{currentAd.description}</p>
          
          <button className="PopupPub-cta" onClick={handleCtaClick}>
            {currentAd.ctaText}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button className="PopupPub-dismiss" onClick={handleClose}>
            Non merci, plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupPub;