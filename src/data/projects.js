// Pour ajouter des visuels : déposer les images dans public/projects/<slug>/
// puis renseigner cover: '/projects/<slug>/cover.jpg' et images: ['/projects/<slug>/1.jpg', ...]
// role et links sont affichés seulement s'ils sont remplis.
// devices: ['desktop', 'phone'] affiche aussi un iPhone au survol ; phoneCover = capture de l'écran du téléphone.

export const filters = ["Tous", "IoT", "Web", "Mobile", "IA"];

export const projects = [
  {
    slug: "wura",
    name: "WURA",
    category: "AI & Mobile Development",
    tags: ["Mobile", "IA"],
    cardTitle: "WURA — AI-Powered Mobile Application",
    cardText:
      "Bringing African fashion into the digital world through an intelligent mobile shopping experience.",
    description:
      "WURA est un projet d'application mobile dédié à la valorisation et à la commercialisation des pagnes africains. La plateforme vise à faciliter la découverte de modèles, à améliorer l'expérience d'achat et à intégrer des fonctionnalités intelligentes basées sur l'intelligence artificielle pour accompagner les utilisateurs dans leurs choix.",
    tech: ["React Native", "Node.js", "AI/ML"],
    role: "",
    links: [],
    cover: "/projects/wura/cover.jpg",
    phoneCover: "/projects/wura/phone.jpg",
    devices: ["desktop", "phone"],
    images: [],
  },
  {
    slug: "e-access",
    name: "E-Access",
    category: "IoT & Software Engineering",
    tags: ["IoT", "Web"],
    cardTitle: "E-Access — Smart Access Control",
    cardText:
      "A secure access management solution combining web technologies, QR code authentication and connected hardware.",
    description:
      "E-Access est une solution intelligente de contrôle d'accès conçue pour moderniser et sécuriser la gestion des entrées. Le système repose sur une plateforme de gestion permettant aux administrateurs de contrôler les autorisations, avec une validation sécurisée par QR code et une intégration avec des dispositifs électroniques de verrouillage.",
    tech: ["Laravel", "PHP", "JWT", "QR Code", "IoT"],
    role: "",
    links: [],
    cover: "",
    images: [],
  },
  {
    slug: "binova",
    name: "Binova",
    category: "Embedded Systems & IoT",
    tags: ["IoT"],
    cardTitle: "Binova — Smart Waste Management",
    cardText:
      "An IoT-powered waste management system designed to monitor bin capacity and support smarter waste collection.",
    description:
      "Binova est un système intelligent de gestion des déchets basé sur l'Internet des objets. Il utilise des capteurs ultrasoniques et un microcontrôleur ESP32 pour surveiller le niveau de remplissage des poubelles et détecter les interactions. Les données sont transmises à une interface de supervision afin de faciliter le suivi et d'améliorer l'organisation des collectes.",
    tech: ["ESP32", "C/C++", "Ultrasonic Sensors", "IoT", "Web Dashboard"],
    role: "",
    links: [],
    cover: "",
    images: [],
  },
  {
    slug: "e-cash",
    name: "E-Cash",
    category: "Full Stack Development",
    tags: ["Web"],
    cardTitle: "E-Cash — Digital Cash Management",
    cardText:
      "Streamlining cash management operations through digital workflows, approval processes and centralized transaction tracking.",
    description:
      "E-Cash est une application de gestion numérique des opérations de caisse développée pour simplifier et structurer les processus financiers internes. Elle intègre notamment la gestion des demandes d'approvisionnement, leur validation par les responsables, le suivi des opérations et la centralisation des justificatifs et rapports.",
    tech: ["Laravel", "PHP", "JavaScript", "MySQL"],
    role: "",
    links: [],
    cover: "projects/e-cash/cover.jpg",
    images: [],
  },
  {
    slug: "da-digit-all",
    name: "DA Digit All",
    category: "Web Development & UI/UX",
    tags: ["Web"],
    cardTitle: "DA Digit All — Corporate Website",
    cardText:
      "Designing and developing a professional digital presence for a company driving digital transformation and innovation.",
    description:
      "Conception et développement du site vitrine de DA Digit All, une entreprise spécialisée dans la transformation digitale. Le projet consiste à créer une présence numérique professionnelle permettant de présenter ses services, ses réalisations, ses références et ses opportunités. Une attention particulière est portée à l'expérience utilisateur, au responsive design et à la cohérence de l'identité visuelle.",
    tech: ["React", "Vite", "JavaScript", "CSS", "Responsive Design"],
    role: "",
    links: [],
    cover: "projects/da-digit-all/cover.jpg",
    images: [],
  },
  {
    slug: "elenami",
    name: "ELENAMI",
    category: "Web Development & UI/UX",
    tags: ["Web"],
    cardTitle: "ELENAMI — Corporate Website",
    cardText:
      "Building a modern corporate website to strengthen the digital presence of a company specializing in digital transformation.",
    description:
      "Conception et développement du site vitrine d'ELENAMI, une entreprise spécialisée dans la transformation digitale. L'objectif est de traduire son identité et son positionnement en une expérience Web professionnelle, intuitive et accessible. La plateforme permet de mettre en valeur ses activités, ses services et son expertise auprès de ses clients et partenaires.",
    tech: [], // à compléter selon la stack réellement utilisée
    role: "",
    links: [],
    cover: "projects/elenami/cover.jpg",
    images: [],
  },
  {
    slug: "homesync",
    name: "HomeSync",
    category: "Smart Home & IoT",
    tags: ["IoT"],
    cardTitle: "HomeSync — Intelligent Home Automation",
    cardText:
      "Connecting sensors, embedded systems and smart controls to create a more responsive and automated living environment.",
    description:
      "HomeSync est un prototype de système domotique intelligent basé sur l'ESP32. Il permet d'intégrer plusieurs fonctionnalités de contrôle et d'automatisation domestique, notamment la gestion de l'accès par RFID, la détection environnementale, le contrôle de l'éclairage et la commande de servomoteurs. Le système illustre l'interconnexion de différents composants électroniques au sein d'un environnement résidentiel intelligent.",
    tech: ["ESP32", "C/C++", "Arduino", "RFID", "Sensors", "Embedded Systems"],
    role: "",
    links: [],
    cover: "projects/homesync/cover.jpg",
    images: [],
    maquette: "projects/homesync/maquette.jpg", // ou .mp4 / .webm pour une vidéo
  },
];
