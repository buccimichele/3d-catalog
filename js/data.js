const CONTACT = {
  email: "michelebucci388@gmail.com",
  telegram: "https://t.me/michelebuccii",
  footerMessage:
    "Cerchi qualcosa di specifico? Contattami:",
};

const CATEGORIES = [
  { id: "funzionali", label: "Funzionali" },
  { id: "decorativi", label: "Decorativi" },
  { id: "quadri", label: "Quadri e Poster" },
  { id: "fermalibri", label: "Fermalibri" },
  { id: "connectibles", label: "Connectibles" },
  { id: "calcio", label: "Calcio" },
  { id: "lifesize", label: "Life Size" },
];

const CREATIONS = [
  {
    title: "Portapenne Pinza Freni AMG",
    category: "funzionali",
    images: ["images/portapenneamg1.jpg", "images/portapenneamg2.jpg", "images/portapenneamg3.jpg"],
  },
  {
    title: "Logo Gta VI Glow in The Dark",
    category: "decorativi",
    images: ["images/logogta1.JPG", "images/logogta2.JPG", "images/logogta3.JPG", "images/logogta4.jpg"],
  },
  {
    title: "Poster Spider-man Venom 3D",
    category: "quadri",
    images: ["images/postervenom1.JPG", "images/postervenom2.JPG", "images/postervenom3.JPG", "images/postervenom4.JPG", "images/postervenom5.JPG"],
  },
  {
    title: "Poster Absolute Batman 3D",
    category: "quadri",
    images: ["images/posterbatman1.JPG", "images/posterbatman2.JPG", "images/posterbatman3.JPG", "images/posterbatman4.JPG"],
  },
  {
    title: "Poster Spider-man 3D",
    category: "quadri",
    images: ["images/posterspiderman1.JPG", "images/posterspiderman2.JPG", "images/posterspiderman3.JPG", "images/posterspiderman4.JPG"],
  },
  {
    title: "Hollow Knight Lampada Diorama 3D",
    category: "decorativi",
    images: ["images/hollowlamp1.JPG", "images/hollowlamp2.JPG", "images/hollowlamp3.JPG", "images/hollowlamp4.JPG", "images/hollowlamp5.JPG"],
  },
  {
    title: "Astrobot Porta Controller",
    category: "funzionali",
    images: ["images/astrocontrollerholder1.JPG", "images/astrocontrollerholder2.JPG", "images/astrocontrollerholder3.JPG", "images/astrocontrollerholder4.JPG"],
  },
  {
    title: "Statuetta Calopsitta",
    category: "decorativi",
    images: ["images/calopsitta1.png", "images/calopsitta2.JPG", "images/calopsitta3.JPG"],
  },
  {
    title: "Kratos | Connectibles",
    category: "connectibles",
    images: ["images/connectibleskratos1.png", "images/connectibleskratos2.JPG", "images/connectibleskratos3.JPG"],
  },
  {
    title: "Master Sword Distrutta | The legend of Zelda Tears of the Kingdom",
    category: "decorativi",
    images: ["images/brokenmastersword1.JPG", "images/brokenmastersword2.JPG"],
  },
  {
    title: "Portatarga Kukirin G4",
    category: "funzionali",
    images: ["images/kukiring4portatarga1.JPG", "images/kukiring4portatarga2.JPG", "images/kukiring4portatarga3.JPG"],
  },
  {
    title: "Logo Inter",
    category: "calcio",
    images: ["images/logointer1.JPG"],
  },
  {
    title: "Trofeo Mondiali Fifa 2026",
    category: "calcio",
    images: ["images/trofeomondialififa1.JPG"],
  },
  {
    title: "Portachiavi Trofeo Mondiali Fifa 2026",
    category: "calcio",
    images: ["images/trofeomondialififakeychain1.JPG"],
  },
  {
    title: "Statua Absolute Batman",
    category: "decorativi",
    images: ["images/absolutebatmanstatue1.jpg"],
  },
  {
    title: "Statuetta Cardellino",
    category: "decorativi",
    images: ["images/cardellino1.png", "images/cardellino2.JPG", "images/cardellino3.JPG", "images/cardellino4.JPG"],
  },
  {
    title: "Statua Crash Bandicoot Low Poly",
    category: "decorativi",
    images: ["images/crashlowpoly1.JPG", "images/crashlowpoly2.JPG"],
  },
  {
    title: "Medaglie Pokémon Galar - Spada e Scudo",
    category: "decorativi",
    images: ["images/galarmedals1.JPG", "images/galarmedals2.JPG", "images/galarmedals3.JPG"],
  },
  {
    title: "Statua Luffy Gear 5",
    category: "decorativi",
    images: ["images/luffystatue1.JPG", "images/luffystatue2.JPG", "images/luffystatue3.JPG"],
  },
  {
    title: "Pappagallo Minecraft",
    category: "decorativi",
    images: ["images/minecraftparrot1.JPG", "images/minecraftparrot2.JPG", "images/minecraftparrot3.JPG"],
  },
  {
    title: "Fermalibro Pragmata",
    category: "fermalibri",
    images: ["images/pragmatabooknook1.JPG", "images/pragmatabooknook2.JPG", "images/pragmatabooknook3.JPG", "images/pragmatabooknook4.JPG"],
  },
  {
    title: "Fermalibro Kamado Tanjiro | Demon Slayer",
    category: "fermalibri",
    images: ["images/tanjirobooknook1.JPG", "images/tanjirobooknook2.JPG"],
  },
  {
    title: "Quadro Thor | Marvel Rivals",
    category: "quadri",
    images: ["images/quadrothor1.JPG", "images/quadrothor2.JPG", "images/quadrothor3.JPG", "images/quadrothor4.JPG"],
  },
  {
    title: "Requiem Desert Eagle | Resident Evil 9: Requiem",
    category: "decorativi",
    images: ["images/requiem1.JPG", "images/requiem2.JPG", "images/requiem3.JPG"],
  },
  {
    title: "Statua Rudo Surebrec | Gachiakuta",
    category: "decorativi",
    images: ["images/rudostatue1.png", "images/rudostatue2.JPG", "images/rudostatue3.JPG", "images/rudostatue4.JPG", "images/rudostatue5.JPG"],
  },
  {
    title: "Trofei Playstation",
    category: "decorativi",
    images: ["images/trofeips1.JPG", "images/trofeips2.JPG"],
  },
];
