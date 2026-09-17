import { ELEMENT_STATUS_MAP } from './status.js';

export const powerData = {
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
        getAttack: (ks, powerName, attrs) => {
            const elementMatch = powerName.match(/\(([^)]+)\)/);
            const element = elementMatch ? elementMatch[1] : "Elementar";
            const statusName = ELEMENT_STATUS_MAP[element];
            const statusText = statusName ? ` + {${statusName}}` : "";

            const ges = attrs?.["GES"] ?? ks;
            const mag = attrs?.["M"] ?? ks;
            const pool = ges + mag;

            const rawAWs = [ks * 2, (ks * 2) - 2, (ks * 2) - 8, (ks * 2) - 10, 0];
            const formattedAWs = rawAWs.map((val, index) => (index < 4 && val > 0) ? val : "-").join(" / ");

            return `<strong>Elementarer Angriff (${element}):</strong> Schaden ${ks}K (${element})${statusText} | Probe: ${pool} (Geschicklichkeit + Magie) | AW ${formattedAWs}`;
        }
    },
    "Natürliche Waffe": {
        shortDesc: "Verwandelt waffenlose Nahkampfangriffe in körperlichen Schaden.",
        art: "P",
        action: "Auto",
        range: "B",
        duration: "Sofort",
        text: "Zähne, Klauen, ein stacheliger Schwanz – der Critter ist von der Natur mit einem Werkzeug ausgestattet worden, mit dem er anderen Körperlichen Schaden zufügen kann. Ein Critter verwendet die Fertigkeit <em>Nahkampf</em> für eine natürliche Nahkampfwaffe. Ein dualer Critter mit einer Natürlichen Nahkampfwaffe kann diese Kraft auch gegen astrale Ziele innerhalb seiner Reichweite einsetzen."
    },
    "Energieaura": {
        shortDesc: "Hüllt den Critter in Energie; erhöht Nahkampfschaden und AW und fügt Angreifern Schaden zu.",
        art: "P",
        action: "Auto",
        range: "Selbst",
        duration: "Immer",
        text: "Der Critter ist von einem Feld zerstörerischer Energie umgeben, die die Form von Feuer, Kälte, Elektrizität, Strahlung oder einer ätzenden chemischen Substanz haben kann. Die Kraft bezieht sich immer auf ein bestimmtes Element.<br>Der Critter erhöht den Schadenswert jedes Nahkampfangriffs um sein halbes Magieattribut (aufgerundet). Die Schadensart versetzt das Opfer in den entsprechenden Status – {Gebrutzelt} (Elektrizität), {Brennend} (Feuer), {Verätzt} (Chemisch), {Unterkühlt} (Kälte) oder {Verstrahlt} (Strahlung) – und erhöht den Angriffswert um das Magieattribut des Critters.<br>Erfolgreiche waffenlose Nahkampfangriffe gegen einen Critter mit einer Energieaura fügen dem Angreifer ebenfalls Schaden in Höhe von (Magie)K + Status zu."
    }
};

export function getPowerData(powerName) {
    if (powerData[powerName]) return powerData[powerName];
    const baseName = powerName.split('(')[0].trim();
    if (powerData[baseName]) return powerData[baseName];
    return { shortDesc: "Keine Kurzbeschreibung verfügbar.", text: "Keine Regeldetails hinterlegt." };
}
