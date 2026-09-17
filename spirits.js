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

    get health() {
        return SpiritCalculations.health(this.ks);
    }

    get skillValue() {
        return this.ks;
    }
}

export { spiritDefinitions };
