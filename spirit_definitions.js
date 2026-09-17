export const SpiritCalculations = {
    health: (ks) => Math.floor(ks / 2) + 8,
    init: (ks, bonus = 0) => `${(ks * 2) + bonus} + 2W6`,
    astralInit: (ks, bonus = 0) => `${(ks * 2) + bonus} + 3W6`
};

export const spiritDefinitions = {
    feuer: {
        name: "Feuergeist",
        movement: { walk: 5, run: 10, sprintBonus: 5 },
        attrMods: { KON: 1, GES: 2, REA: 3, STR: -2, INT: 1 },
        init: (ks) => SpiritCalculations.init(ks, 4),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 1),
        defense: (ks) => ({ astral: ks + 1, magisch: ks + 1, weltlich: (ks * 2) + 1 }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Elementarer Angriff (Feuer)", "Energieaura (Feuer)", "Materialisieren", "Unfall", "Verschlingen (Feuer)", "Verwirrung"],
        weaknesses: ["Allergie (Kälte, Schwer)", "Verwundbarkeit (Feuerlöscher)"],
        optionalPowers: ["Gifthauch", "Grauen", "Schutz", "Suche"]
    },
    erd: {
        name: "Erdgeist",
        movement: { walk: 5, run: 10, sprintBonus: 1 },
        attrMods: { KON: 4, GES: -2, REA: -1, STR: 4, LOG: -1 },
        init: (ks) => SpiritCalculations.init(ks, -1),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, -1),
        defense: (ks) => ({ astral: ks, magisch: ks + 4, weltlich: (ks * 2) + 4 }),
        skills: ["Astral", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Bindung", "Materialisieren", "Schutz", "Suche"],
        weaknesses: ["Allergie (Elektrizität, Schwer)"],
        optionalPowers: ["Elementarer Angriff (Chemisch)", "Grauen", "Verschleierung", "Verschlingen (Erde)", "Verwirrung"]
    },
    luft: {
        name: "Luftgeist",
        movement: { walk: 5, run: 10, sprintBonus: 5 },
        attrMods: { KON: -2, GES: 3, REA: 4, STR: -3 },
        init: (ks) => SpiritCalculations.init(ks, 4),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: Math.max(0, ks - 2), weltlich: Math.max(0, (ks * 2) - 2) }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Materialisieren", "Suche", "Unfall", "Verschleierung", "Verschlingen (Luft)", "Verwirrung"],
        weaknesses: ["Allergie (Toxine mit Inhalationsvektor, Schwer)"],
        optionalPowers: ["Elementarer Angriff (Elektrizität oder Kälte)", "Energieaura (Elektrizität oder Kälte)", "Gifthauch", "Grauen", "Psychokinese", "Schutz"]
    },
    wasser: {
        name: "Wassergeist",
        movement: { walk: 5, run: 10, sprintBonus: 2 },
        attrMods: { GES: 1, REA: 2 },
        init: (ks) => SpiritCalculations.init(ks, 2),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: ks, weltlich: ks * 2 }),
        skills: ["Astral", "Athletik (Schwimmen)", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Materialisieren", "Suche", "Verschleierung", "Verschlingen (Wasser)", "Verwirrung"],
        weaknesses: ["Allergie (Feuer, Schwer)"],
        optionalPowers: ["Bindung", "Elementarer Angriff (Kälte)", "Energieaura (Kälte)", "Schutz", "Unfall", "Wetterbeherrschung"]
    },
    mensch: {
        name: "Geist des Menschen",
        movement: { walk: 5, run: 10, sprintBonus: 1 },
        attrMods: { KON: 1, REA: 2, STR: -2, INT: 1 },
        init: (ks) => SpiritCalculations.init(ks, 3),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 1),
        defense: (ks) => ({ astral: ks + 1, magisch: ks + 1, weltlich: (ks * 2) + 1 }),
        skills: ["Astral", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Einfluss", "Gesteigerte Sinne (Infrarotsicht, Restlichtverstärkung)", "Materialisieren", "Schutz", "Suche", "Unfall", "Verschleierung", "Verwirrung"],
        weaknesses: ["Allergie (Eisenmetalle, Schwer)"],
        optionalPowers: ["Bewegung", "Grauen", "Natürlicher Zauberspruch", "Psychokinese"]
    },
    tier: {
        name: "Geist des Tieres",
        movement: { walk: 5, run: 10, sprintBonus: 3 },
        attrMods: { KON: 2, GES: 1, STR: 2 },
        init: (ks) => SpiritCalculations.init(ks, 0),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: ks + 2, weltlich: (ks * 2) + 2 }),
        skills: ["Astral", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Gesteigerte Sinne (Gehör, Geruch, Restlichtverstärkung)", "Grauen", "Materialisieren", "Tierbeherrschung"],
        weaknesses: ["Allergie (Silber, Schwer)"],
        optionalPowers: ["Gift", "Gifthauch", "Natürliche Waffe (Kralle/Biss)", "Schutz", "Suche", "Verschleierung", "Verwirrung"]
    },
    pflanze: {
        name: "Pflanzengeist",
        movement: { walk: 10, run: 15, sprintBonus: 1 },
        attrMods: { KON: 2, GES: -1, STR: 1, LOG: -1 },
        init: (ks) => SpiritCalculations.init(ks, 0),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, -1),
        defense: (ks) => ({ astral: ks, magisch: ks + 2, weltlich: (ks * 2) + 2 }),
        skills: ["Astral", "Exotische Waffen", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Grauen", "Magischer Schutz", "Materialisieren", "Schutz", "Stille", "Verschleierung", "Verschlingen"],
        weaknesses: [],
        optionalPowers: ["Bewegung", "Gifthauch", "Suche", "Unfall", "Verwirrung"]
    },
    beschuetzer: {
        name: "Beschützergeist",
        movement: { walk: 10, run: 15, sprintBonus: 1 },
        attrMods: { KON: 1, GES: 2, REA: 3, STR: 2 },
        init: (ks) => SpiritCalculations.init(ks, 3),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: ks + 1, weltlich: (ks * 2) + 1 }),
        skills: ["Astral", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Grauen", "Magischer Schutz", "Materialisieren", "Schutz"],
        weaknesses: [],
        optionalPowers: ["Elementarer Angriff (Element nach Wahl)", "Fertigkeitsspezialisierung (Nahkampf)", "Natürliche Waffe", "Psychokinese", "Tierbeherrschung", "Verschleierung"]
    },
    helfer: {
        name: "Helfergeist",
        movement: { walk: 10, run: 15, sprintBonus: 1 },
        attrMods: { REA: 2, STR: 2 },
        init: (ks) => SpiritCalculations.init(ks, 2),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: ks, weltlich: ks * 2 }),
        skills: ["Astral", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Bindung", "Fertigkeit (Biotech, Elektronik, Mechanik, Natur oder Steuern + Spezi & Wissen)", "Materialisieren", "Suche", "Unfall"],
        weaknesses: [],
        optionalPowers: ["Einfluss", "Fertigkeit (Zusatzwahl s. o.)", "Gesteigerte Sinne (Gehör, Geruch, Infrarotsicht, Restlichtverstärkung)", "Psychokinese", "Verschleierung"]
    },
    ratgeber: {
        name: "Ratgebergeist",
        movement: { walk: 10, run: 15, sprintBonus: 1 },
        attrMods: { KON: 3, GES: -1, REA: 2, STR: 1 },
        init: (ks) => SpiritCalculations.init(ks, 2),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 0),
        defense: (ks) => ({ astral: ks, magisch: ks + 3, weltlich: (ks * 2) + 3 }),
        skills: ["Astral", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Magischer Schutz", "Materialisieren", "Schatten", "Schutz", "Suche", "Verwirrung", "Weissagung"],
        weaknesses: [],
        optionalPowers: ["Einfluss", "Gesteigerte Sinne (Gehör, Geruch, Infrarotsicht, Restlichtverstärkung)", "Grauen", "Verschlingen"]
    },
    nuklear: {
        name: "Nukleargeist",
        movement: { walk: 5, run: 10, sprintBonus: 5 },
        attrMods: { KON: 1, GES: 2, REA: 3, STR: -2, INT: 1 },
        init: (ks) => SpiritCalculations.init(ks, 4),
        astralInit: (ks) => SpiritCalculations.astralInit(ks, 1),
        defense: (ks) => ({ astral: ks + 1, magisch: ks + 1, weltlich: (ks * 2) + 1 }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Elementarer Angriff (Strahlung)", "Energieaura (Strahlung)", "Hexerei", "Materialisieren", "Unfall", "Verschlingen (Strahlung)", "Verwirrung"],
        weaknesses: ["Allergie (Blei/Jod, Schwer)", "Verwundbarkeit (Feuerlöscher)"],
        optionalPowers: ["Gifthauch", "Grauen", "Natürlicher Zauberspruch (Strahlenblitz, Strahlenexplosion)", "Schutz", "Suche"]
    }
};
