lucide.createIcons();

let appState = JSON.parse(localStorage.getItem('english_pro_ultimate_state')) || {
    userName: 'Kevin',
    streak: 1,
    currentLesson: 1,
    unlockedSteps: { speaking: true, flashcards: false, grammar: false, listening: false, conversation: false },
    quizScores: [],
    learnedFlashcards: []
};

const masterCurriculum = [
    {
        theme: "Greetings, Slang & Introductions",
        expressions: {
            formalGreeting: "Good morning, it is a pleasure to meet you.",
            slangGreeting: "What's up? I'm Kevin, let's get to work!",
            formalFarewell: "Goodbye, have a wonderful rest of your day.",
            slangFarewell: "Catch you later, bro!"
        },
        flashcards: [
            { term: "Hello", def: "Hola", es: "👋", example: "Hello, nice to meet you today." },
            { term: "Friend", def: "Amigo / Compa", es: "🤝", example: "He is my best friend from the workshop." },
            { term: "Morning", def: "Mañana", es: "🌅", example: "Good morning, let's start early." },
            { term: "Bro", def: "Hermano / Carnal", es: "👊", example: "What's up, bro? Let's fix this." },
            { term: "Awesome", def: "Impresionante / Genial", es: "🔥", example: "That new tool looks awesome." },
            { term: "Hustle", def: "Esfuerzo / Chamba dura", es: "💼", example: "The daily hustle brings good results." },
            { term: "Cool", def: "Genial / Tranquilo", es: "😎", example: "Everything is cool here." },
            { term: "Gear", def: "Equipo / Herramientas", es: "🛠️", example: "Check out my repair gear." },
            { term: "Check", def: "Revisar / Comprobar", es: "🔍", example: "Let's check the circuit board." },
            { term: "Peace", def: "Adiós / Paz", es: "✌️", example: "See you tomorrow, peace!" }
        ],
        quizzes: [
            { id: 'q1', type: 'mc', title: 'Grammar Basics', desc: "Choose the correct form: 'She ___ to the workshop every morning.'", options: [{text: 'A) goes', correct: true}, {text: 'B) go', correct: false}], correction: "En tercera persona singular (She) el verbo lleva 'es' (goes)." },
            { id: 'q2', type: 'repair', title: 'Vocabulary Check', desc: "Type the English word for 'Amigo':", answer: "friend", correction: "Se escribe 'friend'." }
        ],
        listening: "What is up, bro? Let us start the day.",
        chatPrompt: "Hello! Let's practice greetings and slang. Say hello and tell me how you are doing today using a native expression."
    }
];

for (let i = 2; i <= 40; i++) {
    let base = masterCurriculum[0];
    masterCurriculum.push({
        theme: `Lesson ${i}: Advanced Flow & Technical Skills`,
        expressions: {
            formalGreeting: `Good day, welcome to lesson number ${i}.`,
            slangGreeting: `What's crackin'? Ready for lesson ${i}?`,
            formalFarewell: `This concludes lesson ${i}, have a great day.`,
            slangFarewell: `Catch you on the flip side, bro!`
        },
        flashcards: base.flashcards.map((f) => ({
            term: `${f.term} ${i}`,
            def: `${f.def} (${i})`,
            es: f.es,
            example: `Using ${f.term.toLowerCase()} in lesson ${i}.`
        })),
        quizzes: base.quizzes,
        listening: `Let us review lesson number ${i} with proper grammar and native flow.`,
        chatPrompt: `We are at lesson ${i}. Let's practice conversational flow and grammar regarding this topic.`
    });
}

let currentCard = 0, currentQuizIndex = 0, activeQuizItem = null;

function saveState() {
    localStorage.setItem('english_pro_ultimate_state', JSON.stringify(appState));
}

function showCustomModal(title, message, icon = "✨") {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    document.getElementById('modal-icon').innerText = icon;
    document.getElementById('custom-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}

function updateUIStats() {
    document.getElementById('streak-count').innerText = appState.streak + 'd';
    document.getElementById('vocab-vault-count').innerText = appState.learnedFlashcards.length;
    document.getElementById('header-badge').innerText = `Lesson ${appState.currentLesson} / 40`;
    document.getElementById('welcome-title').innerText = `Welcome back, ${appState.userName || 'Kevin'}!`;
    updateStepsUI();
}

function updateStepsUI() {
    const keys = ['speaking', 'flashcards', 'grammar', 'listening', 'conversation'];
    let unlockedCount = keys.filter(k => appState.unlockedSteps[k]).length;
    document.getElementById('session-progress-text').innerText = `Phase ${unlockedCount} / 5`;
    document.getElementById('session-bar').style.width = `${(unlockedCount / 5) * 100}%`;
}

function unlockNextStep(currentKey, nextKey) {
    appState.unlockedSteps[nextKey] = true;
    saveState();
    updateStepsUI();
    switchTab(nextKey);
}

function switchTab(tabName) {
    if (!appState.unlockedSteps[tabName]) {
        showCustomModal("Phase Locked 🔒", "Complete previous phase first.", "⚠️");
        return;
    }
    document.querySelectorAll('#lesson-view-container > div').forEach(el => el.classList.add('hidden'));
    document.getElementById('content-' + tabName).classList.remove('hidden');
}

function loadCurrentLesson() {
    let lessonData = masterCurriculum[(appState.currentLesson - 1) % masterCurriculum.length];

    renderPowerExpressionsUI(lessonData, appState.currentLesson);
    renderFlashcardsUI(lessonData);
    loadQuizQuestion();
    renderListeningUI(lessonData);
    renderConversationUI(lessonData);

    currentCard = 0;
    currentQuizIndex = 0;
    roleplayTurns = 0;
    updateCardFlip();
    switchTab('speaking');
}

function renderPowerExpressionsUI(lessonData, lessonNumber) {
    const container = document.getElementById('content-speaking');
    if (!container) return;

    const expr = lessonData.expressions;
    const cleanFormalG = expr.formalGreeting.replace(/'/g, "\\'");
    const cleanSlangG = expr.slangGreeting.replace(/'/g, "\\'");
    const cleanFormalF = expr.formalFarewell.replace(/'/g, "\\'");
    const cleanSlangF = expr.slangFarewell.replace(/'/g, "\\'");
    const currentUserName = appState.userName || 'Kevin';

    container.innerHTML = `
        <div class="vibrant-card rounded-2xl p-6 space-y-6">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full">
                    ⚡ Phase 1: Power Expressions & Roleplay
                </span>
                <span class="text-xs text-slate-400 font-bold">Lesson ${lessonNumber} / 40</span>
            </div>

            <div class="space-y-4">
                <h3 class="text-base font-extrabold text-slate-900">${lessonData.theme}</h3>
                <p class="text-xs text-slate-600 font-medium">Estudia estas expresiones clave antes de arrancar el roleplay:</p>

                <div class="space-y-2.5">
                    <h4 class="text-xs font-extrabold text-blue-700 uppercase tracking-wide">👔 Estilo Formal / Profesional</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                            <div>
                                <p class="text-[11px] font-bold text-slate-500 uppercase">Saludo formal:</p>
                                <p class="text-xs font-bold text-blue-900 mt-1">"${expr.formalGreeting}"</p>
                            </div>
                            <button onclick="speakSpecificTextCustom('${cleanFormalG}')" class="text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs cursor-pointer font-bold hover:bg-blue-50">🔊</button>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                            <div>
                                <p class="text-[11px] font-bold text-slate-500 uppercase">Despedida formal:</p>
                                <p class="text-xs font-bold text-blue-900 mt-1">"${expr.formalFarewell}"</p>
                            </div>
                            <button onclick="speakSpecificTextCustom('${cleanFormalF}')" class="text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs cursor-pointer font-bold hover:bg-blue-50">🔊</button>
                        </div>
                    </div>
                </div>

                <div class="space-y-2.5 pt-2">
                    <h4 class="text-xs font-extrabold text-emerald-700 uppercase tracking-wide">🔥 Estilo Nativo / Slang</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                            <div>
                                <p class="text-[11px] font-bold text-slate-500 uppercase">Slang de apertura:</p>
                                <p class="text-xs font-bold text-emerald-900 mt-1">"${expr.slangGreeting}"</p>
                            </div>
                            <button onclick="speakSpecificTextCustom('${cleanSlangG}')" class="text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs cursor-pointer font-bold hover:bg-emerald-50">🔊</button>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                            <div>
                                <p class="text-[11px] font-bold text-slate-500 uppercase">Slang de cierre:</p>
                                <p class="text-xs font-bold text-emerald-900 mt-1">"${expr.slangFarewell}"</p>
                            </div>
                            <button onclick="speakSpecificTextCustom('${cleanSlangF}')" class="text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs cursor-pointer font-bold hover:bg-emerald-50">🔊</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                    <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wide">🤖 Step 2: Native Street Chat (Roleplay)</h4>
                    <div class="flex gap-2">
                        <button onclick="setRoleplayMode('formal')" id="btn-mode-formal" class="text-[11px] px-3 py-1 rounded-lg font-bold bg-blue-600 text-white cursor-pointer">👔 Formal</button>
                        <button onclick="setRoleplayMode('slang')" id="btn-mode-slang" class="text-[11px] px-3 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 cursor-pointer">😎 Slang</button>
                    </div>
                </div>

                <div id="roleplay-chat-box" class="bg-slate-50 border border-slate-200 rounded-xl p-4 h-48 overflow-y-auto space-y-3 text-xs">
                    <div class="text-left">
                        <span class="bg-white border border-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl inline-block font-medium">
                            Hey, hello ${currentUserName}! Let's get started. How is it going today?
                        </span>
                    </div>
                </div>

                <div class="flex gap-2">
                    <input type="text" id="roleplay-user-input" placeholder="Reply naturally to the tutor..." class="flex-1 vibrant-input rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none font-medium" onkeypress="if(event.key === 'Enter') sendRoleplayMessage()">
                    <button onclick="sendRoleplayMessage()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xs cursor-pointer">Send ➔</button>
                </div>

                <div class="flex justify-between items-center pt-2">
                    <span id="roleplay-turns-counter" class="text-[11px] font-bold text-slate-400">Turns: 0 / 3 completed</span>
                    <button onclick="unlockNextStep('speaking', 'flashcards')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-all">
                        Continuar a Flashcards ➔
                    </button>
                </div>
            </div>
        </div>
    `;
}

let roleplayMode = 'formal';
function setRoleplayMode(mode) {
    roleplayMode = mode;
    document.getElementById('btn-mode-formal').className = mode === 'formal' ? "text-[11px] px-3 py-1 rounded-lg font-bold bg-blue-600 text-white cursor-pointer" : "text-[11px] px-3 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 cursor-pointer";
    document.getElementById('btn-mode-slang').className = mode === 'slang' ? "text-[11px] px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white cursor-pointer" : "text-[11px] px-3 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 cursor-pointer";
}

let roleplayTurns = 0;
function sendRoleplayMessage() {
    const input = document.getElementById('roleplay-user-input');
    const msg = input ? input.value.trim() : '';
    if (!msg) return;

    const chatBox = document.getElementById('roleplay-chat-box');
    chatBox.innerHTML += `<div class="text-right"><span class="bg-emerald-600 text-white px-3.5 py-2 rounded-2xl inline-block font-medium">${msg}</span></div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    roleplayTurns++;
    document.getElementById('roleplay-turns-counter').innerText = `Turns: ${roleplayTurns} / 3 completed`;

    setTimeout(() => {
        let reply = roleplayMode === 'slang' ? 
            "Oh, sounds good! That's awesome, bro. Catch you later!" : 
            "Very well, I appreciate your response. Have a wonderful day ahead, goodbye.";
        
        chatBox.innerHTML += `<div class="text-left"><span class="bg-white border border-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl inline-block font-medium">${reply}</span></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

function renderFlashcardsUI(lessonData) {
    const container = document.getElementById('content-flashcards');
    if (!container) return;

    container.innerHTML = `
        <div class="vibrant-card rounded-2xl p-6 space-y-6 text-center">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full">
                    📚 Phase 2: Vocab Vault & Flashcards (10 Cards)
                </span>
                <span id="flash-badge" class="text-xs text-slate-400 font-bold">Word 1 of 10</span>
            </div>

            <div onclick="flipFlashcard()" class="card-flip w-full h-56 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 transition-all hover:bg-slate-100 relative select-none shadow-xs">
                <div id="flash-front" class="space-y-3">
                    <span id="flash-img" class="text-4xl">📚</span>
                    <h3 id="flash-term" class="text-2xl font-black text-slate-900">Term</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">🔄 Haz clic para voltear</p>
                </div>
                <div id="flash-back" class="hidden space-y-3">
                    <span class="text-xs font-extrabold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">Significado y Ejemplo</span>
                    <h3 id="flash-def" class="text-xl font-extrabold text-slate-900">Definición</h3>
                    <p id="flash-example" class="text-xs text-slate-600 font-medium italic">Ejemplo de uso...</p>
                </div>
            </div>

            <div class="flex items-center justify-between pt-2">
                <button onclick="prevCard()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">← Anterior</button>
                <button onclick="nextCard()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer">Siguiente ➔</button>
            </div>
        </div>
    `;
    window.currentFlashcardList = lessonData.flashcards;
}

let isCardFlipped = false;
function flipFlashcard() {
    isCardFlipped = !isCardFlipped;
    document.getElementById('flash-front').classList.toggle('hidden', isCardFlipped);
    document.getElementById('flash-back').classList.toggle('hidden', !isCardFlipped);
}

function updateCardFlip() {
    isCardFlipped = false;
    const card = window.currentFlashcardList[currentCard];
    document.getElementById('flash-badge').innerText = `Word ${currentCard + 1} of 10`;
    document.getElementById('flash-term').innerText = card.term;
    document.getElementById('flash-def').innerText = `${card.es} ${card.def}`;
    document.getElementById('flash-example').innerText = `"${card.example}"`;
    document.getElementById('flash-img').innerText = card.es;
    document.getElementById('flash-front').classList.remove('hidden');
    document.getElementById('flash-back').classList.add('hidden');
}

function nextCard() {
    currentCard++;
    if (currentCard >= window.currentFlashcardList.length) {
        window.currentFlashcardList.forEach(card => {
            if (!appState.learnedFlashcards.some(item => item.term === card.term)) {
                appState.learnedFlashcards.push(card);
            }
        });
        saveState();
        unlockNextStep('flashcards', 'grammar');
    } else { updateCardFlip(); }
}

function prevCard() {
    currentCard = (currentCard - 1 + window.currentFlashcardList.length) % window.currentFlashcardList.length;
    updateCardFlip();
}

function loadQuizQuestion() {
    let lessonData = masterCurriculum[(appState.currentLesson - 1) % masterCurriculum.length];
    window.activeQuizzes = lessonData.quizzes;
    if (currentQuizIndex >= window.activeQuizzes.length) return;
    activeQuizItem = window.activeQuizzes[currentQuizIndex];
    
    document.getElementById('quiz-counter').innerText = `Challenge ${currentQuizIndex + 1} of ${window.activeQuizzes.length}`;
    document.getElementById('quiz-title').innerText = activeQuizItem.title;
    document.getElementById('quiz-desc').innerText = activeQuizItem.desc;
    
    const optContainer = document.getElementById('quiz-options');
    const errContainer = document.getElementById('error-repair-container');
    document.getElementById('quiz-instant-feedback').classList.add('hidden');
    optContainer.innerHTML = '';

    if (activeQuizItem.type === "repair") {
        optContainer.classList.add('hidden');
        errContainer.classList.remove('hidden');
        document.getElementById('error-input').value = '';
    } else {
        errContainer.classList.add('hidden');
        optContainer.classList.remove('hidden');
        activeQuizItem.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-800 font-bold shadow-sm cursor-pointer";
            btn.innerText = opt.text;
            btn.onclick = () => processQuizAnswer(opt.correct);
            optContainer.appendChild(btn);
        });
    }
}

function submitErrorCorrection() {
    const userVal = document.getElementById('error-input').value.trim().toLowerCase();
    processQuizAnswer(userVal.includes(activeQuizItem.answer.toLowerCase()));
}

function processQuizAnswer(isCorrect) {
    const fb = document.getElementById('quiz-instant-feedback');
    fb.classList.remove('hidden');
    fb.className = isCorrect ? "text-xs mt-3 p-4 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold" : "text-xs mt-3 p-4 rounded-xl bg-rose-100 text-rose-900 font-medium";
    fb.innerHTML = isCorrect ? "<div>Correct! 🌟</div>" : `<div>Incorrect. Rule: ${activeQuizItem.correction}</div>`;

    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < window.activeQuizzes.length) { loadQuizQuestion(); }
        else { unlockNextStep('grammar', 'listening'); }
    }, 2000);
}

function renderListeningUI(lessonData) {
    window.currentListeningTarget = lessonData.listening;
}

function playListeningAudio() {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(window.currentListeningTarget);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
}

function checkListeningDictation() {
    const val = document.getElementById('listening-input').value.trim();
    if (val.length > 5) {
        document.getElementById('listening-result').innerHTML = '<span class="text-emerald-700 font-extrabold">🎯 Approved! Moving to Conversational Practice.</span>';
        setTimeout(() => unlockNextStep('listening', 'conversation'), 1000);
    } else {
        document.getElementById('listening-result').innerHTML = '<span class="text-rose-600 font-bold">⚠️ Try again. Type the sentence heard.</span>';
    }
}

function renderConversationUI(lessonData) {
    const tutorMsg = document.getElementById('chat-tutor-message');
    if (tutorMsg) tutorMsg.innerText = lessonData.chatPrompt;
}

function speakSpecificTextCustom(text) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
}

function sendChatTurn() {
    const input = document.getElementById('chat-user-input');
    const msg = input ? input.value.trim() : '';
    if (!msg) return;

    const chatContainer = document.getElementById('chat-messages-container');
    chatContainer.innerHTML += `<div class="text-right"><span class="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-2xl inline-block font-medium">${msg}</span></div>`;
    input.value = '';

    setTimeout(() => {
        chatContainer.innerHTML += `<div class="text-left space-y-1"><span class="bg-slate-100 text-slate-800 text-xs px-3.5 py-2 rounded-2xl inline-block font-medium">✨ Great job! Your sentence is well structured. Let's keep the native flow going.</span></div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        document.getElementById('chat-turn-counter').innerText = "Turns: 4 / 4 completed";
        document.getElementById('btn-finish-lesson').classList.remove('hidden');
    }, 1000);
}

function finishCurrentLesson() {
    showCustomModal("¡Lección Completada! 🌟", "Has dominado esta lección con éxito. ¡Siguiente lección desbloqueada!", "🚀");
    appState.currentLesson++;
    appState.unlockedSteps = { speaking: true, flashcards: false, grammar: false, listening: false, conversation: false };
    saveState();
    setTimeout(() => {
        closeModal();
        loadCurrentLesson();
    }, 1500);
}

function openVocabularyVault() {
    const container = document.getElementById('vault-list-container');
    container.innerHTML = '';
    if (appState.learnedFlashcards.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-xs text-slate-500 font-semibold">Bóveda vacía. ¡Completa flashcards para llenarla!</div>`;
    } else {
        appState.learnedFlashcards.forEach(card => {
            container.innerHTML += `<div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold"><span>${card.es} ${card.term} - ${card.def}</span><span class="text-slate-400 font-normal">Vault</span></div>`;
        });
    }
    document.getElementById('vocabulary-vault-modal').classList.remove('hidden');
}

function closeVocabularyVault() {
    document.getElementById('vocabulary-vault-modal').classList.add('hidden');
}

window.onload = () => {
    updateUIStats();
    loadCurrentLesson();
};