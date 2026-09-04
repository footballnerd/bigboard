// Player links
async function playerLinks(){
    document.addEventListener('click', async(e) => {
        const row = e.target.closest('.player-row');
        if (!row) return;
        e.preventDefault();
        const player = row.dataset.player;
        const url = `/players/${player.replace(/ /g,'-')}.html`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        console.log(html);
    });
};

// Player search box
async function searchBox(){
    const input = document.querySelector("#searchInput");
    input.addEventListener('input', async() => {
        const rows = Array.from(document.querySelectorAll('tr.player-row'));
        for (const row of rows){
            const text = row.querySelector('td.player').textContent;
            const isMatch = text.toLowerCase().includes(input.value.toLowerCase());
            if (isMatch){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    });
};

// Position filter
async function filterPostion(){
    const select = document.querySelector("#positionFilter");
    select.addEventListener('change', async() => {
        const rows = Array.from(document.querySelectorAll('tr.player-row'));
        for (const row of rows){
            const text = row.querySelector('td.position').textContent;
            const isMatch = text.toLowerCase() == select.value.toLowerCase();
            if (isMatch || select.selectedIndex === 0){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    });
};

// School filter
async function filterSchool(){
    const select = document.querySelector("#schoolFilter");
    select.addEventListener('change', async() => {
        const rows = Array.from(document.querySelectorAll('tr.player-row'));
        for (const row of rows){
            const text = row.querySelector('td.school').textContent;
            const isMatch = text.toLowerCase() == select.value.toLowerCase();
            if (isMatch || select.selectedIndex === 0){
                row.style.display = "revert";
            } else {
                row.style.display = "none";
            };
        };
    });
};

// Initialize
searchBox();
filterPostion();
filterSchool();
playerLinks();