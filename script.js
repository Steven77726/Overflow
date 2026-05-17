const input = document.querySelector("#thoughtInput");
const composer = document.querySelector("#composer");
const micButton = document.querySelector("#micButton");
const voiceStatus = document.querySelector("#voiceStatus");
const examples = document.querySelector("#examples");
const logoButton = document.querySelector("#logoButton");
const menuButton = document.querySelector("#menuButton");
const sideMenu = document.querySelector("#sideMenu");
const backdrop = document.querySelector("#backdrop");
const quickGrid = document.querySelector("#quickGrid");
const menuNav = document.querySelector("#menuNav");
const views = [...document.querySelectorAll(".view")];
const detailTitle = document.querySelector("#detailTitle");
const detailKicker = document.querySelector("#detailKicker");
const detailSummary = document.querySelector("#detailSummary");
const notesList = document.querySelector("#notesList");
const suggestions = document.querySelector("#suggestions");
const taskList = document.querySelector("#taskList");
const taskFilters = document.querySelector("#taskFilters");
const searchForm = document.querySelector("#searchForm");
const smartSearch = document.querySelector("#smartSearch");
const aiAnswer = document.querySelector("#aiAnswer");
const unlockSecret = document.querySelector("#unlockSecret");
const secretLock = document.querySelector("#secretLock");
const secretContent = document.querySelector("#secretContent");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;
let currentTaskFilter = "all";

const memories = [
  {
    title: "Rappel Gabriel",
    body: "Appeler Gabriel demain pour avancer sur les sujets de soirée.",
    people: ["Gabriel"],
    places: [],
    topics: ["Rappel", "Soirée"],
    type: "task",
    important: true,
    sent: false,
  },
  {
    title: "Idée Winess",
    body: "Créer une expérience Winess autour d'idées cocktails, tables et ambiance premium.",
    people: ["David"],
    places: ["Levallois"],
    topics: ["Winess", "Idées", "Cocktails", "Marketing"],
    type: "idea",
    important: true,
    sent: false,
  },
  {
    title: "David à Levallois",
    body: "David est lié à Levallois et à une discussion sur une soirée avec potentiel business.",
    people: ["David"],
    places: ["Levallois"],
    topics: ["Soirée", "Business"],
    type: "event",
    important: false,
    sent: true,
  },
  {
    title: "Rendez-vous Théo",
    body: "Prévoir un point avec Théo cette semaine pour clarifier les priorités.",
    people: ["Théo"],
    places: [],
    topics: ["Rendez-vous", "Semaine"],
    type: "task",
    important: false,
    sent: false,
  },
];

const tasks = [
  { text: "Appeler Gabriel", important: true, day: "Aujourd'hui", done: false },
  { text: "Envoyer devis à David", important: true, day: "Mardi", done: false },
  { text: "Réserver salle jeudi", important: false, day: "Jeudi", done: false },
  { text: "Acheter du lait", important: false, day: "Aujourd'hui", done: true },
];

const viewData = {
  today: {
    title: "Programme du jour",
    summary: "Rappels, tâches, rendez-vous et notes importantes du jour, priorisés sans surcharge.",
    notes: [
      ["Rappels du jour", "Appeler Gabriel et garder le sujet Winess accessible."],
      ["Tâches du jour", "Acheter du lait, préparer les messages importants, vérifier les rendez-vous."],
      ["Rendez-vous du jour", "Point possible avec David ou Gabriel selon les priorités."],
      ["Notes importantes", "Winess, soirée, Levallois et devis restent liés."],
    ],
    suggestions: ["Voir tâches prioritaires", "Voir notes importantes", "Chercher Gabriel"],
  },
  week: {
    title: "Programme de la semaine",
    summary: "Vue courte sur les prochains jours, avec actions et rendez-vous replacés dans le temps.",
    notes: [
      ["Lundi", "Clarifier les rappels et appels importants."],
      ["Mardi", "Envoyer devis à David."],
      ["Jeudi", "Réserver salle pour le projet soirée."],
      ["Vendredi", "Relire les notes Winess et préparer les décisions."],
    ],
    suggestions: ["Tâches en cours", "Rendez-vous avec Théo", "Notes importantes"],
  },
  ideas: {
    title: "Idées",
    summary: "Toutes les idées enregistrées, regroupées par intention plutôt que par dossiers rigides.",
    notes: [
      ["Idée Winess", "Créer une expérience premium autour de cocktails, tables et ambiance."],
      ["Idée business", "Transformer la soirée en format récurrent avec rentabilité claire."],
      ["Idée marketing", "Positionner Winess comme une expérience sociale élégante."],
      ["Idée personnelle", "Garder les intuitions avant qu'elles disparaissent."],
    ],
    suggestions: ["Idées business", "Idées cocktails", "Idées marketing", "Idées personnelles"],
  },
  places: {
    title: "Lieux et endroits",
    summary: "Les lieux sont reliés aux personnes, projets et événements évoqués naturellement.",
    notes: [
      ["Levallois", "Lié à David, Winess et une discussion autour d'une soirée."],
      ["Péniche", "Lieu potentiel pour une soirée premium."],
      ["Salle événementielle", "À réserver pour un projet organisé."],
      ["Point relais", "Lieu pratique lié aux rappels du jour."],
    ],
    suggestions: ["Voir Levallois", "Voir lieux Winess", "Voir événements"],
  },
  people: {
    title: "Personnes",
    summary: "Les personnes importantes et les sujets liés à chacune.",
    notes: [
      ["Gabriel", "Souvent lié aux soirées festives, rappels et projets Winess."],
      ["David", "Lié à Levallois, aux projets et aux discussions business."],
      ["Théo", "Associé aux rendez-vous et priorités de la semaine."],
      ["Steven", "Centre de la mémoire personnelle et des décisions à suivre."],
    ],
    suggestions: ["Voir toutes les notes avec Gabriel", "Voir les projets liés à David", "Voir les rendez-vous avec Théo"],
  },
  important: {
    title: "Important",
    summary: "Seulement ce qui mérite de rester proche de toi.",
    notes: [
      ["Appeler Gabriel", "Rappel prioritaire détecté automatiquement."],
      ["Winess", "Projet avec plusieurs connexions : David, Levallois, soirée."],
      ["Devis David", "Action importante à ne pas perdre."],
      ["Réserver salle", "Tâche liée à un événement futur."],
    ],
    suggestions: ["Tâches importantes", "Projets actifs", "Notes liées à Winess"],
  },
  sent: {
    title: "Envoyés",
    summary: "Les éléments déjà transmis ou marqués comme partagés.",
    notes: [
      ["Discussion David", "Note envoyée autour de Levallois et d'une soirée."],
      ["Brief Winess", "Synthèse courte prête à être réutilisée."],
      ["Rappel partagé", "Action envoyée vers le flux d'organisation."],
    ],
    suggestions: ["Voir projets envoyés", "Voir personnes liées", "Voir notes récentes"],
  },
  settings: {
    title: "Paramètres",
    summary: "Préférences prévues pour l'app complète : compte, notifications, confidentialité et IA.",
    notes: [
      ["Notifications PWA", "Prévu pour rappels, programme du jour et événements importants."],
      ["OpenAI API", "Prévu pour analyse réelle des notes côté backend."],
      ["Supabase", "Prévu pour auth, PostgreSQL et synchronisation."],
    ],
    suggestions: ["Activer notifications", "Configurer IA", "Confidentialité"],
  },
};

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 170)}px`;
}

function setVoiceStatus(message, active = false) {
  voiceStatus.textContent = message;
  voiceStatus.classList.toggle("active", active);
}

function showView(name) {
  views.forEach((view) => view.classList.remove("active"));
  if (name === "home") {
    document.querySelector("#homeView").classList.add("active");
  } else if (name === "detail") {
    document.querySelector("#detailView").classList.add("active");
  } else if (name === "tasks") {
    document.querySelector("#tasksView").classList.add("active");
    renderTasks();
  } else if (name === "search") {
    document.querySelector("#searchView").classList.add("active");
    smartSearch.focus();
  } else if (name === "secret") {
    document.querySelector("#secretView").classList.add("active");
  } else {
    renderDetail(name);
    document.querySelector("#detailView").classList.add("active");
  }
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openMenu() {
  sideMenu.classList.add("open");
  backdrop.classList.add("open");
  sideMenu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  sideMenu.classList.remove("open");
  backdrop.classList.remove("open");
  sideMenu.setAttribute("aria-hidden", "true");
}

async function requestMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("micro-not-supported");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

function createRecognition() {
  if (!SpeechRecognition) throw new Error("speech-not-supported");
  const instance = new SpeechRecognition();
  instance.lang = "fr-FR";
  instance.interimResults = true;
  instance.continuous = false;
  instance.onstart = () => {
    isListening = true;
    micButton.classList.add("listening");
    setVoiceStatus("Écoute en cours…", true);
  };
  instance.onresult = (event) => {
    let transcript = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }
    input.value = transcript.trim();
    resizeInput();
  };
  instance.onerror = (event) => {
    stopListening();
    if (event.error === "not-allowed") {
      setVoiceStatus("Micro refusé, autorise l'accès dans les réglages du navigateur.", false);
      return;
    }
    setVoiceStatus("Je n'ai pas pu écouter. Tu peux écrire à la main.", false);
  };
  instance.onend = () => {
    stopListening();
    if (input.value.trim()) setVoiceStatus("Texte dicté. Tu peux l'envoyer.", true);
  };
  return instance;
}

async function startVoice() {
  try {
    await requestMicrophone();
    recognition = createRecognition();
    recognition.start();
  } catch (error) {
    stopListening();
    if (error.name === "NotAllowedError") {
      setVoiceStatus("Micro refusé, autorise l'accès dans les réglages du navigateur.", false);
    } else if (error.message === "speech-not-supported") {
      setVoiceStatus("Dictée non disponible ici. Alternative prévue : audio + Whisper côté backend.", false);
    } else {
      setVoiceStatus("Autorise le micro, ou écris ton message à la main.", false);
    }
  }
}

function stopListening() {
  isListening = false;
  micButton.classList.remove("listening");
}

function analyzeText(text) {
  const lower = text.toLowerCase();
  const people = ["Gabriel", "David", "Théo", "Steven"].filter((name) => lower.includes(name.toLowerCase()));
  const places = ["Levallois", "Péniche", "Salle"].filter((place) => lower.includes(place.toLowerCase()));
  const topics = ["Winess", "Soirée", "Cocktails", "Marketing", "Business", "Important"].filter((topic) =>
    lower.includes(topic.toLowerCase())
  );
  const isTask = /(rappelle|appeler|acheter|réserver|envoyer|faire|prépare|préparer)/i.test(text);

  return {
    people,
    places,
    topics,
    isTask,
    summary: isTask
      ? `J'ai compris une action à suivre : “${text}”.`
      : `J'ai créé une mémoire reliée automatiquement : “${text}”.`,
  };
}

function submitThought() {
  const text = input.value.trim();
  if (!text) {
    setVoiceStatus("Écris ou dicte quelque chose d'abord.", false);
    input.focus();
    return;
  }

  const analysis = analyzeText(text);
  memories.unshift({
    title: analysis.isTask ? "Nouvelle tâche" : "Nouvelle mémoire",
    body: analysis.summary,
    people: analysis.people,
    places: analysis.places,
    topics: analysis.topics,
    type: analysis.isTask ? "task" : "note",
    important: /important|urgent|demain|cette semaine/i.test(text),
    sent: false,
  });

  if (analysis.isTask) {
    tasks.unshift({ text, important: /important|urgent|demain/i.test(text), day: "Aujourd'hui", done: false });
  }

  renderGeneratedMemory(analysis);
  showView("detail");
  setVoiceStatus("Envoyé à Overflow.", true);
}

function renderGeneratedMemory(analysis) {
  detailKicker.textContent = "Mémoire intelligente";
  detailTitle.textContent = analysis.isTask ? "Tâche créée" : "Mémoire ajoutée";
  detailSummary.textContent = analysis.summary;
  notesList.innerHTML = "";
  [
    ["Personnes détectées", analysis.people.join(", ") || "Aucune personne explicite."],
    ["Lieux détectés", analysis.places.join(", ") || "Aucun lieu explicite."],
    ["Thèmes détectés", analysis.topics.join(", ") || "Mémoire générale."],
    ["Connexions", [...analysis.people, ...analysis.places, ...analysis.topics].join(" → ") || "À enrichir plus tard."],
  ].forEach(([title, body]) => addNote(title, body));
  renderSuggestions(["Voir tâches", "Chercher dans la mémoire", "Marquer important"]);
}

function renderDetail(key) {
  const data = viewData[key] || viewData.today;
  detailKicker.textContent = "Recherche rapide";
  detailTitle.textContent = data.title;
  detailSummary.textContent = data.summary;
  notesList.innerHTML = "";
  data.notes.forEach(([title, body]) => addNote(title, body));
  renderSuggestions(data.suggestions);
  if (key === "today" || key === "week") renderTasks();
}

function addNote(title, body) {
  const article = document.createElement("article");
  article.innerHTML = `<strong>${title}</strong><span>${linkEntities(body)}</span>`;
  notesList.append(article);
}

function linkEntities(text) {
  return text.replace(/\b(Gabriel|David|Théo|Steven|Levallois|Winess|soirée|cocktails)\b/gi, (match) => {
    return `<button class="entity" data-entity="${match}">${match}</button>`;
  });
}

function renderSuggestions(items) {
  suggestions.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.textContent = item;
    button.addEventListener("click", () => handleSuggestion(item));
    suggestions.append(button);
  });
}

function handleSuggestion(item) {
  const lower = item.toLowerCase();
  if (lower.includes("tâche")) {
    showView("tasks");
    return;
  }
  if (lower.includes("important")) {
    showView("important");
    return;
  }
  if (lower.includes("chercher")) {
    showView("search");
    smartSearch.value = item.replace("Chercher ", "");
    aiAnswer.textContent = askMemory(smartSearch.value);
    return;
  }
  answerEntity(item);
}

function answerEntity(entity) {
  detailKicker.textContent = "Synthèse IA";
  detailTitle.textContent = entity;
  detailSummary.textContent = `${entity} est relié à tes notes, tâches et projets récents. Overflow garde les connexions utiles sans te demander de classer à la main.`;
  notesList.innerHTML = "";
  memories
    .filter((memory) => JSON.stringify(memory).toLowerCase().includes(entity.toLowerCase().split(" ").pop()))
    .slice(0, 4)
    .forEach((memory) => addNote(memory.title, memory.body));
  if (!notesList.children.length) addNote("Connexion possible", "Ce sujet pourra être enrichi dès que tu l'évoques à nouveau.");
  renderSuggestions(["Voir projets liés", "Voir lieux liés", "Voir événements liés"]);
  showView("detail");
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks
    .filter((task) => {
      if (currentTaskFilter === "open") return !task.done;
      if (currentTaskFilter === "done") return task.done;
      if (currentTaskFilter === "important") return task.important;
      return true;
    })
    .forEach((task) => {
      const row = document.createElement("button");
      row.className = `task-row${task.done ? " done" : ""}`;
      row.innerHTML = `<b>${task.done ? "☑" : "☐"}</b><span>${task.text} · ${task.day}${task.important ? " · important" : ""}</span>`;
      row.addEventListener("click", () => {
        task.done = !task.done;
        renderTasks();
      });
      taskList.append(row);
    });
}

function askMemory(question) {
  const lower = question.toLowerCase();
  if (lower.includes("gabriel")) {
    return "Gabriel est souvent lié à tes discussions sur les soirées festives, projets Winess et rappels d'appel.";
  }
  if (lower.includes("winess")) {
    return "Winess est relié à David, Levallois, idées cocktails, marketing et soirée premium.";
  }
  if (lower.includes("cocktail")) {
    return "Tes idées cocktails sont rattachées à Winess, au positionnement premium et aux événements.";
  }
  if (lower.includes("tâche") || lower.includes("semaine")) {
    return "Cette semaine, les tâches importantes sont : appeler Gabriel, envoyer devis à David et réserver une salle jeudi.";
  }
  return "J'ai trouvé des liens possibles dans ta mémoire. Reformule avec une personne, un lieu ou un projet pour une réponse plus précise.";
}

function resetHome() {
  input.value = "";
  resizeInput();
  stopListening();
  setVoiceStatus("Prêt.", false);
  showView("home");
  input.focus();
}

micButton.addEventListener("click", () => {
  if (isListening && recognition) {
    recognition.stop();
    return;
  }
  startVoice();
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  submitThought();
});

input.addEventListener("input", resizeInput);

examples.addEventListener("click", (event) => {
  const example = event.target.closest("button");
  if (!example) return;
  input.value = example.textContent.trim();
  resizeInput();
  input.focus();
});

quickGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  showView(button.dataset.view);
});

menuNav.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  const view = button.dataset.view;
  if (view === "ideas" || view === "people" || view === "places" || view === "important" || view === "sent" || view === "today" || view === "week" || view === "settings") {
    showView(view);
  } else if (view === "secret") {
    showView("secret");
  } else {
    showView("home");
  }
});

document.addEventListener("click", (event) => {
  const entity = event.target.closest("[data-entity]");
  if (entity) answerEntity(entity.dataset.entity);
});

taskFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  currentTaskFilter = button.dataset.filter;
  taskFilters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  renderTasks();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = smartSearch.value.trim();
  aiAnswer.textContent = question ? askMemory(question) : "Pose une question à ta mémoire.";
});

menuButton.addEventListener("click", openMenu);
backdrop.addEventListener("click", closeMenu);
logoButton.addEventListener("click", resetHome);
document.querySelector("#backHome").addEventListener("click", resetHome);
document.querySelectorAll("[data-home]").forEach((button) => button.addEventListener("click", resetHome));

unlockSecret.addEventListener("click", () => {
  secretLock.hidden = true;
  secretContent.hidden = false;
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").then((registration) => registration.update()).catch(() => {});
}

resizeInput();
