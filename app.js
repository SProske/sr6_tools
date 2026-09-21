import { Spirit, spiritDefinitions } from './spirits.js';
import { getPowerData, parsePowerString } from './critter_powers.js';
import { statusData } from './status.js';

// --- EXPORT FUNKTIONEN ---

function exportToPrint() {
    window.print();
}

function exportToPng() {
    const outputElem = document.getElementById('output');
    const spiritName = document.getElementById('spiritName').innerText || 'Geist';
    
    const exportBar = document.querySelector('.export-bar');
    if (exportBar) exportBar.style.display = 'none';

    html2canvas(outputElem, { scale: 2 }).then(canvas => {
        if (exportBar) exportBar.style.display = 'block';

        const link = document.createElement('a');
        link.download = `${spiritName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function exportToHtml() {
    const outputContent = document.getElementById('output').innerHTML;
    const spiritName = document.getElementById('spiritName').innerText || 'Geist';

    const fullHtml = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>${spiritName}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #222; max-width: 800px; margin: 0 auto; }
        .stat-box { display: inline-block; border: 1px solid #ccc; padding: 6px 12px; margin: 2px; text-align: center; border-radius: 4px; }
        .power-block { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px; background: #f9f9f9; }
        .power-header { font-weight: bold; font-size: 1.1em; color: #111; }
        .power-stats { font-size: 0.85em; color: #555; margin: 4px 0; }
        .status-tooltip { text-decoration: underline dotted; font-weight: bold; cursor: help; position: relative; }
        .status-tooltip .tooltip-text { display: none; position: absolute; background: #333; color: #fff; padding: 5px; border-radius: 4px; font-size: 0.8em; z-index: 100; }
        .status-tooltip:hover .tooltip-text { display: block; }
        .export-bar { display: none !important; }
        .condition-monitor-grid { display: grid; grid-template-columns: repeat(3, 70px); gap: 8px; margin-top: 8px; }
        .cm-box { border: 2px solid #333; border-radius: 4px; height: 55px; background: #fdfdfd; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 3px; box-sizing: border-box; }
        .cm-number { font-size: 0.75em; color: #666; font-weight: bold; }
        .cm-checkbox { width: 18px; height: 18px; cursor: pointer; margin: 2px 0; }
        .cm-badge { font-size: 0.7em; font-weight: bold; color: #d9534f; min-height: 12px; }
        .cm-box.last-box { border-color: #a94442; background-color: #fdf2f2; }
        .summoning-box { background: #fdfdfd; border: 1px solid #ccc; border-left: 4px solid #d9534f; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .summoning-grid { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
        .services-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee; }
        .services-row input { width: 60px; padding: 4px; text-align: center; }
    </style>
</head>
<body>
    <div id="output">${outputContent}</div>
    <script>
        document.querySelectorAll('.cm-box').forEach(box => {
            box.addEventListener('click', (e) => {
                const targetIdx = parseInt(box.dataset.index, 10);
                const allBoxes = Array.from(document.querySelectorAll('.cm-checkbox'));
                const highestChecked = allBoxes.reduce((max, cb, idx) => cb.checked ? idx + 1 : max, 0);
                const newCount = (targetIdx === highestChecked) ? targetIdx - 1 : targetIdx;
                allBoxes.forEach((cb, idx) => { cb.checked = (idx + 1) <= newCount; });
            });
        });
    </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${spiritName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function renderConditionMonitor(totalBoxes) {
    const container = document.getElementById('conditionMonitor');
    if (!container) return;

    let html = '<div class="condition-monitor-grid">';

    for (let i = 1; i <= totalBoxes; i++) {
        const isLineEnd = (i % 3 === 0);
        const isLastBox = (i === totalBoxes);
        const linePenalty = Math.floor(i / 3);

        let badgeText = "";
        if (isLastBox) {
            badgeText = "💀 Vernichtet";
        } else if (isLineEnd) {
            badgeText = `-${linePenalty} Wf`;
        }

        html += `
            <div class="cm-box ${isLastBox ? 'last-box' : ''}" data-index="${i}">
                <span class="cm-number">${i}</span>
                <input type="checkbox" class="cm-checkbox" id="cm-box-${i}">
                <span class="cm-badge">${badgeText}</span>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.cm-box').forEach(box => {
        box.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') e.preventDefault();

            const targetIndex = parseInt(box.dataset.index, 10);
            const checkboxes = Array.from(container.querySelectorAll('.cm-checkbox'));

            const highestChecked = checkboxes.reduce((max, cb, idx) => cb.checked ? idx + 1 : max, 0);
            const newCheckedCount = (targetIndex === highestChecked) ? targetIndex - 1 : targetIndex;

            checkboxes.forEach((cb, idx) => {
                cb.checked = (idx + 1) <= newCheckedCount;
            });
        });
    });
}

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

    listContainer.querySelectorAll('.opt-power-cb').forEach(cb => {
        cb.addEventListener('change', (e) => {
            limitCheckboxes(maxAllowed);
            
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

    const config = {
        primarySkill: document.getElementById('primarySkillSelect')?.value || null,
        primarySpec: document.getElementById('primarySpecInput')?.value?.trim() || '',
        primaryKnowledge: document.getElementById('primaryKnowledgeInput')?.value?.trim() || '',
        optionalSkillsConfigs: optionalSkillsConfigs
    };

    const spirit = new Spirit(typ, ks, selectedExtras, config);

    document.getElementById('spiritName').innerText = `${spirit.name} (Kraftstufe ${spirit.ks})`;
    
    // Beschwörungs-Widerstandspool eintragen (KS * 2)
    document.getElementById('spiritSummonPool').innerText = spirit.ks * 2;

    document.getElementById('attributeGrid').innerHTML = Object.entries(spirit.attributes)
        .map(([key, val]) => `<div class="stat-box"><span>${key}</span><strong>${val}</strong></div>`)
        .join('');

    document.getElementById('spiritInit').innerText = spirit.init;
    document.getElementById('spiritAstralInit').innerText = spirit.astralInit;
    renderConditionMonitor(spirit.health);
    document.getElementById('spiritMovement').innerText = formatMovement(spirit.movement);

    document.getElementById('vwAstral').innerText = spirit.defense.astral;
    document.getElementById('vwMagisch').innerText = spirit.defense.magisch;
    document.getElementById('vwWeltlich').innerText = spirit.defense.weltlich;

    const { active, knowledge } = spirit.getSkills();

    const formattedActive = active
        .map(s => `${s.name} ${s.rating}${s.spec ? ` (${s.spec} +2)` : ''}`)
        .join(', ');

    let skillsHTML = `<strong>Aktionsfertigkeiten:</strong> ${formattedActive}`;
    
    if (knowledge.length > 0) {
        skillsHTML += `<br><strong>Wissensfertigkeiten:</strong> ${knowledge.join(', ')}`;
    }

    document.getElementById('spiritSkills').innerHTML = skillsHTML;

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
    document.getElementById('btnExportPrint')?.addEventListener('click', exportToPrint);
    document.getElementById('btnExportPng')?.addEventListener('click', exportToPng);
    document.getElementById('btnExportHtml')?.addEventListener('click', exportToHtml);
});
