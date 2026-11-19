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

// ===================================
// Combined player filtering
// ===================================
function filterPlayers() {
    const searchInput = document.querySelector("#searchInput");
    const positionSelect = document.querySelector("#positionFilter");
    const schoolSelect = document.querySelector("#schoolFilter");
    const rows = document.querySelectorAll(".player-row");

    const searchValue = searchInput.value.trim().toLowerCase();
    const positionValue = positionSelect.value.trim().toLowerCase();
    const schoolValue = schoolSelect.value.trim().toLowerCase();

    for (const row of rows) {
        const rowPlayer = (row.dataset.player || "").toLowerCase();
        const rowPosition = (row.dataset.position || "").trim().toLowerCase();
        const rowSchool = (row.dataset.school || "").trim().toLowerCase();

        const matchesPlayer = rowPlayer.includes(searchValue);

        const matchesPosition =
            positionSelect.selectedIndex === 0 ||
            rowPosition === positionValue;

        const matchesSchool =
            schoolSelect.selectedIndex === 0 ||
            rowSchool === schoolValue;

        row.style.display =
            matchesPlayer && matchesPosition && matchesSchool
                ? "revert"
                : "none";
    }
}

// ===================================
// Player search box
// ===================================
function searchBox() {
    document.querySelector("#searchInput")
        .addEventListener("input", filterPlayers);
}

// ===================================
// Position filter
// ===================================
function filterPostion() {
    document.querySelector("#positionFilter")
        .addEventListener("change", filterPlayers);
}

// ===================================
// School filter
// ===================================
function filterSchool() {
    document.querySelector("#schoolFilter")
        .addEventListener("change", filterPlayers);
}

// ===================================
// Reset button
// ===================================
function resetButton() {
    document.querySelector("#resetButton")
        .addEventListener("click", () => {
            document.querySelector("#searchInput").value = "";
            document.querySelector("#positionFilter").selectedIndex = 0;
            document.querySelector("#schoolFilter").selectedIndex = 0;

            filterPlayers();
        });
}

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

// ===================================
// Initialize
// ===================================
searchBox();
filterPostion();
filterSchool();
resetButton();
playerLinks();
tableTooltips();