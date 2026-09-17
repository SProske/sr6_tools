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
    },
    "Bewegung": {
        shortDesc: "Vervielfacht oder verringert die Bewegungsrate von Charakteren oder Fahrzeugen.",
        art: "P", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Vervielfacht oder teilt die Bewegungsrate eines sich bewegenden Ziels um einen Faktor bis zu <em>Magie</em>. Unwillige Ziele widerstehen per Probe auf <em>Willenskraft + Magie</em> gegen <em>Willenskraft + Logik</em>; bei Erfolg erleidet das Ziel für [Nettoerfolge] Runden den Status {Humpelnd}. Gegen Fahrzeuge erfordert die Probe einen Schwellenwert von ⌈Rumpf / 2⌉ (min. 2); Nettoerfolge verändern die Geschwindigkeit/Beschleunigung."
    },
    "Bindung": {
        shortDesc: "Fixiert Opfer per Sekret, Netz oder Magie an Flächen oder am Critter.",
        art: "P", action: "H", range: "Verschieden", duration: "Sofort",
        text: "Fixiert ein Opfer an Oberflächen oder am Critter. Bei Fernkampf (BF) Probe auf <em>Geschicklichkeit + Magie</em> gegen <em>Athletik + Reaktion</em>; bei Berührung (B) gegen <em>Nahkampf + Reaktion</em>. Bereits 1 Erfolg versetzt das Opfer in den Status {Bewegungsunfähig}. Befreiung erfordert eine Haupthandlung (Probe auf <em>Konstitution + Stärke</em> gegen <em>Willenskraft + Magie</em> des Critters). Bei Reichweite Selbst kann sich der Critter ohne Probe an Wänden oder Decken bewegen."
    },
    "Einfluss": {
        shortDesc: "Projiziert Suggestionen in den Geist eines Ziels.",
        art: "M", action: "H", range: "BF", duration: "Sofort",
        text: "Projiziert eine Suggestion in den Geist des Opfers (Probe auf <em>Charisma + Magie</em> gegen <em>Willenskraft + Logik</em>). Bei Erfolg behandelt das Opfer den Gedanken als seinen eigenen. Offensichtlich lebensgefährliche Handlungen können nicht erzwungen werden; bei schädlichen Befehlen erhält das Opfer Proben zum Überwinden des Zwangs."
    },
    "Gift": {
        shortDesc: "Sondert ein Injektions- oder Kontakttoxin ab.",
        art: "P", action: "Auto", range: "B", duration: "Sofort",
        text: "Der Critter sondert ein Toxin ab (Typisch: Vektor: Injektion; Geschwindigkeit: 1 KR; Kraft: <em>Magie</em>; Wirkung: {Benommen}, {Vergiftet} mit (Magie)K Schaden). Abweichende Vektoren (wie Kontakt) oder Effekte stehen in der Critterbeschreibung."
    },
    "Grauen": {
        shortDesc: "Versetzt Opfer in schreckliche Panik und schlägt sie in die Flucht.",
        art: "M", action: "H", range: "BF", duration: "Speziell",
        text: "Erfüllt Opfer mit überwältigendem Entsetzen (Vergleichende Probe auf <em>Willenskraft + Magie</em> gegen <em>Willenskraft + Logik</em>). Bei Erfolg flieht das Opfer bedingungslos und erhält die Status {Panisch} und {Verängstigt}. Die Flucht hält 1 Kampfrunde pro Nettoerfolg an, die Statuseffekte halten doppelt so lange an. Danach erfordert eine erneute Annäherung eine Probe auf <em>Willenskraft + Logik</em> (Schwellenwert ⌈Magie / 2⌉)."
    },
    "Natürlicher Zauberspruch": {
        shortDesc: "Ermöglicht das Wirken eines spezifischen Zauberspruchs.",
        art: "Wie Zauber", action: "H", range: "Wie Zauber", duration: "Wie Zauber",
        getText: (powerName) => {
            const { param } = parsePowerString(powerName);
            const zauberInfo = param ? ` (Zauber: <strong>${param}</strong>)` : "";
            return `Erlaubt dem Critter das Wirken eines bestimmten Zauberspruchs${zauberInfo}. Wenn der Critter die Fertigkeit <em>Hexerei</em> nicht besitzt, würfelt er ohne Malus rein mit seinem <em>Magieattribut</em>. Verursacht normalen Entzug und unterliegt den Standardregeln für Antimagie und Aufrechterhalten (-2 Malus).`;
        }
    },
    "Psychokinese": {
        shortDesc: "Bewegt Objekte telekinetisch und führt damit Aktionen aus.",
        art: "P", action: "N", range: "BF", duration: "Aufrechterhalten",
        text: "Bewegt Objekte mittels Geisteskraft. Eine Probe auf <em>Willenskraft + Magie</em> bestimmt die effektive Stärke und Geschicklichkeit der unsichtbaren Hand (Höhe der erzielten Nettoerfolge). Objekte können 10 Meter pro Kampfrunde bewegt werden; Nah- oder Fernkampfangriffe sind mit passenden Fertigkeiten möglich."
    },
    "Schutz": {
        shortDesc: "Schützt Ziele vor Patzern und der Kraft Unfall.",
        art: "P", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Schützt den Critter und bis zu <em>Magie</em> Ziele vor Patzern und der Kraft <em>Unfall</em>. Unter Einwirkung der Kraft gelten Kritische Patzer nur als einfache Patzer und einfache Patzer als normale Fehlschläge. Wird <em>Unfall</em> auf ein geschütztes Ziel gewirkt, neutralisiert Schutz dessen Auswirkung und der Test verläuft normal."
    },
    "Suche": {
        shortDesc: "Spürt Personen, Orte oder Gegenstände über eine erweiterte Probe auf.",
        art: "P", action: "H", range: "Speziell", duration: "Speziell",
        text: "Spürt ein bekanntes oder per Bild übermitteltes Ziel auf (Erweiterte Probe auf <em>Intuition + Magie</em> [Intervall: 5, 10 Min.]). Unbelebte Objekte erfordern Materialisierung. Typische Modifikatoren auf den Schwellenwert: Entfernung (+1 pro km), Hüter (+(KS × 5)), aktive <em>Verschleierung</em> (+(Magie des Verschleiernden × 3)), Unbelebter Gegenstand/Ort (+5)."
    },
    "Tierbeherrschung": {
        shortDesc: "Kontrolliert Tierverhalten (bis zu Charisma × 5 kleine oder Charisma große Tiere).",
        art: "M", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Manipuliert Tiere zur Ausführung natürlicher Verhaltensweisen. Neue Befehle erfordern Sichtkontakt; einmal erteilte Befehle werden für <em>Charisma</em> Minuten befolgt. Kapazität: <em>Charisma × 5</em> kleine Tiere (Ratten, Vögel), <em>Charisma</em> große Tiere (Wölfe, Bären) oder 1 paranormaler Critter. Wirkt nicht gegen Wesen mit der Kraft <em>Bewusstsein</em>."
    },
    "Unfall": {
        shortDesc: "Provoziert bei einem Ziel einen Patzer oder Kritischen Patzer.",
        art: "P", action: "H", range: "BF", duration: "Sofort",
        text: "Provoziert einen scheinbar natürlichen Unfall per Vergleichender Probe auf <em>Willenskraft + Magie</em> gegen <em>Reaktion + Charisma</em> des Opfers. Bei Erfolg erleidet das Ziel die Auswirkungen eines Patzers; bei 4 oder mehr Nettoerfolgen gilt die Aktion als Kritischer Patzer. Kann durch die Kraft <em>Schutz</em> neutralisiert werden."
    },
    "Verschleierung": {
        shortDesc: "Versteckt Ziele magisch und gewährt den Status Unsichtbar (Verbessert).",
        art: "P", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Versteckt bis zu <em>Magie</em> metamenschengroße Ziele (Konstitution ≤ 5; Konstitution > 5 zählt als 2 Ziele) oder <em>Magie × 5</em> kleine Objekte. Aktiviert den Status {Unsichtbar (Verbessert)} in Höhe des <em>Magieattributs</em>. Im Kampf ist die Haupthandlung <em>Genau beobachten</em> erforderlich, um eine Wahrnehmungsprobe zum Durchschauen der Tarnung ablegen zu dürfen."
    },
    "Verwirrung": {
        shortDesc: "Ruft Verwirrung und Benommenheit hervor.",
        art: "M", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Versetzt ein Ziel per Vergleichender Probe auf <em>Willenskraft + Magie</em> gegen <em>Willenskraft + Logik</em> in Verwirrung. Bei Nettoerfolgen erhält das Opfer den Status {Verwirrt} in Höhe der Nettoerfolge sowie zusätzlich den Status {Benommen}."
    },
    "Wetterbeherrschung": {
        shortDesc: "Manipuliert schrittweise das örtliche Wetter.",
        art: "P", action: "H", range: "BF", duration: "Aufrechterhalten",
        text: "Manipuliert die örtlichen Wetterbedingungen im Rahmen des natürlich Möglichen. Das Wetter verändert sich allmählich über eine Erweiterte Probe auf <em>Willenskraft + Magie</em> (Schwellenwert 10, Intervall: 30 Min.). Erlaubt das Heraufbeschwören von Wetterphänomenen (z. B. Gewitter), jedoch keine gezielte Steuerung einzelner Blitze."
    },
    "Magischer Schutz": {
        shortDesc: "Erlaubt Zauberabwehr per Antimagie für den Geist und Verbündete.",
        art: "M", action: "Speziell", range: "BF", duration: "Sofort",
        text: "Ermöglicht den Einsatz von Antimagie zur Zauberabwehr gegen Zaubersprüche. Verfügt der Geist nicht über die Fertigkeit <em>Hexerei</em>, legt er die Zauberabwehrprobe stattdessen mit <em>Kraftstufe + Magie</em> ab."
    },
    "Schatten": {
        shortDesc: "Hüllt den Geist in Dunkelheit, gewährt Edge und den Status Unsichtbar.",
        art: "P", action: "N", range: "Speziell", duration: "Aufrechterhalten",
        getText: (powerName, spirit) => {
            const stufe = spirit ? Math.floor(spirit.ks / 2) : "KS ÷ 2";
            const statusTag = typeof stufe === "number" && stufe > 0 ? `{Unsichtbar ${stufe}}` : "{Unsichtbar}";
            return `Hüllt den Geist in Dunkelheit. In allen Lichtverhältnissen (außer hellem Tageslicht) erhält der Geist 1 Edge bei Aktionen rund um Kampf, Heimlichkeit oder soziale Interaktion. Bei schlechter Beleuchtung erhält der Geist zusätzlich den Status ${statusTag}.`;
        }
    },
    "Stille": {
        shortDesc: "Dämpft Geräusche in einer Sphäre und erzeugt den Status Geräuschlos.",
        art: "P", action: "H", range: "Speziell", duration: "Aufrechterhalten",
        getText: (powerName, spirit) => {
            const mag = spirit ? (spirit.attributes["M"] || spirit.ks) : "Magie";
            const stufe = spirit ? Math.floor(spirit.ks / 2) : "KS ÷ 2";
            const statusTag = typeof stufe === "number" && stufe > 0 ? `{Geräuschlos ${stufe}}` : "{Geräuschlos}";
            return `Umgibt den Geist mit einer Sphäre der Stille mit einem Radius von <em>${mag} Metern</em>. Alle hinein- und herausdringenden Geräusche werden gedämpft. Erzeugt den Status ${statusTag}.`;
        }
    },
    "Weissagung": {
        shortDesc: "Erlaubt Blicke in die Zukunft analog zur Metamagie Weissagung.",
        art: "M", action: "Speziell", range: "Selbst", duration: "Speziell",
        text: "Funktioniert wie die Metamagie <em>Weissagung</em>. Der Geist legt die Probe für den Blick in die Zukunft mit <em>Magie + Intuition</em> ab."
    }
};

export function getPowerData(powerName) {
    if (powerData[powerName]) return powerData[powerName];
    const baseName = powerName.split('(')[0].trim();
    if (powerData[baseName]) return powerData[baseName];
    return { shortDesc: "Keine Kurzbeschreibung verfügbar.", text: "Keine Regeldetails hinterlegt." };
}
