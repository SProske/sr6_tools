import { Spirit, spiritDefinitions } from './spirits.js';
import { getPowerData, parsePowerString } from './critter_powers.js';
import { statusData } from './status.js';

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
        const statusFormatted = attack.status.split(', ')
            .map(s => `{${s.trim()}}`)
            .join(' + ');
        damageString += ` + ${statusFormatted}`;
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
        let tooltipInfo = statusData[statusName];
        
        if (!tooltipInfo) {
            const baseName = statusName.replace(/\s+(I|II|III|IV|V|\d+)$/i, '').trim();
            tooltipInfo = statusData[baseName] || "Keine Beschreibung verfügbar.";
        }

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
    const selectedSkill = document.getElementById('primarySkillSelect')?.value || null;
    
    const maxAllowed = Spirit.getMaxOptionalPowers(ks);
    const optionalPowers = Spirit.getOptionalPowersForType(typ, selectedSkill);

    document.getElementById('maxOptionalCount').innerText = maxAllowed;
    const listContainer = document.getElementById('optionalPowersList');

    if (maxAllowed === 0) {
        listContainer.innerHTML = '<em>Keine Zusatzkräfte bei dieser Kraftstufe möglich.</em>';
        return;
    }

    listContainer.innerHTML = optionalPowers.map(powerName => {
        const info = getPowerData(powerName);
        const { baseName, param } = parsePowerString(powerName);
        const isSingleSkill = baseName === "Fertigkeit" && param && !param.includes(',');

        return `
            <div class="checkbox-item-wrapper" style="margin-bottom: 8px;">
                <div class="checkbox-item">
                    <input type="checkbox" class="opt-power-cb" value="${powerName}" data-skill="${isSingleSkill ? param : ''}">
                    <div>
                        <strong>${powerName}</strong>
                        <span class="opt-desc">${info.shortDesc}</span>
                    </div>
                </div>
                ${isSingleSkill ? `
                    <div class="opt-skill-config" id="opt-config-${param}" style="display:none; margin-left: 24px; margin-top: 4px;">
                        <input type="text" class="opt-spec-input" data-for-skill="${param}" placeholder="Spezialisierung für ${param} (optional)" style="margin-right: 4px;">
                        <input type="text" class="opt-know-input" data-for-skill="${param}" placeholder="Wissensfertigkeit für ${param} (optional)">
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    // Event-Listener zum Limitieren und für das Ein-/Ausblenden der Config-Felder
    listContainer.querySelectorAll('.opt-power-cb').forEach(cb => {
        cb.addEventListener('change', (e) => {
            limitCheckboxes(maxAllowed);
            
            // Ein-/Ausblenden der Spezialisierungs-Eingabefelder für optionale Fertigkeiten
            const skillName = e.target.dataset.skill;
            if (skillName) {
                const configBox = document.getElementById(`opt-config-${skillName}`);
                if (configBox) {
                    configBox.style.display = e.target.checked ? 'block' : 'none';
                }
            }
        });
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

function renderPowerCard(powerName, spirit) {
    const p = getPowerData(powerName);
    const statsLine = p.art ? `<div class="power-stats">Art: ${p.art} | Handlung: ${p.action} | Reichweite: ${p.range} | Dauer: ${p.duration}</div>` : "";
    
    const rawText = p.getText ? p.getText(powerName, spirit) : p.text;
    const formattedText = formatTextWithTooltips(rawText);

    return `
        <div class="power-block">
            <div class="power-header">${powerName}</div>
            ${statsLine}
            <div class="power-text">${formattedText}</div>
        </div>
    `;
}

function handleGeistertypChange() {
    const typ = document.getElementById('geistertyp').value;
    const configContainer = document.getElementById('primaryPowerConfig');

    if (configContainer) {
        if (typ === 'helfer') {
            configContainer.innerHTML = `
                <div class="helfer-config-box">
                    <label>Haupt-Fertigkeit wählen:</label>
                    <select id="primarySkillSelect">
                        <option value="Biotech">Biotech</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Mechanik">Mechanik</option>
                        <option value="Natur">Natur</option>
                        <option value="Steuern">Steuern</option>
                    </select>
                    <input type="text" id="primarySpecInput" placeholder="Spezialisierung (optional)">
                    <input type="text" id="primaryKnowledgeInput" placeholder="Wissensfertigkeit (optional)">
                </div>
            `;
            
            document.getElementById('primarySkillSelect')?.addEventListener('change', renderOptionalPowers);
        } else {
            configContainer.innerHTML = '';
        }
    }

    renderOptionalPowers();
}

function generateSpirit() {
    const ks = parseInt(document.getElementById('kraftstufe').value) || 1;
    const typ = document.getElementById('geistertyp').value;
    const selectedExtras = Array.from(document.querySelectorAll('.opt-power-cb:checked')).map(cb => cb.value);

    // Eingaben für optionale Fertigkeiten einsammeln
    const optionalSkillsConfigs = {};
    document.querySelectorAll('.opt-power-cb:checked').forEach(cb => {
        const skillName = cb.dataset.skill;
        if (skillName) {
            const specInput = document.querySelector(`.opt-spec-input[data-for-skill="${skillName}"]`);
            const knowInput = document.querySelector(`.opt-know-input[data-for-skill="${skillName}"]`);
            optionalSkillsConfigs[skillName] = {
                spec: specInput?.value?.trim() || '',
                knowledge: knowInput?.value?.trim() || ''
            };
        }
    });

    // Gesamt-Config für das Spirit-Objekt zusammenstellen
    const config = {
        primarySkill: document.getElementById('primarySkillSelect')?.value || null,
        primarySpec: document.getElementById('primarySpecInput')?.value?.trim() || '',
        primaryKnowledge: document.getElementById('primaryKnowledgeInput')?.value?.trim() || '',
        optionalSkillsConfigs: optionalSkillsConfigs
    };

    const spirit = new Spirit(typ, ks, selectedExtras, config);

    // UI-Rendering
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

    // Gerenderte Fertigkeitenliste inklusive Haupt- und Zusatzfertigkeiten!
    document.getElementById('spiritSkills').innerText = spirit.getSkills()
        .map(s => `${s.name} ${s.rating}`)
        .join(', ');

    const attacks = spirit.getAttacks();
    document.getElementById('spiritAttacks').innerHTML = attacks
        .map(atk => `<li>${formatAttack(atk)}</li>`)
        .join('');

    document.getElementById('spiritPowersList').innerHTML = spirit.powers
        .map(pName => renderPowerCard(pName, spirit))
        .join('');

    document.getElementById('spiritWeaknesses').innerText = spirit.weaknesses.length > 0 ? spirit.weaknesses.join(', ') : 'Keine';
    document.getElementById('output').style.display = 'block';
}

// Globales Setup nach DOM-Ready
document.addEventListener('DOMContentLoaded', () => {
    populateSpiritDropdown();
    handleGeistertypChange();

    document.getElementById('geistertyp').addEventListener('change', handleGeistertypChange);
    document.getElementById('kraftstufe').addEventListener('input', renderOptionalPowers);
    document.getElementById('generateBtn').addEventListener('click', generateSpirit);
});
