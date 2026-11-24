// ===================================
// Player links
// ===================================
async function playerLinks(){
    document.addEventListener('click', async(e) => {
        const row = e.target.closest('.player-row');
        if (!row) return;
        e.preventDefault();
        // Create widget
        const widget = document.createElement('div');
        widget.classList.add('player-widget-container');
        widget.innerHTML = `
            <div class="player-widget-box">
                <div class="player-widget-close"></div>
                <div class="player-widget-content" id="widgetContent">
                    <div class="loading-small"><img src="img/loading.gif"></div>
                </div>
            </div>
            `;
        document.body.appendChild(widget);
        // Fetch player data
        const player = row.dataset.player;
        const url = `/players/${player.replace(/ /g,'-').replace(/'/g,'').toLowerCase()}.html`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const card = doc.querySelector('.widget-card');
        const sub = card.querySelector('.player-sub');
        sub.innerHTML = `<a href="${url}">&#10551;</a> ` + sub.innerHTML;
        document.querySelector('#widgetContent').outerHTML = `
            <div>
                ${card.outerHTML}
            </div>`;
        // Build player links
        const playerPageLinks = ["Overview","Statistics","Advanced","Compare"];
        document.querySelector('.bbh-current').innerHTML = playerPageLinks.map(i => 
            `<a href="${url}" class="button button-secondary button-flex">${i}</a>`
        ).join(' ');
        // Remove the "overall ranking history" text
        document.querySelector('.bbh-heading').remove();
        // Close widget
        document.querySelector('.player-widget-close').innerHTML = "X";
        document.querySelector('.player-widget-close').style.border = "3px solid #DC262D";
        document.querySelector('.player-widget-close').style.background = "#171719";
        document.querySelector('.player-widget-container').addEventListener('click', async(e) =>{
            const target = e.target;
            const isContainer = target.classList.contains('player-widget-container');
            const isX = target.classList.contains('player-widget-close');
            const closeClick = (isContainer || isX);
            if (closeClick) document.querySelector('.player-widget-container').remove();
        });
    });
};

async function tableTooltips(){
    document.addEventListener('DOMContentLoaded', () => {
        const tooltip = document.createElement('div');
        tooltip.id = 'floating-header-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltip);

        let active = null;

        function positionTooltip() {
            if (!active) return;

            const rect = active.getBoundingClientRect();
            const width = tooltip.offsetWidth;
            const height = tooltip.offsetHeight;
            const margin = 12;

            // Center on icon, but stay inside viewport
            const left = Math.max(margin, Math.min(
                rect.left + rect.width / 2 - width / 2,
                window.innerWidth - width - margin
            ));

            // Prefer below; flip above if necessary
            let top = rect.bottom + 10;
            if (top + height > window.innerHeight - margin) {
                top = rect.top - height - 10;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${Math.max(margin, top)}px`;
        }

        function showTooltip(element) {
            active = element;
            tooltip.textContent = element.dataset.tooltip;
            tooltip.style.display = 'block';
            positionTooltip();
        }

        function hideTooltip(element) {
            if (active !== element) return;
            active = null;
            tooltip.style.display = 'none';
        }

        document.querySelectorAll('.header-help[data-tooltip]')
            .forEach(element => {
                element.addEventListener('mouseenter', () =>
                    showTooltip(element));
                element.addEventListener('mouseleave', () =>
                    hideTooltip(element));
                element.addEventListener('focus', () =>
                    showTooltip(element));
                element.addEventListener('blur', () =>
                    hideTooltip(element));

                // Avoid accidentally sorting the column
                element.addEventListener('click', event =>
                    event.stopPropagation());
            });

        window.addEventListener('scroll', positionTooltip, true);
        window.addEventListener('resize', positionTooltip);
    });
}

async function controlsToggle(){
    const rankingTabs = document.querySelectorAll(".ranking-tab");
    const ranksByPosition = document.getElementById("ranksByPosition");
    const ranksBySchool = document.getElementById("ranksBySchool");

    rankingTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const mode = tab.dataset.mode;

            rankingTabs.forEach(item => {
                const active = item === tab;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            ranksByPosition.hidden = mode !== "position";
            ranksBySchool.hidden = mode !== "school";
        });
    });
}

function controlsSchoolSelector() {
    const selector = document.getElementById("schoolSelector");

    if (!selector) return;

    selector.addEventListener("change", function () {
        if (this.value) {
            window.location.href = this.value;
        }
    });
}

// ===================================
// Initialize
// ===================================
controlsToggle();
controlsSchoolSelector();
playerLinks();
tableTooltips();