import { Spirit, spiritDefinitions } from './spirits.js';
import { getPowerData } from './critter_powers.js';
import { statusData, ELEMENT_STATUS_MAP } from './status.js';

function formatMovement(movement) {
    if (!movement) return "-";
    const { walk, run, sprintBonus } = movement;
    const bonus = sprintBonus >= 0 ? `+${sprintBonus}` : sprintBonus;
    return `${walk} / ${run} / ${bonus}`;
}

function formatAttack(attack) {
    let damageString = `${attack.damageValue}${attack.damageType}`;

    if (attack.element) {
        damageString += ` (${attack.element})`;
    }

    if (attack.status) {
        damageString += ` + {${attack.status}}`;
    }

    const awFormatted = attack.rangeBands
        .map(aw => (aw > 0 ? aw : "-"))
        .join(" / ");

    const rawString = `<strong>${attack.name}:</strong> Schaden ${damageString} | Probe: ${attack.poolValue} (${attack.poolDesc}) | AW ${awFormatted}`;

    return formatTextWithTooltips(rawString);
}

function formatTextWithTooltips(rawText) {
    if (!rawText) return "";
    return rawText.replace(/\{([^}]+)\}/g, (match, statusName) => {
        const tooltipInfo = statusData[statusName] || "Keine Beschreibung verfügbar.";
        return `<span class="status-tooltip">${statusName}<span class="tooltip-text">${tooltipInfo}</span></span>`;
    });
}

function populateSpiritDropdown() {
    const select = document.getElementById('geistertyp');
    select.innerHTML = Object.entries(spiritDefinitions)
        .map(([key, data]) => `<option value="${key}">${data.name}</option>`)
        .join('');
}

function renderOptionalPowers() {
    const ks = parseInt(document.getElementById('kraftstufe').value) || 1;
    const typ = document.getElementById('geistertyp').value;
    
    // Neu: Beide Werten direkt von der Spirit-Klasse abfragen
    const maxAllowed = Spirit.getMaxOptionalPowers(ks);
    const optionalPowers = Spirit.getOptionalPowersForType(typ);

    document.getElementById('maxOptionalCount').innerText = maxAllowed;

    const listContainer = document.getElementById('optionalPowersList');

    if (maxAllowed === 0) {
        listContainer.innerHTML = '<em>Keine Zusatzkräfte bei dieser Kraftstufe möglich.</em>';
        return;
    }

    // Neu: optionalPowers (Array) statt data.optionalPowers
    listContainer.innerHTML = optionalPowers.map(powerName => {
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
    const selectedExtras = Array.from(document.querySelectorAll('.opt-power-cb:checked')).map(cb => cb.value);

    // Geist-Instanz erzeugen
    const spirit = new Spirit(typ, ks, selectedExtras);

    document.getElementById('spiritName').innerText = `${spirit.name} (Kraftstufe ${spirit.ks})`;
    
    document.getElementById('attributeGrid').innerHTML = Object.entries(spirit.attributes)
        .map(([key, val]) => `<div class="stat-box"><span>${key}</span><strong>${val}</strong></div>`)
        .join('');

    document.getElementById('spiritInit').innerText = spirit.init;
    document.getElementById('spiritAstralInit').innerText = spirit.astralInit;
    document.getElementById('spiritHealth').innerText = spirit.health;
    document.getElementById('spiritMovement').innerText = formatMovement(spirit.movement);

    document.getElementById('vwAstral').innerText = spirit.defense.astral;
    document.getElementById('vwMagisch').innerText = spirit.defense.magisch;
    document.getElementById('vwWeltlich').innerText = spirit.defense.weltlich;

    document.getElementById('spiritSkills').innerText = spirit.skills.map(s => `${s} ${spirit.skillValue}`).join(', ');

    // Angriffe rendern
    const attacks = spirit.getAttacks();
    document.getElementById('spiritAttacks').innerHTML = attacks
        .map(atk => `<li>${formatAttack(atk)}</li>`)
        .join('');

    // Kräftekarten rendern
    document.getElementById('spiritPowersList').innerHTML = spirit.powers.map(renderPowerCard).join('');

    document.getElementById('spiritWeaknesses').innerText = spirit.weaknesses.length > 0 ? spirit.weaknesses.join(', ') : 'Keine';
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
