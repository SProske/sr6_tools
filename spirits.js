const spiritData = {
    feuer: {
        name: "Feuergeist",
        movement: "5 / 10 / +5",
        attributes: (ks) => ({
            "KON": ks + 1, "GES": ks + 2, "REA": ks + 3, "STR": Math.max(1, ks - 2),
            "WIL": ks, "LOG": ks, "INT": ks + 1, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 4} + 2W6`,
        astralInit: (ks) => `${(ks * 2) + 1} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks + 1,
            magisch: ks + 1,
            weltlich: (ks * 2) + 1
        }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Elementarer Angriff (Feuer)", "Energieaura (Feuer)", "Materialisieren", "Unfall", "Verschlingen (Feuer)", "Verwirrung"],
        weaknesses: ["Allergie (Kälte, Schwer)", "Verwundbarkeit (Feuerlöscher)"],
        optionalPowers: ["Gifthauch", "Grauen", "Schutz", "Suche"],
        attacks: (ks) => []
    },
    erd: {
        name: "Erdgeist",
        movement: "5 / 10 / +1",
        attributes: (ks) => ({
            "KON": ks + 4, "GES": Math.max(1, ks - 2), "REA": Math.max(1, ks - 1), "STR": ks + 4,
            "WIL": ks, "LOG": Math.max(1, ks - 1), "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) - 1} + 2W6`,
        astralInit: (ks) => `${(ks * 2) - 1} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks + 4,
            weltlich: (ks * 2) + 4
        }),
        skills: ["Astral", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Bindung", "Materialisieren", "Schutz", "Suche"],
        weaknesses: ["Allergie (Elektrizität, Schwer)"],
        optionalPowers: ["Elementarer Angriff (Chemisch)", "Grauen", "Verschleierung", "Verschlingen (Erde)", "Verwirrung"],
        attacks: (ks) => []
    },
    luft: {
        name: "Luftgeist",
        movement: "5 / 10 / +5",
        attributes: (ks) => ({
            "KON": Math.max(1, ks - 2), "GES": ks + 3, "REA": ks + 4, "STR": Math.max(1, ks - 3),
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 4} + 2W6`,
        astralInit: (ks) => `${(ks * 2)} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: Math.max(0, ks - 2),
            weltlich: Math.max(0, (ks * 2) - 2)
        }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Materialisieren", "Suche", "Unfall", "Verschleierung", "Verschlingen (Luft)", "Verwirrung"],
        weaknesses: ["Allergie (Toxine mit Inhalationsvektor, Schwer)"],
        optionalPowers: ["Elementarer Angriff (Elektrizität oder Kälte)", "Energieaura (Elektrizität oder Kälte)", "Gifthauch", "Grauen", "Psychokinese", "Schutz"],
        attacks: (ks) => []
    },
    wasser: {
        name: "Wassergeist",
        movement: "5 / 10 / +2",
        attributes: (ks) => ({
            "KON": ks, "GES": ks + 1, "REA": ks + 2, "STR": ks,
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 2} + 2W6`,
        astralInit: (ks) => `${(ks * 2)} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks,
            weltlich: ks * 2
        }),
        skills: ["Astral", "Athletik (Schwimmen)", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Materialisieren", "Suche", "Verschleierung", "Verschlingen (Wasser)", "Verwirrung"],
        weaknesses: ["Allergie (Feuer, Schwer)"],
        optionalPowers: ["Bindung", "Elementarer Angriff (Kälte)", "Energieaura (Kälte)", "Schutz", "Unfall", "Wetterbeherrschung"],
        attacks: (ks) => []
    },
    mensch: {
        name: "Geist des Menschen",
        movement: "5 / 10 / +1",
        attributes: (ks) => ({
            "KON": ks + 1, "GES": ks, "REA": ks + 2, "STR": Math.max(1, ks - 2),
            "WIL": ks, "LOG": ks, "INT": ks + 1, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 3} + 2W6`,
        astralInit: (ks) => `${(ks * 2) + 1} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks + 1,
            magisch: ks + 1,
            weltlich: (ks * 2) + 1
        }),
        skills: ["Astral", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Einfluss", "Gesteigerte Sinne (Infrarotsicht, Restlichtverstärkung)", "Materialisieren", "Schutz", "Suche", "Unfall", "Verschleierung", "Verwirrung"],
        weaknesses: ["Allergie (Eisenmetalle, Schwer)"],
        optionalPowers: ["Bewegung", "Grauen", "Natürlicher Zauberspruch", "Psychokinese"],
        attacks: (ks) => [
            `<strong>Fäuste:</strong> Schaden ${Math.max(0, Math.floor(ks / 2) - 1)}B | Angriffswerte [${ks * 2} / - / - / - / -]`
        ]
    },
    tier: {
        name: "Geist des Tieres",
        movement: "5 / 10 / +3",
        attributes: (ks) => ({
            "KON": ks + 2, "GES": ks + 1, "REA": ks, "STR": ks + 2,
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${ks * 2} + 2W6`,
        astralInit: (ks) => `${ks * 2} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks + 2,
            weltlich: (ks * 2) + 2
        }),
        skills: ["Astral", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Gesteigerte Sinne (Gehör, Geruch, Restlichtverstärkung)", "Grauen", "Materialisieren", "Tierbeherrschung"],
        weaknesses: ["Allergie (Silber, Schwer)"],
        optionalPowers: ["Gift", "Gifthauch", "Natürliche Waffe (Kralle/Biss)", "Schutz", "Suche", "Verschleierung", "Verwirrung"],
        attacks: (ks) => [
            `<strong>Kralle/Biss:</strong> Schaden ${Math.floor(ks / 2) + 1}K | Angriffswerte [${(ks * 2) + 2} / - / - / - / -]`
        ]
    },
    pflanze: {
        name: "Pflanzengeist",
        movement: "10 / 15 / +1",
        attributes: (ks) => ({
            "KON": ks + 2, "GES": Math.max(1, ks - 1), "REA": ks, "STR": ks + 1,
            "WIL": ks, "LOG": Math.max(1, ks - 1), "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${ks * 2} + 2W6`,
        astralInit: (ks) => `${(ks * 2) - 1} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks + 2,
            weltlich: (ks * 2) + 2
        }),
        skills: ["Astral", "Exotische Waffen", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Grauen", "Magischer Schutz", "Materialisieren", "Schutz", "Stille", "Verschleierung", "Verschlingen"],
        weaknesses: [],
        optionalPowers: ["Bewegung", "Gifthauch", "Suche", "Unfall", "Verwirrung"],
        attacks: (ks) => []
    },
    beschuetzer: {
        name: "Beschützergeist",
        movement: "10 / 15 / +1",
        attributes: (ks) => ({
            "KON": ks + 1, "GES": ks + 2, "REA": ks + 3, "STR": ks + 2,
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 3} + 2W6`,
        astralInit: (ks) => `${ks * 2} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks + 1,
            weltlich: (ks * 2) + 1
        }),
        skills: ["Astral", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Grauen", "Magischer Schutz", "Materialisieren", "Schutz"],
        weaknesses: [],
        optionalPowers: ["Elementarer Angriff (Element nach Wahl)", "Fertigkeitsspezialisierung (Nahkampf)", "Natürliche Waffe", "Psychokinese", "Tierbeherrschung", "Verschleierung"],
        attacks: (ks) => [
            `<strong>Natürliche Waffe:</strong> Schaden ${Math.floor(ks / 2) + 1}K | Angriffswerte [${(ks * 2) + 5} / - / - / - / -]`
        ]
    },
    helfer: {
        name: "Helfergeist",
        movement: "10 / 15 / +1",
        attributes: (ks) => ({
            "KON": ks, "GES": ks, "REA": ks + 2, "STR": ks + 2,
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 2} + 2W6`,
        astralInit: (ks) => `${ks * 2} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks,
            weltlich: ks * 2
        }),
        skills: ["Astral", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewegung", "Bewusstsein", "Bindung", "Fertigkeit (Biotech, Elektronik, Mechanik, Natur oder Steuern + Spezi & Wissen)", "Materialisieren", "Suche", "Unfall"],
        weaknesses: [],
        optionalPowers: ["Einfluss", "Fertigkeit (Zusatzwahl s. o.)", "Gesteigerte Sinne (Gehör, Geruchssinn, Infrarotsicht oder Restlichtverstärkung)", "Psychokinese", "Verschleierung"],
        attacks: (ks) => []
    },
    ratgeber: {
        name: "Ratgebergeist",
        movement: "10 / 15 / +1",
        attributes: (ks) => ({
            "KON": ks + 3, "GES": Math.max(1, ks - 1), "REA": ks + 2, "STR": ks + 1,
            "WIL": ks, "LOG": ks, "INT": ks, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 2} + 2W6`,
        astralInit: (ks) => `${ks * 2} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks,
            magisch: ks + 3,
            weltlich: (ks * 2) + 3
        }),
        skills: ["Astral", "Hexerei", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Magischer Schutz", "Materialisieren", "Schatten", "Schutz", "Suche", "Verwirrung", "Weissagung"],
        weaknesses: [],
        optionalPowers: ["Einfluss", "Gesteigerte Sinne (Gehör, Geruchssinn, Infrarotsicht oder Restlichtverstärkung)", "Grauen", "Verschlingen"],
        attacks: (ks) => []
    },
    nuklear: {
        name: "Nukleargeist",
        movement: "5 / 10 / +5",
        attributes: (ks) => ({
            "KON": ks + 1, "GES": ks + 2, "REA": ks + 3, "STR": Math.max(1, ks - 2),
            "WIL": ks, "LOG": ks, "INT": ks + 1, "CHA": ks, "M": ks, "ESS": ks
        }),
        init: (ks) => `${(ks * 2) + 4} + 2W6`,
        astralInit: (ks) => `${(ks * 2) + 1} + 3W6`,
        health: (ks) => Math.floor(ks / 2) + 8,
        defense: (ks) => ({
            astral: ks + 1,
            magisch: ks + 1,
            weltlich: (ks * 2) + 1
        }),
        skills: ["Astral", "Athletik", "Exotische Waffen", "Nahkampf", "Wahrnehmung"],
        powers: ["Astrale Gestalt", "Bewusstsein", "Elementarer Angriff (Strahlung)", "Energieaura (Strahlung)", "Hexerei", "Materialisieren", "Unfall", "Verschlingen (Strahlung)", "Verwirrung"],
        weaknesses: ["Allergie (Blei/Jod, Schwer)", "Verwundbarkeit (Feuerlöscher)"],
        optionalPowers: ["Gifthauch", "Grauen", "Natürlicher Zauberspruch (Strahlenblitz, Strahlenexplosion)", "Schutz", "Suche"],
        attacks: (ks) => []
    }
};
