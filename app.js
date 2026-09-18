let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;

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
    // ልክ ገጹ ሲከፈት 1-75 ቁጥሮችን በየአምዳቸው ሰሌዳው ላይ ማዘጋጀት
    setupBingoBoardNumbers();
    startCountdown(); 
};

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
            
            // የ 1-600 ምርጫን መደበቅ እና ዝግጁ የሆነውን የአምዶች ሰሌዳ ማሳየት
            const list = document.getElementById('cartela-list');
            const title = document.getElementById('select-title');
            const board = document.getElementById('bingo-board');
            
            if (list) list.classList.add('hidden');
            if (title) title.classList.add('hidden');
            if (board) board.classList.remove('hidden');
            
            startBingoCalling(); 
        }
    }, 1000);
}

function setupBingoBoardNumbers() {
    const columns = {
        'B': { start: 1, end: 15, id: 'col-B' },
        'I': { start: 16, end: 30, id: 'col-I' },
        'N': { start: 31, end: 45, id: 'col-N' },
        'G': { start: 46, end: 60, id: 'col-G' },
        'O': { start: 61, end: 75, id: 'col-O' }
    };

    for (let key in columns) {
        let col = columns[key];
        let el = document.getElementById(col.id);
        if (el) {
            el.innerHTML = "";
            for (let n = col.start; n <= col.end; n++) {
                let numSpan = document.createElement('div');
                numSpan.className = 'board-num';
                numSpan.id = 'b-num-' + n; 
                numSpan.innerText = n;
                el.appendChild(numSpan);
            }
        }
    }
}

function speakBingo(text) {
    if ('speechSynthesis' in window) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9;     
        
        let voices = window.speechSynthesis.getVoices();
        let femaleVoice = voices.find(voice => voice.name.includes('Google US English')  voice.name.includes('Zira')  voice.name.includes('Female'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        window.speechSynthesis.speak(utterance);
    }
}
function startBingoCalling() {
    let allNumbers = [];
    for (let i = 1; i <= 75; i++) allNumbers.push(i);
    allNumbers.sort(() => Math.random() - 0.5); 

    let currentIndex = 0;
    const callingInterval = setInterval(function() {
        if (currentIndex >= allNumbers.length) {
            clearInterval(callingInterval);
            return;
        }

        let num = allNumbers[currentIndex];
        let letter = "";

        if (num >= 1 && num <= 15) letter = "B";
        else if (num >= 16 && num <= 30) letter = "I";
        else if (num >= 31 && num <= 45) letter = "N";
        else if (num >= 46 && num <= 60) letter = "G";
        else if (num >= 61 && num <= 75) letter = "O";

        let fullCall = letter + "-" + num;
        
        const calledNumBox = document.getElementById('called-number');
        if (calledNumBox) calledNumBox.innerText = fullCall;
        
        speakBingo(letter + " " + num);

        // የተጠራውን ቁጥር በአምዱ ውስጥ ፈልጎ በቀለም ማድመቅ
        const targetNumElement = document.getElementById('b-num-' + num);
        if (targetNumElement) {
            targetNumElement.classList.add('highlighted');
        }

        currentIndex++;
    }, 4000); 
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