let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;

// ከ 1 እስከ 600 ካርቴላዎችን መፍጠር
const cartelaList = document.getElementById('cartela-list');
for (let i = 1; i <= 600; i++) {
    let box = document.createElement('div');
    box.className = 'cartela-box';
    box.innerText = i;
    box.onclick = () => selectCartela(i, box);
    cartelaList.appendChild(box);
}

// ካርቴላ መምረጥ (እስከ 5 ብቻ)
function selectCartela(id, element) {
    if (!selectionOpen) return alert("የመጫወቻ ሰዓት አልፏል!");

    if (selectedCartelas.includes(id)) {
        selectedCartelas = selectedCartelas.filter(item => item !== id);
        element.classList.remove('selected');
    } else {
        if (selectedCartelas.length >= 5) {
            alert("ማሳሰቢያ: መምረጥ የሚችሉት እስከ 5 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCartelas.push(id);
        element.classList.add('selected');
        generate5x5Grid(); // የ 5x5 ማትሪክስ ማሳያ
    }
}

// የ 5x5 ቢንጎ ካርቴላ ማሳያ (ናሙና ቁጥሮች)
function generate5x5Grid() {
    const grid = document.getElementById('bingo-grid');
    document.getElementById('selected-cartela-display').classList.remove('hidden');
    grid.innerHTML = '';
    // ለናሙና ያህል 25 ቁጥሮችን በካርቴላው ላይ መሙላት
    for (let i = 1; i <= 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.innerText = i === 13 ? "FREE" : Math.floor(Math.random() * 75) + 1;
        grid.appendChild(cell);
    }
}

// የ 49 ሰከንድ ታይመር ቆጠራ
const timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        selectionOpen = false;
        document.getElementById('timer-box').innerText = "ምርጫ ተዘግቷል! ጨዋታው እየተጀመረ ነው...";
        startBingoCalling(); // የቁጥር ጥሪ መጀመር
    }
}, 1000);

// ቁጥሮችን በየተወሰነ ሰከንዱ በስክሪኑ ላይ መጥራት (የላይቭ ስክሪን ናሙና)
function startBingoCalling() {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    setInterval(() => {
        let randomLetter = letters[Math.floor(Math.random() * letters.length)];
        let randomNumber = Math.floor(Math.random() * 75) + 1;
        document.getElementById('called-number').innerText = ${randomLetter}-${randomNumber};
    }, 3000); // በየ 3 ሰከንዱ ቁጥር ይጠራል
}

function switchTab(tabName) {
    console.log("ወደ " + tabName + " ገጽ ተቀይሯል");
    // እዚህ ላይ የገጾቹን መለዋወጫ ኮድ ማካተት ይቻላል
}