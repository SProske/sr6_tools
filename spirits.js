import { spiritDefinitions, SpiritCalculations } from './spirit_definitions.js';
import { getPowerData, parsePowerString } from './critter_powers.js';

export class Spirit {
    static STANDARD_ATTRIBUTES = ["KON", "GES", "REA", "STR", "WIL", "LOG", "INT", "CHA", "M", "ESS"];

    constructor(typeKey, ks, selectedOptionalPowers = [], config = {}) {
        const def = spiritDefinitions[typeKey];
        if (!def) throw new Error(`Unbekannter Geistertyp: ${typeKey}`);

        this.typeKey = typeKey;
        this.ks = Math.min(12, Math.max(1, parseInt(ks) || 1));
        this.name = def.name;
        this.movement = def.movement || { walk: 5, run: 10, sprintBonus: 1 };
        this.skills = [...def.skills];
        this.weaknesses = def.weaknesses;

        this.attributes = this.calculateAttributes(def.attrMods || {});
        this.defense = def.defense(ks);
        this.init = def.init ? def.init(ks) : SpiritCalculations.init(ks);
        this.astralInit = def.astralInit ? def.astralInit(ks) : SpiritCalculations.astralInit(ks);

        this.config = config;

        const maxExtras = Spirit.getMaxOptionalPowers(this.ks);
        const validExtras = selectedOptionalPowers.slice(0, maxExtras);

        this.powers = [...def.powers, ...validExtras];
    }

    calculateAttributes(mods) {
        const attrs = {};
        Spirit.STANDARD_ATTRIBUTES.forEach(attr => {
            const mod = mods[attr] || 0;
            attrs[attr] = Math.max(1, this.ks + mod);
        });
        return attrs;
    }

    static getMaxOptionalPowers(ks) {
        return Math.floor(ks / 3);
    }

    static getOptionalPowersForType(typeKey, excludedSkill = null) {
        const def = spiritDefinitions[typeKey];
        if (!def || !def.optionalPowers) return [];

        const expandedPowers = [];

        def.optionalPowers.forEach(powerString => {
            const { baseName, param } = parsePowerString(powerString);

            // Wenn Parameter mit Kommas vorhanden sind (z. B. "Gesteigerte Sinne (Gehör, Geruch)")
            // spalten wir diese in einzelne wählbare Optionen auf:
            if (param && param.includes(',')) {
                const options = param.split(',').map(p => p.trim());
                options.forEach(opt => {
                    if (baseName === "Fertigkeit" && opt === excludedSkill) return;
                    expandedPowers.push(`${baseName} (${opt})`);
                });
            } else {
                expandedPowers.push(powerString);
            }
        });

        return expandedPowers;
    }

    getAttacks() {
        const attacks = [];
        const rea = this.attributes["REA"];
        const str = this.attributes["STR"];
        const ges = this.attributes["GES"];
        
        let baseDmg = 2;
        if (this.typeKey === "mensch") {
            baseDmg = Math.max(2, Math.floor(this.ks / 2) - 1);
        }

        const baseAttack = {
            name: "Waffenloser Angriff",
            damageValue: baseDmg,
            damageType: "B",
            element: null,
            status: null,
            poolValue: this.ks + ges,
            poolDesc: "Nahkampf + Geschicklichkeit",
            rangeBands: [rea + str, 0, 0, 0, 0]
        };

        this.powers.forEach(powerName => {
            const pInfo = getPowerData(powerName);
            
            if (pInfo && pInfo.modifyBaseAttack) {
                pInfo.modifyBaseAttack(baseAttack, this, powerName);
            }
            
            if (pInfo && pInfo.getGrantedAttack) {
                attacks.push(pInfo.getGrantedAttack(this, powerName));
            }
        });

        attacks.unshift(baseAttack);
        return attacks;
    }

    get health() {
        return SpiritCalculations.health(this.ks);
    }

    getSkills() {
        const result = this.skills.map(name => ({ name, rating: this.ks }));

        // 1. Hauptfertigkeit (z. B. beim Helfergeist)
        if (this.config.primarySkill) {
            const specText = this.config.primarySpec ? ` (${this.config.primarySpec} +2)` : "";
            result.push({ name: `${this.config.primarySkill}${specText}`, rating: this.ks });

            if (this.config.primaryKnowledge) {
                result.push({ name: `[Wissen] ${this.config.primaryKnowledge}`, rating: this.ks });
            }
        }

        // 2. Alle in this.powers enthaltenen Fertigkeits-Kräfte scannen
        this.powers.forEach(powerName => {
            const { baseName, param } = parsePowerString(powerName);
            
            // Reagiert auf z. B. "Fertigkeit (Biotech)", ignoriert Komma-Listen
            if (baseName === "Fertigkeit" && param && !param.includes(',')) {
                // Überspringen, falls es bereits die Hauptfertigkeit ist
                if (param !== this.config.primarySkill) {
                    const optConfig = this.config.optionalSkillsConfigs?.[param] || {};
                    const specText = optConfig.spec ? ` (${optConfig.spec} +2)` : "";

                    result.push({ name: `${param}${specText}`, rating: this.ks });

                    if (optConfig.knowledge) {
                        result.push({ name: `[Wissen] ${optConfig.knowledge}`, rating: this.ks });
                    }
                }
            }
        });

        return result;
    }
}

export { spiritDefinitions };
