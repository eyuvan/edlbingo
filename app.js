let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;

// የፓይተን ሰርቨር አድራሻ (CORS ስህተት እንዳይፈጥር በልዩ ጥንቃቄ ነው የተዋቀረው)
const API_BASE_URL = "http://192.168.125.45:5000"; 
const urlParams = new URLSearchParams(window.location.search);
const TelegramUserID = urlParams.get('user_id') || "12345"; 

window.onload = function() {
    // 1. መጀመሪያ 1-600 ቁጥሮችን በስክሪኑ ላይ መፍጠር (ሰርቨሩ ባይገናኝ እንኳ ቁጥሮቹ እንዳይጠፉ!)
    createAllCartelas();
    
    // 2. ታይመሩን ወዲያውኑ ማስጀመር (ጌሙ እንዳይቆም)
    startCountdown(); 
    
    // 3. ባላንሱን ከሰርቨር ማምጣት (ግንኙነቱ ቢቋረጥ እንኳ ገጹ እንዳይበላሽ በ try/catch ተከቧል)
    try {
        loadRealBalance();
    } catch(err) {
        console.log("ሰርቨሩ አልተገናኘም፣ መደበኛ ባላንስ ይታያል፦", err);
    }
};

function createAllCartelas() {
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
        console.log("ካርቴላዎች በተሳካ ሁኔታ ተፈጥረዋል።");
    }
}

function loadRealBalance() {
    fetch(${API_BASE_URL}/api/get_balance?user_id=${TelegramUserID})
        .then(res => {
            if(!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            const mainW = document.getElementById('main-wallet-amount');
            const playW = document.getElementById('play-wallet-amount');
            if (mainW) mainW.innerText = data.main_wallet.toFixed(2) + " ብር";
            if (playW) playW.innerText = data.play_wallet.toFixed(2) + " ብር";
        })
        .catch(err => {
            console.log("ብሮውዘሩ የሰርቨር ግንኙነቱን አግዶታል (Mixed Content)። መደበኛ ባላንስ ጥቅም ላይ ይውላል።");
            // ሰርቨሩ ባይገናኝ እንኳ ተጫዋቹ መነሻ 10 ብር እንዲያይ ማድረግ
            const mainW = document.getElementById('main-wallet-amount');
            if (mainW) mainW.innerText = "10.00 ብር";
        });
}

function selectCartela(id, element) {
    if (!selectionOpen) return;
    if (selectedCartelas.includes(id)) {
        selectedCartelas = selectedCartelas.filter(item => item !== id);
        element.classList.remove('selected');
    } else {
        if (selectedCartelas.length >= 5) {
            alert("ማሳሰቢያ: መምረጥ የሚችሉት እስከ 5 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCartelas.push(id);
        element.add ? element.add('selected') : element.classList.add('selected');
        generate5x5Grid(); 
    }
}

function generate5x5Grid() {
    const grid = document.getElementById('bingo-grid');
    const displayBox = document.getElementById('selected-cartela-display');
    if (displayBox) displayBox.classList.remove('hidden');
    if (grid) {
        grid.innerHTML = '';
        for (let i = 1; i <= 25; i++) {
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.innerText = i === 13 ? "FREE" : Math.floor(Math.random() * 75) + 1;
            grid.appendChild(cell);
        }
    }
}

function startCountdown() {
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(function() {
        timeLeft--;
        if (timerElement) timerElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectionOpen = false;
            
            const timerBox = document.getElementById('timer-box');
            if (timerBox) timerBox.innerText = "ምርጫ ተዘግቷል! ጨዋታው ተጀምሯል...";
            
            const list = document.getElementById('cartela-list');
            const title = document.getElementById('select-title');
            if (list) list.classList.add('hidden');
            if (title) title.classList.add('hidden');
            
            startBingoCalling(); 
        }
    }, 1000);
}
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

function switchTab(tabName) {
    const tabs = ['game', 'wallet', 'history', 'profile'];
    tabs.forEach(function(tab) {
        const tabEl = document.getElementById(tab + '-tab');
        const navEl = document.getElementById('nav-' + tab);
        if (tabEl) tabEl.classList.add('hidden');
        if (navEl) navEl.classList.remove('active');
    });
    
    const activeTab = document.getElementById(tabName + '-tab');
    const activeNav = document.getElementById('nav-' + tabName);
    if (activeTab) activeTab.classList.remove('hidden');
    if (activeNav) activeNav.classList.add('active');
}