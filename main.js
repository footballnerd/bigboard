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
                <div class="player-widget-close">X</div>
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
        document.querySelector('#widgetContent').innerHTML = html;
        // Close widget
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
// Player search box
// ===================================
async function searchBox(){
    const input = document.querySelector("#searchInput");
    input.addEventListener('input', async() => {
        const rows = Array.from(document.querySelectorAll('.player-row'));
        for (const row of rows){
            const text = row.dataset.player;
            const isMatch = text.toLowerCase().includes(input.value.toLowerCase());
            if (isMatch){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    });
};

// ===================================
// Position filter
// ===================================
async function filterPostion(){
    // Add the event listener to the dropdown menu
    const select = document.querySelector("#positionFilter");
    select.addEventListener('change', async() => {
        await filter(); // Call the helper
    });
    // Parse URL for position indicator (?position=X)
    const params = new URLSearchParams(window.location.search);
    const position = params.get("position");
    if (position){
        document.querySelector("#positionFilter").value = position;
        document.title = `${position.toUpperCase()} Rankings | BigBoard.cc`;
        await filter(); // Call the helper
    };
    // Filter helper
    async function filter(){
        const rows = Array.from(document.querySelectorAll('.player-row'));
        for (const row of rows){
            const text = row.dataset.position;
            const isMatch = text.toLowerCase() == select.value.toLowerCase();
            if (isMatch || select.selectedIndex === 0){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    };
};

// ===================================
// School filter
// ===================================
async function filterSchool(){
    const select = document.querySelector("#schoolFilter");
    select.addEventListener('change', async() => {
        const rows = Array.from(document.querySelectorAll('.player-row'));
        for (const row of rows){
            const text = row.dataset.school;
            const isMatch = text.toLowerCase() == select.value.toLowerCase();
            if (isMatch || select.selectedIndex === 0){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    });
};

// ===================================
// Initialize
// ===================================
searchBox();
filterPostion();
filterSchool();
playerLinks();