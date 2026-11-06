lucide.createIcons();

let appState = JSON.parse(localStorage.getItem('english_pro_ultimate_state')) || {
    userName: '',
    streak: 1,
    currentMode: 'intermediate',
    beginnerLesson: 1,
    intermediateLesson: 1,
    roleplayMode: 'casual', // 'formal' o 'casual'
    unlockedSteps: { speaking: true, flashcards: false, grammar: false, listening: false, shadowing: false },
    quizScores: [],
    learnedFlashcards: [],
    hasStarted: false
};

// CURRICULUM BEGINNER: Enfoque en bases, vocabulario cotidiano y estructuras simples
const curriculumBeginner = [];
const beginnerTopics = [
    {
        theme: "Greetings & Introductions", 
        word: {w: "Hello", d: "Hola", e: "👋"}, 
        sentence: "Hello, nice to meet you.", 
        shadow: "Hello! I am learning English.",
        greeting: "Pretty good, thanks!",
        greetingSlang: "What's up? I'm Kevin, let's chat!",
        farewell: "See you later, have a great day!",
        farewellSlang: "Catch you later, bro!"
    },
    {
        theme: "Common Objects & Colors", 
        word: {w: "Book", d: "Libro", e: "📖"}, 
        sentence: "This is a red book on the table.", 
        shadow: "This is my favorite book.",
        greeting: "Good morning! Look at this.",
        greetingSlang: "Hey! Check this out.",
        farewell: "Goodbye, see you tomorrow.",
        farewellSlang: "See you around!"
    },
    {
        theme: "Family Members", 
        word: {w: "Family", d: "Familia", e: "👨‍👩‍👧‍👦"}, 
        sentence: "My family lives in a nice house.", 
        shadow: "I love my family very much.",
        greeting: "Hi there! How is your family?",
        greetingSlang: "What's going on with your folks?",
        farewell: "Say hi to your family for me.",
        farewellSlang: "Take care of your family, peace!"
    },
    {
        theme: "Daily Routines", 
        word: {w: "Morning", d: "Mañana", e: "🌅"}, 
        sentence: "I wake up early every morning.", 
        shadow: "I wake up early in the morning.",
        greeting: "Good morning! Ready for the day?",
        greetingSlang: "Rise and shine!",
        farewell: "Time to rest, good night.",
        farewellSlang: "I'm heading to bed, catch you tomorrow!"
    },
    {
        theme: "Food & Drinks", 
        word: {w: "Water", d: "Agua", e: "💧"}, 
        sentence: "I drink a glass of water every day.", 
        shadow: "I like to drink cold water.",
        greeting: "Hi! Are you thirsty?",
        greetingSlang: "Hey! Let's grab something to drink.",
        farewell: "Thanks for the meal, see you!",
        farewellSlang: "Im stuffed, catch you later!"
    }
];

for (let i = 1; i <= 40; i++) {
    let tData = beginnerTopics[(i - 1) % beginnerTopics.length];
    let blockNum = Math.ceil(i / 10);
    curriculumBeginner.push({
        id: i, block: blockNum, theme: `Beginner Lesson ${i}: ${tData.theme}`,
        roleplay: { introLine: `Hello! Let's practice beginner English. Lesson ${i}: ${tData.theme}. Remember to use greetings and farewells!` },
        flashcards: [
            { term: tData.word.w, def: tData.word.d, es: tData.word.e, emoji: tData.word.e },
            { term: "Friend", def: "Amigo", es: "🤝", emoji: "🤝" }
        ],
        quizzes: [
            { id: `b_l${i}_q1`, type: 'mc', title: 'Grammar Basics', desc: "Choose the correct verb form: 'She ___ to school.'", options: [{text: 'A) goes', correct: true}, {text: 'B) go', correct: false}], correction: "En tercera persona singular (She) se usa 'goes'." },
            { id: `b_l${i}_q2`, type: 'repair', title: 'Vocabulary Check', desc: `Type in English for '${tData.word.d}':`, answer: tData.word.w.toLowerCase(), correction: `Se escribe '${tData.word.w}'.` }
        ],
        listening: tData.sentence,
        shadow: tData.shadow,
        expressions: {
            greeting: tData.greeting,
            greetingSlang: tData.greetingSlang,
            farewell: tData.farewell,
            farewellSlang: tData.farewellSlang
        }
    });
}

// CURRICULUM INTERMEDIATE: Viajes, compras, restaurantes, vida diaria
const curriculumIntermediate = [];
const intermediateTopics = [
    {
        theme: "Travel & Airport Logistics", 
        word: {w: "Boarding", d: "Embarque", e: "✈️"}, 
        sentence: "What time is final boarding call for gate four?", 
        shadow: "We need to find our boarding gate quickly.",
        greeting: "Hello, could you help me with my flight?",
        greetingSlang: "Hey! Quick question about the flight.",
        farewell: "Thank you for your help, have a great flight.",
        farewellSlang: "Thanks a lot, catch my flight now!"
    },
    {
        theme: "Shopping & Bargaining", 
        word: {w: "Discount", d: "Descuento", e: "🏷️"}, 
        sentence: "Is there any discount available on this jacket?", 
        shadow: "I am looking for a good discount today.",
        greeting: "Hi, I am looking for some new clothes.",
        greetingSlang: "Hey! Just browsing around.",
        farewell: "Thanks, I will think about it and come back.",
        farewellSlang: "Thanks anyway, see you!"
    },
    {
        theme: "Restaurants & Dining Out", 
        word: {w: "Reservation", d: "Reservación", e: "🍽️"}, 
        sentence: "We have a table reservation under the name Smith.", 
        shadow: "Could we see the menu, please?",
        greeting: "Good evening, we have a table booked.",
        greetingSlang: "Hey! We are ready to order.",
        farewell: "The food was amazing, check please!",
        farewellSlang: "Thanks for everything, see ya!"
    },
    {
        theme: "Hotels & Accommodation", 
        word: {w: "Check-in", d: "Registro de entrada", e: "🏨"}, 
        sentence: "I would like to check in and get my room key.", 
        shadow: "What time is checkout tomorrow morning?",
        greeting: "Hello, I would like to check into my room.",
        greetingSlang: "Hey! Checking in for the night.",
        farewell: "Thank you for the stay, goodbye.",
        farewellSlang: "Thanks for the great service, peace!"
    },
    {
        theme: "Emergency & City Directions", 
        word: {w: "Pharmacy", d: "Farmacia", e: "💊"}, 
        sentence: "Excuse me, where is the nearest open pharmacy?", 
        shadow: "Can you help me find the train station?",
        greeting: "Excuse me, I need some quick assistance.",
        greetingSlang: "Hey! Can you help me out real quick?",
        farewell: "Thank you so much for the directions.",
        farewellSlang: "Appreciate your help, catch you later!"
    }
];

for (let i = 1; i <= 40; i++) {
    let tData = intermediateTopics[(i - 1) % intermediateTopics.length];
    let blockNum = Math.ceil(i / 10);
    curriculumIntermediate.push({
        id: i, block: blockNum, theme: `Intermediate Lesson ${i}: ${tData.theme}`,
        roleplay: { introLine: `Hey there! Ready to practice Intermediate Lesson ${i} about ${tData.theme.toLowerCase()}? Let's use proper openings and farewells!` },
        flashcards: [
            { term: tData.word.w, def: tData.word.d, es: tData.word.e, emoji: tData.word.e },
            { term: "Luggage", def: "Equipaje", es: "🧳", emoji: "🧳" }
        ],
        quizzes: [
            { id: `i_l${i}_q1`, type: 'mc', title: 'Intermediate Grammar', desc: "Choose the correct phrase: 'If I ___ time tomorrow, I will visit the museum.'", options: [{text: 'A) have', correct: true}, {text: 'B) had', correct: false}], correction: "En el primer condicional se usa el presente simple ('have') en la cláusula principal." },
            { id: `i_l${i}_q2`, type: 'repair', title: 'Conversational Vocabulary', desc: `Type in English for '${tData.word.d}':`, answer: tData.word.w.toLowerCase(), correction: `El término correcto es '${tData.word.w}'.` }
        ],
        listening: tData.sentence,
        shadow: tData.shadow,
        expressions: {
            greeting: tData.greeting,
            greetingSlang: tData.greetingSlang,
            farewell: tData.farewell,
            farewellSlang: tData.farewellSlang
        }
    });
}

let currentCard = 0, currentQuizIndex = 0, activeQuizItem = null, currentListeningTarget = "";
let activeQuizzes = [], activeFlashcards = [], roleplayInteractionCount = 0, selectedSetupMode = 'intermediate';

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
    
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    
    document.getElementById('current-block-label').innerText = isInter ? 'Nivel: Intermedio (General)' : 'Nivel: Beginner';
    document.getElementById('header-badge').innerText = `Lesson ${currLesson} / 40`;
    document.getElementById('course-subtitle').innerText = isInter ? 'Intermediate Conversational & Travel Course' : 'Beginner Foundation Course';
    document.getElementById('welcome-title').innerText = `Welcome back, ${appState.userName || 'Kevin'}!`;
    
    const nameToUse = appState.userName || 'Kevin';
    const s1 = document.getElementById('g-slang1');
    const s2 = document.getElementById('g-slang2');
    if (s1) s1.innerText = `Hey! I'm ${nameToUse}, great to meet you.`;
    if (s2) s2.innerText = `What's up? I'm ${nameToUse}, let's chat!`;

    updateStepsUI();
}

function speakDynamicSlang(type) {
    const nameToUse = appState.userName || 'Kevin';
    speakSpecificTextCustom(type === 1 ? `Hey! I am ${nameToUse}, great to meet you.` : `What is up? I am ${nameToUse}, let us chat!`);
}

function updateStepsUI() {
    let unlockedCount = Object.values(appState.unlockedSteps).filter(Boolean).length;
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

function setInitialMode(mode) {
    selectedSetupMode = mode;
    const btnBeg = document.getElementById('btn-mode-beginner');
    const btnInt = document.getElementById('btn-mode-intermediate');
    const passContainer = document.getElementById('password-container');
    
    if (mode === 'beginner') {
        btnBeg.className = "p-3 rounded-2xl border-2 border-sky-500 bg-sky-50 text-xs font-extrabold text-sky-800 shadow-sm cursor-pointer";
        btnInt.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 cursor-pointer";
        if (passContainer) passContainer.classList.add('hidden');
    } else {
        btnInt.className = "p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-xs font-extrabold text-emerald-800 shadow-sm cursor-pointer";
        btnBeg.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 cursor-pointer";
        if (passContainer) passContainer.classList.remove('hidden');
    }
}

function completeSetupAndStart() {
    const nameInput = document.getElementById('setup-name-input');
    const userName = nameInput ? nameInput.value.trim() : '';

    if (!userName) {
        showCustomModal("Nombre Requerido ⚠️", "Por favor, escribe tu nombre para continuar.", "✍️");
        return;
    }

    if (selectedSetupMode === 'intermediate') {
        const passInput = document.getElementById('setup-password-input');
        const passwordValue = passInput ? passInput.value.trim() : '';
        
        if (passwordValue !== 'b1pro') {
            showCustomModal("Acceso Denegado 🔒", "La contraseña introducida es incorrecta (b1pro).", "⚠️");
            return;
        }
    }

    appState.userName = userName;
    appState.currentMode = selectedSetupMode;
    appState.hasStarted = true;
    saveState();

    const setupContainer = document.getElementById('welcome-setup-container');
    if (setupContainer) setupContainer.classList.add('hidden');
    
    updateUIStats();
    loadCurrentLesson();
}

function getRequiredTurns() {
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    if (currLesson <= 10) return 4;
    if (currLesson <= 25) return 6;
    return 8;
}

function setRoleplayMode(mode) {
    appState.roleplayMode = mode;
    saveState();
    
    const btnFormal = document.getElementById('btn-mode-formal');
    const btnCasual = document.getElementById('btn-mode-casual');
    
    if (mode === 'formal') {
        btnFormal.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-blue-600 text-white shadow-sm cursor-pointer";
        btnCasual.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer";
    } else {
        btnCasual.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm cursor-pointer";
        btnFormal.className = "px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer";
    }
}

function loadCurrentLesson() {
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    let lessonData = (isInter ? curriculumIntermediate : curriculumBeginner)[(currLesson - 1) % 40];

    currentListeningTarget = lessonData.listening;
    roleplayInteractionCount = 0;
    activeFlashcards = lessonData.flashcards;
    activeQuizzes = lessonData.quizzes;

    const maxTurns = getRequiredTurns();
    document.getElementById('roleplay-scenario-tag').innerText = lessonData.theme;
    document.getElementById('shadow-text').innerText = `"${lessonData.shadow}"`;
    document.getElementById('roleplay-counter-label').innerText = `Turns: 0 / ${maxTurns} completed`;

    // Renderizar la Sección de Apertura y Cierre (Step 1) con los datos exactos de la lección
    renderCoreExpressionsUI(lessonData, currLesson);

    // Inyectar controles de modo Formal/Casual justo arriba del chat si no existen
    let chatContainerWrapper = document.getElementById('chat-messages-container').parentElement;
    let modeSelector = document.getElementById('roleplay-mode-selector');
    if (!modeSelector) {
        modeSelector = document.createElement('div');
        modeSelector.id = 'roleplay-mode-selector';
        modeSelector.className = "flex items-center justify-between mb-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs";
        modeSelector.innerHTML = `
            <span class="font-extrabold text-slate-700">Modo de Tutoría:</span>
            <div class="flex gap-2">
                <button id="btn-mode-formal" onclick="setRoleplayMode('formal')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer">👔 Formal / Profesional</button>
                <button id="btn-mode-casual" onclick="setRoleplayMode('casual')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-sm cursor-pointer">😎 Casual / Slang</button>
            </div>
        `;
        chatContainerWrapper.insertBefore(modeSelector, document.getElementById('chat-messages-container'));
    }
    setRoleplayMode(appState.roleplayMode || 'casual');

    const chatBox = document.getElementById('chat-messages-container');
    chatBox.innerHTML = `
        <div class="flex items-start gap-2.5">
            <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">🤖</div>
            <div class="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm text-xs text-slate-800 max-w-[85%]">
                <p class="font-extrabold text-sky-700 mb-0.5">Tutor (${lessonData.theme}):</p>
                <p class="font-medium">${lessonData.roleplay.introLine}</p>
            </div>
        </div>
    `;

    currentCard = 0;
    currentQuizIndex = 0;
    updateCard();
    loadQuizQuestion();
    switchTab('speaking');
}

// Función que dibuja dinámicamente la Apertura y el Cierre de cada lección
function renderCoreExpressionsUI(lessonData, lessonNumber) {
    const container = document.querySelector('#content-speaking');
    if (!container) return;

    // Buscar o crear un contenedor dedicado para las expresiones de apertura y cierre arriba del chat
    let exprContainer = document.getElementById('lesson-expressions-container');
    if (!exprContainer) {
        exprContainer = document.createElement('div');
        exprContainer.id = 'lesson-expressions-container';
        exprContainer.className = "mb-5";
        container.insertBefore(exprContainer, container.firstChild);
    }

    const expr = lessonData.expressions;
    exprContainer.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Step 1: Core Expressions (Apertura y Cierre)
                </span>
                <span class="text-xs text-slate-400 font-medium">Lesson ${lessonNumber} / 40</span>
            </div>

            <h3 class="text-base font-extrabold text-slate-800">${lessonData.theme}</h3>

            <!-- 🟢 SECCIÓN A: APERTURA Y SALUDOS -->
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1.5">
                    👋 Section A: Apertura y Saludos (Greetings)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs font-bold text-slate-700">💬 Cómo saludar:</p>
                            <p class="text-xs font-semibold text-emerald-600 mt-1">"${expr.greeting}"</p>
                        </div>
                        <button onclick="speakSpecificTextCustom('${expr.greeting}')" class="text-xs bg-white border border-slate-200 p-2 rounded-xl shadow-xs">🔊</button>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs font-bold text-slate-700">🔥 Slang de Apertura:</p>
                            <p class="text-xs font-semibold text-emerald-600 mt-1">"${expr.greetingSlang}"</p>
                        </div>
                        <button onclick="speakSpecificTextCustom('${expr.greetingSlang}')" class="text-xs bg-white border border-slate-200 p-2 rounded-xl shadow-xs">🔊</button>
                    </div>
                </div>
            </div>

            <!-- 🔴 SECCIÓN B: CIERRE Y DESPEDIDAS -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
                <h4 class="text-xs font-bold text-rose-700 uppercase tracking-wide flex items-center gap-1.5">
                    🚪 Section B: Cierre y Despedidas (Farewells)
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs font-bold text-slate-700">💬 Cómo despedirse:</p>
                            <p class="text-xs font-semibold text-rose-600 mt-1">"${expr.farewell}"</p>
                        </div>
                        <button onclick="speakSpecificTextCustom('${expr.farewell}')" class="text-xs bg-white border border-slate-200 p-2 rounded-xl shadow-xs">🔊</button>
                    </div>
                    <div class="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs font-bold text-slate-700">🔥 Slang de Cierre:</p>
                            <p class="text-xs font-semibold text-rose-600 mt-1">"${expr.farewellSlang}"</p>
                        </div>
                        <button onclick="speakSpecificTextCustom('${expr.farewellSlang}')" class="text-xs bg-white border border-slate-200 p-2 rounded-xl shadow-xs">🔊</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function sendRoleplayMessage() {
    const input = document.getElementById('roleplay-user-input');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('chat-messages-container');
    if (text.split(/\s+/).length < 2) {
        showCustomModal("Aviso", "Escribe al menos 2 palabras en inglés.", "⚠️");
        return;
    }

    // Regla de oro: Detección y corrección estricta de errores con explicación en español
    let grammarNotice = "";
    let cleanText = text.toLowerCase();
    
    if (cleanText.includes("i don't now") || cleanText.includes("i dont now")) {
        grammarNotice = "<br><span class='text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg block mt-1.5 border border-amber-200'>💡 <b>Corrección del tutor:</b> Se escribe <b>'I don't know'</b>. <i>¿Por qué?</i> Usas 'know' (con k) para el verbo saber, y no 'now' (de ahora).</span>";
    }

    chatBox.innerHTML += `
        <div class="flex items-start gap-2.5 justify-end">
            <div class="bg-emerald-500 text-white p-3.5 rounded-2xl shadow-sm text-xs max-w-[85%]">
                <p class="font-extrabold text-emerald-100 mb-0.5">Tú (${appState.userName}):</p>
                <p class="font-medium">${text}${grammarNotice}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">😎</div>
        </div>
    `;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        roleplayInteractionCount++;
        const maxTurns = getRequiredTurns();
        document.getElementById('roleplay-counter-label').innerText = `Turns: ${roleplayInteractionCount} / ${maxTurns} completed`;
        
        const isInter = appState.currentMode === 'intermediate';
        let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
        let lessonData = (isInter ? curriculumIntermediate : curriculumBeginner)[(currLesson - 1) % 40];
        
        let dynamicReply = "";
        const mode = appState.roleplayMode || 'casual';

        if (roleplayInteractionCount < maxTurns) {
            // Guía inteligente: En el penúltimo/último turno te pide aplicar la despedida de la Sección B
            if (roleplayInteractionCount === maxTurns - 1) {
                dynamicReply = `Great conversation! Now, to wrap things up, try using our farewell phrase: "${lessonData.expressions.farewell}" or its slang version.`;
            } else {
                if (mode === 'formal') {
                    dynamicReply = `Thank you for your input. In the context of <b>${lessonData.theme}</b>, could you elaborate further using professional phrasing?`;
                } else {
                    dynamicReply = `That sounds cool! Regarding <b>${lessonData.theme}</b>, tell me more about how you handle that situation in real life.`;
                }
            }
        } else {
            dynamicReply = `¡Excelente trabajo completando los ${maxTurns} turnos usando apertura y cierre! Haz clic en **'Validate Roleplay & Proceed ➔'** para desbloquear la Bóveda de Vocabulario.`;
        }
        
        chatBox.innerHTML += `
            <div class="flex items-start gap-2.5">
                <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">🤖</div>
                <div class="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm text-xs text-slate-800 max-w-[85%]">
                    <p class="font-extrabold text-sky-700 mb-0.5">Tutor (${mode.toUpperCase()}):</p>
                    <p class="font-medium">${dynamicReply}</p>
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

function completeRoleplayPhase() {
    const maxTurns = getRequiredTurns();
    if (roleplayInteractionCount < maxTurns) {
        showCustomModal("Incomplete", `Completa los ${maxTurns} turnos conversacionales requeridos para esta lección.`, "💬");
        return;
    }
    unlockNextStep('speaking', 'flashcards');
}

function speakSpecificTextCustom(text) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
}

let activeRecognition = null;
function toggleSpeechRecognition() {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) return;
    if (activeRecognition) { activeRecognition.stop(); activeRecognition = null; return; }
    activeRecognition = new SpeechAPI();
    activeRecognition.lang = 'en-US';
    activeRecognition.onresult = (e) => {
        document.getElementById('roleplay-user-input').value = e.results[0][0].transcript;
        sendRoleplayMessage();
        activeRecognition = null;
    };
    activeRecognition.onerror = () => { activeRecognition = null; };
    activeRecognition.start();
}

function updateCard() {
    if (activeFlashcards.length === 0) return;
    const card = activeFlashcards[currentCard];
    document.getElementById('flash-badge').innerText = `Word #${currentCard + 1} of ${activeFlashcards.length}`;
    document.getElementById('flash-term').innerText = card.term;
    document.getElementById('flash-def').innerText = card.def;
    document.getElementById('flash-es').innerText = card.es;
    document.getElementById('flash-img').innerText = card.emoji || "📚";
}

function nextCard() {
    currentCard++;
    if (currentCard >= activeFlashcards.length) {
        activeFlashcards.forEach(card => {
            if (!appState.learnedFlashcards.some(item => item.term === card.term)) {
                appState.learnedFlashcards.push(card);
            }
        });
        saveState();
        unlockNextStep('flashcards', 'grammar');
    } else { updateCard(); }
}

function prevCard() {
    currentCard = (currentCard - 1 + activeFlashcards.length) % activeFlashcards.length;
    updateCard();
}

function loadQuizQuestion() {
    if (currentQuizIndex >= activeQuizzes.length) return;
    activeQuizItem = activeQuizzes[currentQuizIndex];
    document.getElementById('quiz-counter').innerText = `Challenge ${currentQuizIndex + 1} of ${activeQuizzes.length}`;
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
        if (currentQuizIndex < activeQuizzes.length) { loadQuizQuestion(); }
        else { unlockNextStep('grammar', 'listening'); }
    }, 2000);
}

function playListeningAudio() {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentListeningTarget);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
}

function checkListeningDictation() {
    const val = document.getElementById('listening-input').value.trim();
    if (val.length > 3) {
        document.getElementById('listening-result').innerHTML = '<span class="text-emerald-700 font-extrabold">🎯 Approved! Moving to Shadowing.</span>';
        setTimeout(() => unlockNextTestOrStep(), 1000);
    } else {
        document.getElementById('listening-result').innerHTML = '<span class="text-rose-600 font-bold">⚠️ Try again.</span>';
    }
}

function unlockNextTestOrStep() {
    unlockNextStep('listening', 'shadowing');
}

function speakShadowText() {
    speakSpecificTextCustom(document.getElementById('shadow-text').innerText.replace(/"/g, ''));
}

function verifyShadowingVoice() {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) return;
    const rec = new SpeechAPI();
    rec.lang = 'en-US';
    rec.onresult = () => {
        document.getElementById('shadow-result').innerHTML = '<span class="text-emerald-700 font-extrabold">🌟 Lesson completed! Next lesson unlocked.</span>';
        const isInter = appState.currentMode === 'intermediate';
        if (isInter) appState.intermediateLesson++;
        else appState.beginnerLesson++;
        appState.unlockedSteps = { speaking: true, flashcards: false, grammar: false, listening: false, shadowing: false };
        saveState();
        setTimeout(() => loadCurrentLesson(), 1500);
    };
    rec.start();
}

function openVocabularyVault() {
    const container = document.getElementById('vault-list-container');
    container.innerHTML = '';
    if (appState.learnedFlashcards.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-xs text-slate-500 font-semibold">Bóveda vacía. Completa la Fase 2.</div>`;
    } else {
        appState.learnedFlashcards.forEach(item => {
            container.innerHTML += `
                <div class="bg-purple-50/60 border border-purple-100 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner">${item.emoji || '📖'}</div>
                        <div>
                            <h4 class="text-xs sm:text-sm font-extrabold text-slate-900">${item.term} (${item.def})</h4>
                            <p class="text-[11px] text-purple-700 font-extrabold">${item.es || ''}</p>
                        </div>
                    </div>
                    <button onclick="speakSpecificTextCustom('${item.term}')" class="bg-white text-purple-700 border border-purple-200 px-3 py-1 rounded-xl text-xs font-extrabold">🔊</button>
                </div>
            `;
        });
    }
    document.getElementById('vocabulary-vault-modal').classList.remove('hidden');
}

// ARRANQUE LIMPIO
const setupContainer = document.getElementById('welcome-setup-container');
if (!appState.hasStarted) {
    if (setupContainer) setupContainer.classList.remove('hidden');
} else {
    if (setupContainer) setupContainer.classList.add('hidden');
    loadCurrentLesson();
    updateUIStats();
}