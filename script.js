const screens = [...document.querySelectorAll(".screen")];
const menuPanel = document.querySelector("#menuPanel");
const bellPopover = document.querySelector("#bellPopover");
const memorySheet = document.querySelector("#memorySheet");
const faceLock = document.querySelector("#faceLock");
const secretContent = document.querySelector("#secretContent");
const voiceBar = document.querySelector("#voiceBar");
const voiceStatus = document.querySelector("#voiceStatus");
const sheetTitle = document.querySelector("#sheetTitle");
const sheetKicker = document.querySelector("#sheetKicker");
const sheetSummary = document.querySelector("#sheetSummary");
const sheetProposal = document.querySelector("#sheetProposal");
const topicList = document.querySelector("#topicList");
const sheetChips = document.querySelector("#sheetChips");

const memories = {
  gabriel: {
    title: "Gabriel",
    kicker: "Ce que j'ai retrouvé :",
    summary: "Vous aviez parlé d'une soirée péniche premium, avec tables, ambiance événement et organisation sérieuse.",
    proposal: "Voir tous les sujets avec Gabriel",
    topicsTitle: "Gabriel — sujets liés",
    chips: [
      { label: "🚢 Soirée péniche", key: "peniche" },
      { label: "💡 Projet soirée", key: "projet-soiree" },
      { label: "👥 Tables", key: "tables" },
      { label: "🍷 Alcool", key: "alcool" },
    ],
    topics: [
      {
        title: "Soirée péniche",
        key: "peniche",
        summary: "Vous aviez parlé d'une idée de soirée premium autour d'une péniche, avec tables, ambiance événement et organisation sérieuse.",
      },
      {
        title: "Projet soirée",
        key: "projet-soiree",
        summary: "Gabriel semblait lié à une réflexion sur l'organisation d'une soirée festive avec un vrai potentiel business.",
      },
      {
        title: "Lieux évoqués",
        key: "noubba",
        summary: "Certains lieux avaient été envisagés ou mentionnés pour accueillir l'événement.",
      },
      {
        title: "Tables / budget / alcool",
        key: "tables",
        summary: "Le sujet tournait aussi autour du nombre de tables, du budget, de l'alcool et de la rentabilité.",
      },
    ],
  },
  didier: {
    title: "Didier",
    kicker: "Lien récent :",
    summary: "Didier est lié au déjeuner chez Noubba à Levallois et à un appel récent à ne pas laisser filer.",
    chips: [
      { label: "🍽 Déjeuner", key: "noubba" },
      { label: "📞 Appel récent", key: "didier" },
    ],
  },
  noubba: {
    title: "Noubba — Levallois",
    kicker: "Lieu retrouvé :",
    summary: "Noubba Levallois est associé au rendez-vous avec Didier à 13h. C'est un repère simple pour ta journée.",
    chips: [
      { label: "👤 Didier", key: "didier" },
      { label: "☀️ Aujourd'hui", key: "noubba" },
    ],
  },
  jonathan: {
    title: "Jonathan Cohen",
    kicker: "À garder en tête :",
    summary: "Jonathan Cohen est lié à un appel prévu à 15h. L'important est de ne pas le laisser passer.",
    chips: [
      { label: "📞 Appel", key: "jonathan" },
      { label: "🕒 15h", key: "jonathan" },
    ],
  },
  shabbat: {
    title: "Vin pour Shabbat",
    kicker: "Signal important :",
    summary: "Tu avais noté cette semaine qu'il ne fallait pas oublier le vin pour Shabbat, surtout avant vendredi.",
    chips: [
      { label: "🍷 Vin", key: "shabbat" },
      { label: "🗓 Vendredi", key: "shabbat" },
    ],
  },
  peniche: {
    title: "Soirée péniche",
    kicker: "Sujet lié :",
    summary: "L'idée tourne autour d'une soirée premium sur péniche, avec une ambiance soignée et une organisation carrée.",
    chips: [
      { label: "👤 Gabriel", key: "gabriel" },
      { label: "💡 Projet soirée", key: "projet-soiree" },
      { label: "🍷 Alcool", key: "alcool" },
    ],
  },
  "projet-soiree": {
    title: "Projet soirée",
    kicker: "Intuition retrouvée :",
    summary: "Le projet semble avoir un angle business : tables, budget, expérience premium et rentabilité.",
    chips: [
      { label: "👤 Gabriel", key: "gabriel" },
      { label: "🚢 Péniche", key: "peniche" },
    ],
  },
  tables: {
    title: "Tables",
    kicker: "Détail utile :",
    summary: "Les tables reviennent comme un point central : capacité, prix, placement et équilibre économique.",
    chips: [
      { label: "💡 Projet soirée", key: "projet-soiree" },
      { label: "🍷 Alcool", key: "alcool" },
    ],
  },
  alcool: {
    title: "Alcool",
    kicker: "Point associé :",
    summary: "L'alcool est lié à l'ambiance, au budget et à la rentabilité de la soirée péniche.",
    chips: [
      { label: "🚢 Soirée péniche", key: "peniche" },
      { label: "👥 Tables", key: "tables" },
    ],
  },
};

function closeFloating() {
  menuPanel.classList.remove("open");
  bellPopover.classList.remove("open");
  menuPanel.setAttribute("aria-hidden", "true");
  bellPopover.setAttribute("aria-hidden", "true");
}

function showScreen(name) {
  closeFloating();
  memorySheet.classList.remove("open");
  memorySheet.setAttribute("aria-hidden", "true");
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  if (name === "secret") {
    faceLock.classList.remove("unlocked");
    secretContent.classList.remove("visible");
    window.setTimeout(() => {
      faceLock.classList.add("unlocked");
      secretContent.classList.add("visible");
    }, 850);
  }
}

function renderChips(memory) {
  sheetChips.innerHTML = "";
  (memory.chips || []).forEach((chip) => {
    const button = document.createElement("button");
    button.textContent = chip.label;
    button.dataset.memory = chip.key;
    button.className = "smart-link";
    sheetChips.append(button);
  });
}

function renderTopics(memory) {
  topicList.innerHTML = "";
  if (!memory.topics) return;

  const heading = document.createElement("h2");
  heading.textContent = memory.topicsTitle;
  topicList.append(heading);

  memory.topics.forEach((topic) => {
    const button = document.createElement("button");
    button.className = "topic-card";
    button.dataset.memory = topic.key;
    button.innerHTML = `<strong>${topic.title}</strong><span>${topic.summary}</span>`;
    topicList.append(button);
  });
}

function openMemory(key, expanded = false) {
  const memory = memories[key] || memories.gabriel;
  closeFloating();
  sheetTitle.textContent = memory.title;
  sheetKicker.textContent = memory.kicker;
  sheetSummary.textContent = `"${memory.summary}"`;
  sheetProposal.innerHTML = "";
  topicList.innerHTML = "";

  if (memory.proposal) {
    const proposalButton = document.createElement("button");
    proposalButton.textContent = memory.proposal;
    proposalButton.addEventListener("click", () => renderTopics(memory));
    sheetProposal.append(proposalButton);
  }

  renderChips(memory);
  if (expanded) renderTopics(memory);
  memorySheet.classList.add("open");
  memorySheet.setAttribute("aria-hidden", "false");
}

function activateVoice() {
  voiceBar.classList.add("listening");
  voiceStatus.textContent = "j'écoute...";
  voiceStatus.classList.add("active");
  window.setTimeout(() => {
    voiceStatus.textContent = "commande vocale active";
  }, 700);
}

document.querySelector("#logoButton").addEventListener("click", () => {
  showScreen("home");
});

document.querySelector("#micButton").addEventListener("click", (event) => {
  event.stopPropagation();
  activateVoice();
});

document.querySelector("#morningPill").addEventListener("click", () => {
  showScreen("evening");
});

document.querySelector("#closeSheet").addEventListener("click", () => {
  memorySheet.classList.remove("open");
  memorySheet.setAttribute("aria-hidden", "true");
});

document.querySelector("#bellButton").addEventListener("click", () => {
  menuPanel.classList.remove("open");
  menuPanel.setAttribute("aria-hidden", "true");
  bellPopover.classList.toggle("open");
  bellPopover.setAttribute("aria-hidden", String(!bellPopover.classList.contains("open")));
});

document.querySelector("#menuButton").addEventListener("click", () => {
  bellPopover.classList.remove("open");
  bellPopover.setAttribute("aria-hidden", "true");
  menuPanel.classList.toggle("open");
  menuPanel.setAttribute("aria-hidden", String(!menuPanel.classList.contains("open")));
});

document.querySelectorAll(".menu-panel button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    if (target) showScreen(target);
    if (button.dataset.openMemory) {
      window.setTimeout(() => openMemory("gabriel"), 260);
    }
  });
});

document.querySelectorAll(".check-row").forEach((row) => {
  row.addEventListener("click", () => {
    const done = row.dataset.check !== "true";
    row.dataset.check = String(done);
    row.classList.toggle("done", done);
    row.querySelector("b").textContent = done ? "✅" : "⬜";
  });
});

document.addEventListener("click", (event) => {
  const smartTarget = event.target.closest("[data-memory]");
  if (smartTarget) {
    openMemory(smartTarget.dataset.memory);
    return;
  }

  const keepOpen = event.target.closest(".popover, .menu-panel, .icon-button, .brand, .sheet, .living-line, .voice-bar");
  if (!keepOpen) closeFloating();
});
