import { attachTooltip as attachTooltipFeature } from '../../../../primitives/tooltips/tooltip-engine.js';

function disableLink(link) {
  if (!link) {
    return;
  }

  link.href = '#';
  link.addEventListener('click', (event) => event.preventDefault());
}

export function populateBaseRowContent(rowParts, task, options = {}) {
  const { renderNameOnRight = false, appendRowText = () => {} } = options;
  const { sectionKey, nameLink, desc } = rowParts;

  if (!nameLink || !desc) {
    return;
  }

  if (renderNameOnRight) {
    desc.textContent = '';

    if (sectionKey === 'timers') {
      if (task.wiki) {
        nameLink.href = task.wiki;
      } else {
        disableLink(nameLink);
      }

      nameLink.textContent = task.name;
      attachTooltipFeature(nameLink, task);
    } else {
      nameLink.textContent = '';
      disableLink(nameLink);

      const nameLine = document.createElement('span');
      nameLine.className = 'activity_note_line activity_child_name';
      nameLine.textContent = task.name;
      desc.appendChild(nameLine);
    }

    appendRowText(desc, task, sectionKey);
    return;
  }

  if (task.wiki) {
    nameLink.href = task.wiki;
  } else {
    disableLink(nameLink);
  }

  nameLink.textContent = task.name;
  desc.textContent = '';
  appendRowText(desc, task, sectionKey);
  attachTooltipFeature(nameLink, task);
}
