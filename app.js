let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;

// ገጹ እንደተከፈተ 1-600 ቁጥሮችን በግድ እንዲፈጥር እና ታይመሩን እንዲያስጀምር ማድረግ
window.onload = function() {
    const cartelaList = document.getElementById('cartela-list');
    if (cartelaList) {
        cartelaList.innerHTML = ""; 
        for (let i = 1; i <= 600; i++) {
            let box = document.createElement('div');
            box.className = 'cartela-box';
            box.innerText = i;
            box.onclick = function() { selectCartela(i, box); };
            cartelaList.appendChild(box);
        }
    }
    startCountdown(); 
};

// ካርቴላ መምረጥ (እስከ 5 ብቻ)
function selectCartela(id, element) {
    if (!selectionOpen) {
        alert("የመጫወቻ ሰዓት አልፏል! ከእንግዲህ መምረጥ አይቻልም።");
        return;
    }

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
        generate5x5Grid(); 
    }
}

// የ 5x5 ቢንጎ ካርቴላ ማሳያ
function generate5x5Grid() {
    const grid = document.getElementById('bingo-grid');
    document.getElementById('selected-cartela-display').classList.remove('hidden');
    grid.innerHTML = '';
    for (let i = 1; i <= 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.innerText = i === 13 ? "FREE" : Math.floor(Math.random() * 75) + 1;
        grid.appendChild(cell);
    }
}

// ታይመሩን በሰከንድ ወደ ታች የሚቀንስ ተግባር
function startCountdown() {
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(function() {
        timeLeft--;
        if (timerElement) {
            timerElement.innerText = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectionOpen = false;
            document.getElementById('timer-box').innerText = "ምርጫ ተዘግቷል! ጨዋታው ተጀምሯል...";
            startBingoCalling(); 
        }
    }, 1000);
}

// የቢንጎ ቁጥሮች ጥሪ
function startBingoCalling() {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    setInterval(function() {
        let randomLetter = letters[Math.floor(Math.random() * letters.length)];
        let randomNumber = Math.floor(Math.random() * 75) + 1;
        const calledNumBox = document.getElementById('called-number');
        if (calledNumBox) {
            calledNumBox.innerText = randomLetter + "-" + randomNumber;
        }
    }, 3000);
}

// የኔቪጌሽን ገጾችን መለዋወጫ
function switchTab(tabName) {
    const tabs = ['game', 'wallet', 'history', 'profile'];
    tabs.forEach(function(tab) {
        document.getElementById(tab + '-tab').classList.add('hidden');
        document.getElementById('nav-' + tab).classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    document.getElementById('nav-' + tabName).classList.add('active');
}