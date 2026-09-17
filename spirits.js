import { spiritDefinitions, SpiritCalculations } from './spirit_definitions.js';

export class Spirit {
    static STANDARD_ATTRIBUTES = ["KON", "GES", "REA", "STR", "WIL", "LOG", "INT", "CHA", "M", "ESS"];

    constructor(typeKey, ks, selectedOptionalPowers = []) {
        const def = spiritDefinitions[typeKey];
        if (!def) throw new Error(`Unbekannter Geistertyp: ${typeKey}`);

        this.typeKey = typeKey;
        this.ks = ks;
        this.name = def.name;
        this.movement = def.movement || { walk: 5, run: 10, sprintBonus: 1 };
        this.skills = def.skills;
        this.weaknesses = def.weaknesses;

        this.attributes = this.calculateAttributes(def.attrMods || {});
        this.defense = def.defense(ks);
        this.init = def.init ? def.init(ks) : SpiritCalculations.init(ks);
        this.astralInit = def.astralInit ? def.astralInit(ks) : SpiritCalculations.astralInit(ks);

        this.powers = [...def.powers, ...selectedOptionalPowers];
    }

    calculateAttributes(mods) {
        const attrs = {};
        Spirit.STANDARD_ATTRIBUTES.forEach(attr => {
            const mod = mods[attr] || 0;
            attrs[attr] = Math.max(1, this.ks + mod);
        });
        return attrs;
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

    get skillValue() {
        return this.ks;
    }
}

export { spiritDefinitions };
