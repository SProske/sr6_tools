import { ELEMENT_STATUS_MAP } from './status.js';

export function parsePowerString(powerName) {
    const match = powerName.match(/^([^(]+)(?:\(([^)]+)\))?/);
    return {
        baseName: match ? match[1].trim() : powerName.trim(),
        param: match && match[2] ? match[2].trim() : null
    };
}

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
        getGrantedAttack: (spirit, powerName) => {
            const elementMatch = powerName.match(/\(([^)]+)\)/);
            const element = elementMatch ? elementMatch[1] : "Elementar";
            const ks = spirit.ks;
            const ges = spirit.attributes["GES"];
            const mag = spirit.attributes["M"];

            return {
                name: `Elementarer Angriff (${element})`,
                damageValue: ks,
                damageType: "K",
                element: element,
                status: ELEMENT_STATUS_MAP[element] || null,
                poolValue: ges + mag,
                poolDesc: "Geschicklichkeit + Magie",
                rangeBands: [ks * 2, (ks * 2) - 2, (ks * 2) - 8, (ks * 2) - 10, 0]
            };
        }
    },
    "Natürliche Waffe": {
        shortDesc: "Verwandelt waffenlose Nahkampfangriffe in körperlichen Schaden.",
        art: "P",
        action: "Auto",
        range: "B",
        duration: "Sofort",
        text: "Zähne, Klauen, ein stacheliger Schwanz – der Critter ist von der Natur mit einem Werkzeug ausgestattet worden, mit dem er anderen Körperlichen Schaden zufügen kann. Ein Critter verwendet die Fertigkeit <em>Nahkampf</em> für eine natürliche Nahkampfwaffe. Ein dualer Critter mit einer Natürlichen Nahkampfwaffe kann diese Kraft auch gegen astrale Ziele innerhalb seiner Reichweite einsetzen.",
        modifyBaseAttack: (attack, spirit, powerName) => {
            const { param } = parsePowerString(powerName);
            attack.name = param || "Natürliche Waffe";
            attack.damageType = "K";
            attack.damageValue = Math.max(2, Math.floor(spirit.ks / 2) - 1);
        }
    },
    "Energieaura": {
        shortDesc: "Hüllt den Critter in Energie; erhöht Nahkampfschaden und AW und fügt Angreifern Schaden zu.",
        art: "P",
        action: "Auto",
        range: "Selbst",
        duration: "Immer",
        text: "Der Critter ist von einem Feld zerstörerischer Energie umgeben, die die Form von Feuer, Kälte, Elektrizität, Strahlung oder einer ätzenden chemischen Substanz haben kann. Die Kraft bezieht sich immer auf ein bestimmtes Element.<br>Der Critter erhöht den Schadenswert jedes Nahkampfangriffs um sein halbes Magieattribut (aufgerundet). Die Schadensart versetzt das Opfer in den entsprechenden Status – {Gebrutzelt} (Elektrizität), {Brennend} (Feuer), {Verätzt} (Chemisch), {Unterkühlt} (Kälte) oder {Verstrahlt} (Strahlung) – und erhöht den Angriffswert um das Magieattribut des Critters.<br>Erfolgreiche waffenlose Nahkampfangriffe gegen einen Critter mit einer Energieaura fügen dem Angreifer ebenfalls Schaden in Höhe von (Magie)K + Status zu.",
        modifyBaseAttack: (attack, spirit, powerName) => {
            const elementMatch = powerName.match(/\(([^)]+)\)/);
            const element = elementMatch ? elementMatch[1] : "Energie";
            const mag = spirit.attributes["M"];

            attack.name += ` (${element})`;
            attack.damageValue += Math.ceil(mag / 2);
            attack.damageType = "K";
            attack.element = element;
            attack.status = ELEMENT_STATUS_MAP[element] || null;
            attack.rangeBands[0] += mag;
        }
    },
    "Verschlingen": {
        shortDesc: "Zieht ein Opfer in sich hinein, umschlingt es und fügt ihm kontinuierlich Schaden zu.",
        art: "P", action: "H", range: "B", duration: "Aufrechterhalten",
        
        // Dynamischer Regeltext: Zeigt bei Elementarvarianten nur den relevanten Zusatz
        getText: (powerName) => {
            const { param } = parsePowerString(powerName);
            const baseText = "Diese Kraft ermöglicht einem Critter, ein Opfer in sich selbst oder in das von ihm beherrschte Terrain hineinzuziehen, es zu verschlingen oder zu ersticken und ihm dadurch Schaden zuzufügen. Es handelt sich um einen Nahkampfangriff mit einem Schadenswert von (Magie)K (Schadensart) sowie speziellen Auswirkungen je nach Element; der Angriffswert erhöht sich um die Magie des Critters, und der Critter hält das Opfer fest umschlungen. Nettoerfolge bei der Nahkampfprobe erhöhen den Schaden wie üblich, und das Opfer kann eine normale Schadenswiderstandsprobe ablegen. Aber selbst wenn das Opfer sämtlichen Schaden abwendet, bleibt es trotzdem umschlungen und befindet sich im Status {Bewegungsunfähig}. Immer, wenn der Critter in einer Kampfrunde an der Reihe ist, verursacht er automatisch den gleichen Schaden wie oben am umschlungenen Opfer. Ist das Opfer an der Reihe, kann es eine Haupthandlung aufwenden, um einen Befreiungsversuch zu unternehmen (Vergleichende Probe auf <em>Athletik + Stärke</em> gegen <em>Konstitution + Magie</em> des Critters).";

            const elementTexts = {
                "Erde": "<br><br><strong>Verschlingen durch Erde:</strong> Das Opfer leistet Widerstand gegen (Magie + 2)K Schaden. Es erhält den Status {Erschöpft I}.",
                "Feuer": "<br><br><strong>Verschlingen durch Feuer:</strong> Das Opfer leistet Widerstand gegen (Magie + 2)K Schaden und erhält den Status {Brennend}, solange es umschlungen ist, sowie noch eine weitere Kampfrunde lang.",
                "Luft": "<br><br><strong>Verschlingen durch Luft:</strong> Das Opfer leistet Widerstand gegen (Magie + 2)B Schaden. Wird das Opfer durch den Schaden bewusstlos, erleidet es weiter Schaden, wobei der überzählige Betäubungsschaden wie üblich zu Körperlichem Schaden wird. Das Opfer erhält den Status {Erschöpft I}.",
                "Wasser": "<br><br><strong>Verschlingen durch Wasser:</strong> Das Opfer leistet Widerstand gegen (Magie + 2)B Schaden. Wird das Opfer durch den Betäubungsschaden bewusstlos, erleidet es weiter Schaden, wobei der Betäubungsschaden wie üblich in Körperlichen Schaden überfließt. Das Opfer erhält die Status {Nass} und {Erschöpft I}."
            };

            if (param && elementTexts[param]) {
                return baseText + elementTexts[param];
            }

            // Fallback für generisches Verschlingen: Alle Varianten auflisten
            return baseText + "<br><br>" + Object.values(elementTexts).join("<br>");
        },

        // Generierung des Nahkampfangriffs
        getGrantedAttack: (spirit, powerName) => {
            const { param } = parsePowerString(powerName);
            const mag = spirit.attributes["M"] || spirit.ks;
            const ges = spirit.attributes["GES"] || spirit.ks;
            const rea = spirit.attributes["REA"] || spirit.ks;
            const str = spirit.attributes["STR"] || spirit.ks;

            let dmgValue = mag;
            let dmgType = "K";
            let statusList = ["Bewegungsunfähig"];

            // Element-Spezifika
            if (param === "Erde") {
                dmgValue = mag + 2;
                dmgType = "K";
                statusList.push("Erschöpft I");
            } else if (param === "Feuer") {
                dmgValue = mag + 2;
                dmgType = "K";
                statusList.push("Brennend");
            } else if (param === "Luft") {
                dmgValue = mag + 2;
                dmgType = "B";
                statusList.push("Erschöpft I");
            } else if (param === "Wasser") {
                dmgValue = mag + 2;
                dmgType = "B";
                statusList.push("Nass", "Erschöpft I");
            } else if (param === "Strahlung") {
                dmgValue = mag;
                dmgType = "K";
                statusList.push("Verstrahlt");
            }

            // AW im Nahkampf = REA + STR + Magie
            const baseAw = rea + str + mag;

            return {
                name: param ? `Verschlingen (${param})` : "Verschlingen",
                damageValue: dmgValue,
                damageType: dmgType,
                element: param,
                status: statusList.join(", "),
                poolValue: ges + spirit.ks,
                poolDesc: "Nahkampf + Geschicklichkeit",
                rangeBands: [baseAw, 0, 0, 0, 0]
            };
        }
    },
    "Gifthauch": {
        shortDesc: "Setzt Opfer über einen Sprühangriff mit einem Betäubungsgift außer Gefecht.",
        art: "P", action: "H", range: "Speziell", duration: "Sofort",
        text: "Ein Critter mit dieser Kraft kann seine Opfer mit einem ekelerregenden Gestank außer Gefecht setzen. Spieltechnisch ist dies eine Sprühangriffsprobe auf <em>Geschicklichkeit + Magie</em> des Critters mit den Angriffswerten Magie × 2 / Magie / – / – / –. Für den Giftangriff gilt: Vektor: Inhalation; Geschwindigkeit: Sofort; Kraft: Magie des Critters; Wirkung: Betäubungsschaden, {Benommen}, {Übelkeit}. Panzerung ist nutzlos, aber eine aktive Chemische Versiegelung funktioniert normal.",

        getGrantedAttack: (spirit, powerName) => {
            const mag = spirit.attributes["M"] || spirit.ks;
            const ges = spirit.attributes["GES"] || spirit.ks;

            return {
                name: "Gifthauch",
                damageValue: mag,
                damageType: "B",
                element: null,
                status: "Benommen, Übelkeit",
                poolValue: ges + mag,
                poolDesc: "Geschicklichkeit + Magie",
                rangeBands: [mag * 2, mag, 0, 0, 0]
            };
        }
    },
    "Bewusstsein": {
        shortDesc: "Verleiht Verstand analog zum Homo sapiens und erlaubt ungeübte Proben.",
        art: "M",
        action: "Auto",
        range: "Selbst",
        duration: "Immer",
        text: "Critter mit dieser Kraft sind sich ihrer selbst bewusst, werden nicht mehr primär vom Instinkt getrieben und besitzen im Allgemeinen eine ähnliche Intelligenz wie der Homo sapiens. Sie gelten nicht als ahnungslos, sondern können Fertigkeiten, die sie nicht besitzen, ungeübt einsetzen sowie neue Fertigkeiten erlernen."
    },
    "Astrale Gestalt": {
        shortDesc: "Existiert rein auf der Astralebene; immun gegen physische Effekte.",
        art: "M",
        action: "Auto",
        range: "Selbst",
        duration: "Immer",
        text: "Der Critter existiert ausschließlich auf der Astralebene und ist immun gegen physische Angriffe. Er kann nur durch astrale Angriffe, Manazauber oder Mana-Kräfte verletzt werden und nur auf astrale Wesen, Dualwesen oder astral wahrnehmende/projizierende Personen einwirken. Auf der physischen Ebene kann er sich lediglich manifestieren."
    },
    "Materialisieren": {
        shortDesc: "Erzeugt eine physische Form; der Geist wird zum Dualwesen mit Immunität gegen Normale Waffen.",
        art: "M",
        action: "H",
        range: "Selbst",
        duration: "Aufrechterhalten",
        text: "Ermöglicht dem astralen Wesen, über eine Haupthandlung eine physische Gestalt in der materiellen Welt anzunehmen. Solange der Geist materialisiert ist, existiert er gleichzeitig auf der physischen und der Astralebene (Dualwesen): Er kann mit physischen sowie astralen Wesen interagieren und von beiden angegriffen werden, nimmt beide Ebenen gleichzeitig ohne den sonst üblichen Abzug (-2) wahr und erhält Immunität gegen Normale Waffen. Das Entmaterialisieren zur Rückkehr auf die reine Astralebene erfordert eine Nebenhandlung."
    }
};

export function getPowerData(powerName) {
    if (powerData[powerName]) return powerData[powerName];
    const baseName = powerName.split('(')[0].trim();
    if (powerData[baseName]) return powerData[baseName];
    return { shortDesc: "Keine Kurzbeschreibung verfügbar.", text: "Keine Regeldetails hinterlegt." };
}
