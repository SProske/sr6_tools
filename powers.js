// Status-Effekte (Lorem Ipsum als Platzhalter)
const statusData = {
    "Panisch": "Lorem ipsum dolor sit amet: Das Ziel muss seine Handlungen nutzen, um sich aus der Gefahrenzone zu bewegen.",
    "Verängstigt": "Lorem ipsum dolor sit amet: Das Ziel erhält einen Abzug von -2 auf alle Proben.",
    "Verwirrt": "Lorem ipsum dolor sit amet: Das Ziel erleidet Würfelabzüge in Höhe der Stufe des Status.",
    "Benommen": "Lorem ipsum dolor sit amet: Das Ziel verliert seine nächste Haupthandlung.",
    "Gebrutzelt": "Lorem ipsum: Statuseffekt durch Elektrizitätsschaden.",
    "Brennend": "Lorem ipsum: Statuseffekt durch Feuerschaden.",
    "Verätzt": "Lorem ipsum: Statuseffekt durch Säure-/Chemieschaden.",
    "Unterkühlt": "Lorem ipsum: Statuseffekt durch Kälteschaden.",
    "Verstrahlt": "Lorem ipsum: Statuseffekt durch Strahlungsschaden."
};

// Kräfte-Datenbank
const powerData = {
    "Grauen": {
        shortDesc: "Versetzt ein Ziel in Panik und zwingt es zu fliehen.",
        art: "M",
        action: "H",
        range: "BF",
        duration: "Speziell",
        text: "Diese Kraft ermöglicht einem Critter, seine Opfer mit einem überwältigenden Entsetzen zu erfüllen. Das Opfer flieht voller Panik und bleibt nicht eher stehen, bis es in Sicherheit und außer Sicht des Critters ist; es erhält die Status {Panisch} und {Verängstigt}. Der Critter legt eine Vergleichende Probe auf seine Willenskraft + Magie gegen Willenskraft + Logik des Opfers ab. Das Grauen hält 1 Kampfrunde pro Nettoerfolg des Critters an, die Status halten doppelt so lange an. Und auch wenn das Entsetzen verflogen ist, muss dem Opfer eine Probe auf Willenskraft + Logik (halbe Magie des Critters; aufgerundet) gelingen, um genug Mut zu haben, dem Critter erneut gegenüberzutreten."
    },
    "Verwirrung": {
        shortDesc: "Verwirrt ein Ziel und macht es Benommen.",
        art: "M",
        action: "H",
        range: "BF",
        duration: "Aufrechterhalten",
        text: "Diese Kraft sorgt dafür, dass das Opfer unentschlossen, vergesslich und verwirrt wird. Der Critter legt eine Vergleichende Probe auf Willenskraft + Magie gegen Willenskraft + Logik des Opfers ab. Erzielt der Critter Nettoerfolge, so erhält das Opfer den Status {Verwirrt} mit einer Stufe in Höhe der Nettoerfolge sowie den Status {Benommen}."
    },
    "Elementarer Angriff": {
        shortDesc: "Fernkampfangriff mit projizierter elementarer Energie.",
        art: "P",
        action: "H",
        range: "BF",
        duration: "Sofort",
        text: "Ein Critter mit dieser Kraft kann einen tödlichen Strahl elementarer Energie projizieren, der aus einem Flammenstoß, einem Eisspeer, einem Lichtblitz, einem glibbrigen Klumpen ätzender Substanz oder Ähnlichem bestehen kann. Die Kraft entspricht immer einem bestimmten Element: Elektrizität, Feuer, Chemie, Kälte oder Strahlung.<br>Der Critter legt eine Fernkampfangriffsprobe auf <em>Geschicklichkeit + Magie</em> ab. Der Angriff hat einen Schadenswert von (Magie)K (Schadensart), die Angriffswerte sind Magie × 2 / (Magie × 2) – 2 / (Magie × 2) – 8 / (Magie × 2) – 10 / –. Fällt der Angriffswert auf 0 oder weniger, kann der Elementare Angriff diese Reichweite nicht erreichen. Das Opfer gelangt in den Status, der der Angriffs- und damit Schadensart entspricht: {Gebrutzelt} (Elektrizität), {Brennend} (Feuer), {Verätzt} (Chemisch), {Unterkühlt} (Kälte) oder {Verstrahlt} (Strahlung).",
        
        // Dynamische Angriffsgenerierung
        getAttack: (ks, powerName) => {
            // Extrahiert das Element aus der Klammer, z.B. "Feuer" aus "Elementarer Angriff (Feuer)"
            const elementMatch = powerName.match(/\(([^)]+)\)/);
            const element = elementMatch ? elementMatch[1] : "Elementar";

            // Statuszuordnung
            let statusText = "";
            if (element.includes("Feuer")) statusText = " + {Brennend}";
            else if (element.includes("Elektrizität")) statusText = " + {Gebrutzelt}";
            else if (element.includes("Chemisch")) statusText = " + {Verätzt}";
            else if (element.includes("Kälte")) statusText = " + {Unterkühlt}";
            else if (element.includes("Strahlung")) statusText = " + {Verstrahlt}";

            const aw1 = ks * 2;
            const aw2 = (ks * 2) - 2;
            const aw3 = (ks * 2) - 8;
            const aw4 = (ks * 2) - 10;

            return `<strong>Elementarer Angriff (${element}):</strong> Schaden ${ks}K (${element})${statusText} | Probe: Geschicklichkeit + Magie | AW [${aw1} / ${aw2} / ${aw3} / ${aw4} / -]`;
        }
    }
};
