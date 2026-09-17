export const ELEMENT_STATUS_MAP = {
    "Feuer": "Brennend",
    "Elektrizität": "Gebrutzelt",
    "Chemisch": "Verätzt",
    "Kälte": "Unterkühlt",
    "Strahlung": "Verstrahlt"
};

export const statusData = {
    "Benommen": "Das Initiativeergebnis verringert sich um 4. Der Charakter kann kein Edge erhalten oder ausgeben (Edge verheizen ist weiterhin möglich).",
    "Bewegungsunfähig": "Keine Bewegung möglich (Handlungen ohne Fußbewegung erlaubt). Der Angriffswert sinkt um 3, Angriffe erleiden -3 Würfelpoolmalus und bei Verteidigungsproben wird keine Reaktion eingesetzt.",
    "Brennend": "Der Charakter muss in jeder Kampfrunde Körperlichem Schaden in Höhe der Stufe (#) widerstehen. Kann durch eine Haupthandlung (Geschicklichkeit + Reaktion [2]) oder einen Sprung ins Wasser beendet werden. Neutralisiert und wird neutralisiert durch die Status Nass und Unterkühlt.",
    "Erschöpft": "Pro Stufe erleidet der Charakter -2 Würfelpoolmalus auf alle Proben (außer Schadenswiderstand). Bewegungsrate sinkt auf 5 m (Gehen) und 10 m (Sprinten).",
    "Erschöpft I": "-2 Würfelpoolmalus auf alle Proben (außer Schadenswiderstand). Bewegungsrate sinkt auf 5 m (Gehen) und 10 m (Sprinten).",
    "Erschöpft II": "-4 Würfelpoolmalus auf alle Proben (außer Schadenswiderstand). Bewegungsrate sinkt auf 5 m (Gehen) und 10 m (Sprinten).",
    "Erschöpft III": "-6 Würfelpoolmalus auf alle Proben (außer Schadenswiderstand). Bewegungsrate sinkt auf 5 m (Gehen) und 10 m (Sprinten).",
    "Gebrutzelt": "-2 auf Initiativeergebnis, Sprinten unmöglich und -1 Würfelpoolmalus auf alle Handlungen.",
    "Geräuschlos": "Die Stufe (#) bestimmt den Schwellenwert für akustische Wahrnehmungsproben. Anorganische Sensoren (z. B. Mikrofone) nehmen den Charakter normal wahr.",
    "Humpelnd": "Halbiert jede Bewegung zu Fuß (Bewegen, Sprinten, Weghechten; aufgerundet).",
    "Nass": "-6 Würfelpoolmalus auf Schadenswiderstand gegen Kälte- und Elektrizitätsschaden. Neutralisiert und wird neutralisiert durch den Status Brennend.",
    "Panisch": "Der Charakter kann keine Handlungen ausführen, außer vor der verursachenden Quelle zu fliehen.",
    "Übelkeit": "Zu Beginn jeder Kampfrunde Probe auf Konstitution + Willenskraft (2): Bei Misslingen keine Handlungen in dieser Runde; bei Erfolg voll handlungsfähig, verliert jedoch 1 Nebenhandlung.",
    "Unsichtbar": "Für lebende Wesen kaum/nicht sichtbar; die Stufe (#) bestimmt den Schwellenwert für visuelle Wahrnehmungsproben. Kameras und anorganische Sensoren nehmen den Charakter normal wahr.",
    "Unsichtbar (Verbessert)": "Sowohl für lebende Wesen als auch für Kameras und visuelle Technologien kaum/nicht sichtbar; die Stufe (#) bestimmt den Schwellenwert für alle visuellen Wahrnehmungsproben.",
    "Unterkühlt": "-4 auf Initiativeergebnis und -1 Würfelpoolmalus auf alle Proben (außer Schadenswiderstand). Neutralisiert und wird neutralisiert durch den Status Brennend.",
    "Verätzt": "Das Ziel muss in jeder Kampfrunde Körperlichem Schaden in Höhe der Stufe (#) widerstehen. Beseitigung erfordert passende Hilfsmittel, Ausrüstung oder (nach SL-Entscheidung) ausreichend Wasser.",
    "Verängstigt": "Erleidet einen Würfelpoolmalus von -4 auf alle Proben, die sich direkt gegen die Quelle des Effekts richten oder der Verteidigung gegen diese dienen.",
    "Vergiftet": "Am Ende jeder Kampfrunde Probe auf Konstitution gegen den angegebenen Schaden (K oder B). Der Schadenswert verringert sich pro Runde um 1. Kann durch ein Gegengift aufgehoben werden.",
    "Verstrahlt": "Zu Beginn jedes Tages muss Körperlichem Schaden in Höhe der Stufe (#; default: Magie des Critters) widerstanden werden. Bei unvollständiger Schadensvermeidung entsteht zusätzlich der Status {Übelkeit}. Patzer erhöhen den Schaden um +1, Kritische Patzer reduzieren das Konstitutions-Maximum um 1. Beendung nur durch medizinische Behandlung (senkt Stufe um 1 pro Behandlung; 500 € / BuMoNA Gold+).",
    "Verwirrt": "Erleidet einen Würfelpoolmalus in Höhe der Stufe (#) auf alle aktiv auszuführenden Handlungen."
};
