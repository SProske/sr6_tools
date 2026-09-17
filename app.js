import { spiritData } from './spirits.js';
import { powerData, statusData, ELEMENT_STATUS_MAP, getPowerData } from './powers.js';

function formatTextWithTooltips(rawText) {
    if (!rawText) return "";
    return rawText.replace(/\{([^}]+)\}/g, (match, statusName) => {
        const tooltipInfo = statusData[statusName] || "Keine Beschreibung verfügbar.";
        return `<span class="status-tooltip">${statusName}<span class="tooltip-text">${tooltipInfo}</span></span>`;
    });
}

function populateSpiritDropdown() {
    const select = document.getElementById('geistertyp');
    select.innerHTML = Object.entries(spiritData)
        .map(([key, data]) => `<option value="${key}">${data.name}</option>`)
        .join('');
}

function renderOptionalPowers() {
    const ks = parseInt(document.getElementById('kraftstufe').value) || 1;
    const typ = document.getElementById('geistertyp').value;
    const data = spiritData[typ];
    
    const maxAllowed = Math.floor(ks / 3);
    document.getElementById('maxOptionalCount').innerText = maxAllowed;

    const listContainer = document.getElementById('optionalPowersList');

    if (maxAllowed === 0) {
        listContainer.innerHTML = '<em>Keine Zusatzkräfte bei dieser Kraftstufe möglich.</em>';
        return;
    }

    listContainer.innerHTML = data.optionalPowers.map(powerName => {
        const info = getPowerData(powerName);
        return `
            <div class="checkbox-item">
                <input type="checkbox" class="opt-power-cb" value="${powerName}">
                <div>
                    <strong>${powerName}</strong>
                    <span class="opt-desc">${info.shortDesc}</span>
                </div>
            </div>
        `;
    }).join('');

    // Event-Listener für dynamisch erzeugte Checkboxen
    listContainer.querySelectorAll('.opt-power-cb').forEach(cb => {
        cb.addEventListener('change', () => limitCheckboxes(maxAllowed));
    });
}

function limitCheckboxes(max) {
    const checkboxes = document.querySelectorAll('.opt-power-cb');
    const checkedCount = document.querySelectorAll('.opt-power-cb:checked').length;

    checkboxes.forEach(cb => {
        if (!cb.checked) {
            cb.disabled = checkedCount >= max;
        }
    });
}

function generateMeleeAttack(ks, typ, attrs, allPowers) {
    const ges = attrs["GES"] || ks;
    const rea = attrs["REA"] || ks;
    const str = attrs["STR"] || ks;
    const mag = attrs["M"] || ks;
    const pool = ks + ges;
    
    let baseAW = rea + str;
    let name = "Waffenloser Angriff";
    let dmgType = "B";
    let dmgVal = 2;

    if (typ === "mensch") {
        dmgVal = Math.max(2, Math.floor(ks / 2) - 1);
    }

    const hasNatWaffe = allPowers.some(p => p.startsWith("Natürliche Waffe"));
    if (hasNatWaffe) {
        name = "Natürliche Waffe";
        dmgType = "K";
        dmgVal = Math.max(2, Math.floor(ks / 2) - 1);
    }

    const auraPower = allPowers.find(p => p.startsWith("Energieaura"));
    let statusText = "";
    if (auraPower) {
        const elementMatch = auraPower.match(/\(([^)]+)\)/);
        const element = elementMatch ? elementMatch[1] : "Energie";
        const statusName = ELEMENT_STATUS_MAP[element];
        
        if (statusName) {
            statusText = ` + {${statusName}}`;
        }

        dmgVal += Math.ceil(mag / 2);
        baseAW += mag;
        dmgType = `K (${element})`;
        name += ` (${element})`;
    }

    const formattedText = formatTextWithTooltips(
        `<strong>${name}:</strong> Schaden ${dmgVal}${dmgType}${statusText} | Probe: ${pool} (Nahkampf + Geschicklichkeit) | AW ${baseAW} / - / - / - / -`
    );
    return `<li>${formattedText}</li>`;
}

function renderPowerCard(powerName) {
    const p = getPowerData(powerName);
    const statsLine = p.art ? `<div class="power-stats">Art: ${p.art} | Handlung: ${p.action} | Reichweite: ${p.range} | Dauer: ${p.duration}</div>` : "";
    const formattedText = formatTextWithTooltips(p.text);

    return `
        <div class="power-block">
            <div class="power-header">${powerName}</div>
            ${statsLine}
            <div class="power-text">${formattedText}</div>
        </div>
    `;
}

function generateSpirit() {
    const ks = parseInt(document.getElementById('kraftstufe').value) || 1;
    const typ = document.getElementById('geistertyp').value;
    const data = spiritData[typ];

    document.getElementById('spiritName').innerText = `${data.name} (Kraftstufe ${ks})`;
    
    const attrs = data.attributes(ks);
    document.getElementById('attributeGrid').innerHTML = Object.entries(attrs)
        .map(([key, val]) => `<div class="stat-box"><span>${key}</span><strong>${val}</strong></div>`)
        .join('');

    document.getElementById('spiritInit').innerText = data.init(ks);
    document.getElementById('spiritAstralInit').innerText = data.astralInit(ks);
    document.getElementById('spiritHealth').innerText = data.health(ks);
    document.getElementById('spiritMovement').innerText = data.movement;

    const def = data.defense(ks);
    document.getElementById('vwAstral').innerText = def.astral;
    document.getElementById('vwMagisch').innerText = def.magisch;
    document.getElementById('vwWeltlich').innerText = def.weltlich;

    const selectedExtras = Array.from(document.querySelectorAll('.opt-power-cb:checked')).map(cb => cb.value);
    const allPowers = [...data.powers, ...selectedExtras];

    document.getElementById('spiritSkills').innerText = data.skills.map(s => `${s} ${ks}`).join(', ');

    // Angriffe rendern
    let attackItems = [generateMeleeAttack(ks, typ, attrs, allPowers)];
    allPowers.forEach(powerName => {
        const pInfo = getPowerData(powerName);
        if (pInfo && pInfo.getAttack) {
            attackItems.push(`<li>${formatTextWithTooltips(pInfo.getAttack(ks, powerName, attrs))}</li>`);
        }
    });
    document.getElementById('spiritAttacks').innerHTML = attackItems.join('');

    // Kräfte-Karten rendern
    document.getElementById('spiritPowersList').innerHTML = allPowers.map(renderPowerCard).join('');

    document.getElementById('spiritWeaknesses').innerText = data.weaknesses.length > 0 ? data.weaknesses.join(', ') : 'Keine';
    document.getElementById('output').style.display = 'block';
}

// Globales Setup nach DOM-Ready
document.addEventListener('DOMContentLoaded', () => {
    populateSpiritDropdown();
    renderOptionalPowers();

    document.getElementById('geistertyp').addEventListener('change', renderOptionalPowers);
    document.getElementById('kraftstufe').addEventListener('input', renderOptionalPowers);
    document.getElementById('generateBtn').addEventListener('click', generateSpirit);
});
