let selectedCartelas = [];
let timeLeft = 49;
let selectionOpen = true;
let calledNumbersList = [];

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
    document.getElementById('selected-cartela-display').classList.remove('hidden');
    grid.innerHTML = '';
    for (let i = 1; i <= 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.innerText = i === 13 ? "FREE" : Math.floor(Math.random() * 75) + 1;
        grid.appendChild(cell);
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
            document.getElementById('timer-box').innerText = "ምርጫ ተዘግቷል! ጨዋታው ተጀምሯል...";
            
            // የ 1-600 ምርጫ መደበቅ እና የአምዶቹን ሰሌዳ ማሳየት
            document.getElementById('cartela-list').classList.add('hidden');
            document.getElementById('select-title').classList.add('hidden');
            document.getElementById('bingo-board').classList.remove('hidden');
            
            startBingoCalling(); 
        }
    }, 1000);
}

// 4. የቁጥሮች ጥሪ እና የማራኪ ሴት ድምፅ (Text-to-Speech) አሰራር
function speakBingo(text) {
    if ('speechSynthesis' in window) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // የቢንጎ ቁጥሮች በእንግሊዝኛ ይነበባሉ (ለምሳሌ፡ B 12)
        utterance.rate = 0.9;     // ድምፁ ማራኪና ረጋ ያለ እንዲሆን ፍጥነቱን መቀነስ
        
        // በብሮውዘሩ ውስጥ ያሉትን ድምፆች በመፈተሽ የሴት ድምፅ (Female Voice) መምረጥ
        let voices = window.speechSynthesis.getVoices();
        let femaleVoice = voices.find(voice => voice.name.include('Google US English')  voice.name.include('Zira')  voice.name.include('Female'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        window.speechSynthesis.speak(utterance);
    }
}

function startBingoCalling() {
    // ከ 1 እስከ 75 ያሉ የቢንጎ ቁጥሮችን ማዘጋጀት
    let allNumbers = [];
    for (let i = 1; i <= 75; i++) allNumbers.push(i);
    
    // ቁጥሮቹን በዘፈቀደ ማዘዋወር (Shuffle)
    allNumbers.sort(() => Math.random() - 0.5);

    let currentIndex = 0;
    const callingInterval = setInterval(function() {
        if (currentIndex >= allNumbers.length) {
            clearInterval(callingInterval);
            return;
        }

        let num = allNumbers[currentIndex];
        let letter = "";
        let targetColId = "";

        // 5. ህግጋትን መሰረት በማድረግ ቁጥሮችን በየአምዱ መመደብ
        if (num >= 1 && num <= 15) { letter = "B"; targetColId = "col-B"; }
        else if (num >= 16 && num <= 30) { letter = "I"; targetColId = "col-I"; }
        else if (num >= 31 && num <= 45) { letter = "N"; targetColId = "col-N"; }
        else if (num >= 46 && num <= 60) { letter = "G"; targetColId = "col-G"; }
        else if (num >= 61 && num <= 75) { letter = "O"; targetColId = "col-O"; }
let fullCall = letter + "-" + num;
        
        // የላይቭ ስክሪኑን ማዘመን
        document.getElementById('called-number').innerText = fullCall;
        
        // ድምፅ ማሰማት (በሴት ድмፅ)
        speakBingo(${letter} ${num});

        // ቁጥሩን በየአምዱ ዝርዝር ውስጥ ጨምሮ በስክሪኑ ላይ ማሳየት
        const colElement = document.getElementById(targetColId);
        if (colElement) {
            colElement.innerHTML += num + "<br>";
        }

        currentIndex++;
    }, 4000); // በየ 4 ሰከንዱ አዲስ ቁጥር ይጠራል
}

function switchTab(tabName) {
    const tabs = ['game', 'wallet', 'history', 'profile'];
    tabs.forEach(function(tab) {
        document.getElementById(tab + '-tab').classList.add('hidden');
        document.getElementById('nav-' + tab).classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    document.getElementById('nav-' + tabName).classList.add('active');
}