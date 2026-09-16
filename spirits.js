const spiritData = {
    feuer: {
        name: "Feuergeist",
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
        attacks: (ks) => [
            `<strong>Elementarer Angriff:</strong> Schaden ${ks}K | Angriffswerte [${ks * 2} / ${(ks * 2) - 2} / ${(ks * 2) - 8} / ${(ks * 2) - 10} / -]`,
            `<strong>Verschlingen:</strong> Schaden ${ks + 2}K + Brennend | Angriffswerte [${(ks * 2) + 1} / - / - / - / -]`
        ]
    }
    // Hier kannst du später Luft, Erde, Wasser etc. einfach unten anhängen
};
