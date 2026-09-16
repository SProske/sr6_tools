// Status-Effekte (Lorem Ipsum als Platzhalter)
const statusData = {
    "Panisch": "Lorem ipsum dolor sit amet: Das Ziel muss seine Handlungen nutzen, um sich aus der Gefahrenzone zu bewegen.",
    "Verängstigt": "Lorem ipsum dolor sit amet: Das Ziel erhält einen Abzug von -2 auf alle Proben.",
    "Verwirrt": "Lorem ipsum dolor sit amet: Das Ziel erleidet Würfelabzüge in Höhe der Stufe des Status.",
    "Benommen": "Lorem ipsum dolor sit amet: Das Ziel verliert seine nächste Haupthandlung."
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
    // Fallback-Einträge für Kräfte ohne hinterlegte Details
    "Astrale Gestalt": { shortDesc: "Existent im Astralraum.", text: "Der Geist existiert nativ in der Astralebene." },
    "Bewusstsein": { shortDesc: "Wahrnehmung von Magie und Astralraum.", text: "Erlaubt astrale Wahrnehmung." },
    "Elementarer Angriff (Feuer)": { shortDesc: "Fernkampfangriff mit Feuerelement.", text: "Fügt Feuer-Schaden zu." },
    "Energieaura (Feuer)": { shortDesc: "Hüllt den Geist in Flammen.", text: "Fügt Angreifern im Nahkampf Schaden zu." },
    "Materialisieren": { shortDesc: "Ermöglicht das Erscheinen in der physischen Welt.", text: "Der Geist nimmt physische Form an." },
    "Unfall": { shortDesc: "Verursacht ein Missgeschick beim Ziel.", text: "Zwingt das Ziel zu einer Patzer-Probe." },
    "Verschlingen (Feuer)": { shortDesc: "Hüllt ein Ziel in Flammen ein.", text: "Ziel erleidet kontinuierlichen Schaden." },
    "Gifthauch": { shortDesc: "Haucht eine giftige Wolke aus.", text: "Atemschutz oder Giftwiderstand erforderlich." },
    "Schutz": { shortDesc: "Gewährt einem Ziel Verteidigungsboni.", text: "Erhöht den Verteidigungswert des Ziels." },
    "Suche": { shortDesc: "Spürt Personen oder Gegenstände auf.", text: "Der Geist kann Ziele über Distanzen lokalisieren." }
};
