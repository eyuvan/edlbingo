let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;

// 1. ከፓይተን ሰርቨር ጋር መገናኛ ሊንክ (ያንተ ኮምፒውተር አይፒ አድራሻ)
const API_BASE_URL = "http://192.168.125.45:5000"; 

// ከቴሌግራም ሊንክ የተጫዋቹን ID መውሰጃ
const urlParams = new URLSearchParams(window.location.search);
const TelegramUserID = urlParams.get('user_id') || "12345"; 

// ገጹ እንደተከፈተ መጀመሪያ ሁሉንም ስራዎች በቅደም ተከተል ማስነሳት
window.onload = function() {
    // ሀ. መጀመሪያ 1-600 ቁጥሮችን በስክሪኑ ላይ መፍጠር
    createAllCartelas();
    
    // ለ. በመቀጠል እውነተኛውን ባላንስ ከዳታቤዝ አምጥቶ መሙላት
    loadRealBalance();
    
    // ሐ. በመጨረሻ ታይመሩን ማስጀመር
    startCountdown(); 
};

// 1-600 ካርቴላዎችን በስክሪኑ ላይ የመፍጠሪያ ተግባር
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
        console.log("1-600 ካርቴላዎች በስክሪኑ ላይ ተፈጥረዋል።");
    }
}

// ባላንስ ከዳታቤዝ አምጥቶ ማሳያ
function loadRealBalance() {
    fetch(${API_BASE_URL}/api/get_balance?user_id=${TelegramUserID})
        .then(res => res.json())
        .then(data => {
            const mainW = document.getElementById('main-wallet-amount');
            const playW = document.getElementById('play-wallet-amount');
            if (mainW) mainW.innerText = data.main_wallet.toFixed(2) + " ብር";
            if (playW) playW.innerText = data.play_wallet.toFixed(2) + " ብር";
        })
        .catch(err => console.log("የባላንስ ግንኙነት ስህተት፡", err));
}

// ካርቴላ ሲመረጥ (እስከ 5 ብቻ)
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
        element.classList.add('selected');
        generate5x5Grid(); 
    }
}

// የ 5x5 ቢንጎ ካርቴላ ማሳያ
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

// ታይመሩን ወደ ታች የማስቆጠሪያ ተግባር
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
            
            // የ 1-600 ምርጫን መደበቅ
            const list = document.getElementById('cartela-list');
            const title = document.getElementById('select-title');
            if (list) list.classList.add('hidden');
            if (title) title.classList.add('hidden');
            
            startBingoCalling(); 
        }
    }, 1000);
}

// የቢንጎ ቁጥሮች ጥሪ ማሳያ (ላይቭ ስክሪን)
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