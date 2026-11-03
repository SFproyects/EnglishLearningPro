// ==========================================
// 1. INICIALIZACIÓN Y ESTADO DE LA APLICACIÓN
// ==========================================

// Inicializar iconos de Lucide
lucide.createIcons();

// Cargar el estado guardado en el navegador (localStorage) o usar valores por defecto
let appState = JSON.parse(localStorage.getItem('english_pro_ultimate_state')) || {
    userName: '',
    streak: 1,
    currentMode: 'intermediate', // Nivel seleccionado por defecto
    beginnerLesson: 1,
    intermediateLesson: 1,
    unlockedSteps: { speaking: true, flashcards: false, grammar: false, listening: false, shadowing: false },
    quizScores: [],
    learnedFlashcards: [],
    hasStarted: false // Indica si ya pasó la pantalla de bienvenida/configuración
};


// ==========================================
// 2. CURRICULUM DE LECCIONES (BEGINNER E INTERMEDIO)
// ==========================================

const curriculumBeginner = [];
for (let i = 1; i <= 40; i++) {
    let blockNum = Math.ceil(i / 10);
    let themeName = `Beginner Foundation Topic ${i}`;
    
    let words = [
        {w:"Hello",d:"Hola",e:"👋"}, {w:"Family",d:"Familia",e:"👨‍👩‍👧‍👦"}, 
        {w:"Water",d:"Agua",e:"💧"}, {w:"House",d:"Casa",e:"🏠"}
    ];

    curriculumBeginner.push({
        id: i,
        block: blockNum,
        theme: themeName,
        grammarTitle: "Beginner Essential Grammar",
        roleplay: {
            title: `Beginner Lesson ${i}: ${themeName}`,
            turns: 4,
            introLine: "Hello! How are you today? Let's practice simple English.",
            gSlang1: "I am fine, thank you.", gSlang1Es: "Estoy bien, gracias.",
            gSlang2: "Nice to meet you.", gSlang2Es: "Mucho gusto.",
            fForm1: "Have a good day.", fForm1Es: "Que tengas un buen día.",
            fForm2: "Goodbye, see you.", fForm2Es: "Adiós, nos vemos.",
            fSlang1: "See you later!", fSlang1Es: "¡Hasta luego!",
            fSlang2: "Take care!", fSlang2Es: "¡Cuídate!"
        },
        flashcards: words.map((w) => ({ term: w.w, def: w.d, es: w.e, emoji: w.e })),
        quizzes: [
            { id: `b_l${i}_q1`, type: 'mc', title: `Grammar (Block ${blockNum})`, desc: "She ___ to the store every morning.", options: [{text: 'A) goes', correct: true}, {text: 'B) go', correct: false}], correction: "Con la tercera persona singular (She) se usa 'goes'." },
            { id: `b_l${i}_q2`, type: 'repair', title: 'Essential Vocabulary', desc: `Type in English for '${words[0].d}':`, answer: words[0].w.toLowerCase(), correction: `Se escribe '${words[0].w}'.` }
        ],
        listening: `I am learning basic English sentences every single day`,
        shadow: "Hello! I am learning English."
    });
}

const curriculumIntermediate = [];
for (let i = 1; i <= 40; i++) {
    let blockNum = Math.ceil(i / 10);
    let themeName = `B1 Professional Topic ${i}`;
    
    let words = [
        {w:"Improvement",d:"Mejora",e:"📈"}, {w:"Strategy",d:"Estrategia",e:"🎯"}, 
        {w:"Challenge",d:"Desafío",e:"⚡"}, {w:"Achievement",d:"Logro",e:"🏆"}
    ];

    curriculumIntermediate.push({
        id: i,
        block: blockNum,
        theme: themeName,
        grammarTitle: "B1 Mastery Core Workflow",
        roleplay: {
            title: `Intermediate Lesson ${i}: ${themeName}`,
            turns: 4,
            introLine: "Hey Kevin! What's up man? Just grabbing a quick coffee. How's it going with your projects?",
            gSlang1: "Pretty good, working on my game development.", gSlang1Es: "Bastante bien, trabajando en mi desarrollo de videojuegos.",
            gSlang2: "Not much, just optimizing the system workflow.", gSlang2Es: "Nada en especial, solo optimizando el flujo del sistema.",
            fForm1: "Thank you for your valuable time.", fForm1Es: "Gracias por su valioso tiempo.",
            fForm2: "It was a highly productive meeting.", fForm2Es: "Fue una reunión altamente productiva.",
            fSlang1: "Catch you later! Keep in touch.", fSlang1Es: "¡Nos vemos luego! Seguimos en contacto.",
            fSlang2: "Alright, I'm heading out. Take care!", fSlang2Es: "Bien, ya me voy. ¡Cuídate!"
        },
        flashcards: words.map((w) => ({ term: w.w, def: w.d, es: w.e, emoji: w.e })),
        quizzes: [
            { id: `i_l${i}_q1`, type: 'mc', title: `Grammar (Block ${blockNum})`, desc: "We ___ our best to optimize the system every single day.", options: [{text: 'A) do', correct: true}, {text: 'B) does', correct: false}], correction: "Con el pronombre 'We' siempre se utiliza 'do'." },
            { id: `i_l${i}_q2`, type: 'repair', title: 'Essential Vocabulary', desc: `Type in English for '${words[0].d}':`, answer: words[0].w.toLowerCase(), correction: `Se escribe '${words[0].w}'.` }
        ],
        listening: `We are successfully mastering advanced English expressions today`,
        shadow: "Hey! I am Kevin, great to meet you."
    });
}


// ==========================================
// 3. VARIABLES DE CONTROL DE SESIÓN
// ==========================================

let currentCard = 0;
let currentQuizIndex = 0;
let activeQuizItem = null;
let currentListeningTarget = "";
let activeQuizzes = [];
let activeFlashcards = [];
let currentRoleplayData = null;
let roleplayInteractionCount = 0;
let requiredRoleplayTurns = 4;
let selectedSetupMode = 'intermediate'; // Modo seleccionado en la bienvenida


// ==========================================
// 4. FUNCIONES DE UTILIDAD Y PERSISTENCIA
// ==========================================

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
    
    document.getElementById('current-block-label').innerText = isInter ? 'Nivel: Intermedio B1 Mastery' : 'Nivel: Beginner Progressive';
    document.getElementById('header-badge').innerText = `Lesson ${currLesson} / 40`;
    document.getElementById('course-subtitle').innerText = isInter ? 'Intermediate B1 Mastery & Professional Edge' : 'Progressive Beginner Course (Foundation)';
    document.getElementById('welcome-title').innerText = `Welcome back, ${appState.userName || 'Kevin'}!`;
    updateStepsUI();
}

function updateStepsUI() {
    let unlockedCount = Object.values(appState.unlockedSteps).filter(Boolean).length;
    document.getElementById('session-progress-text').innerText = `Phase ${unlockedCount} / 5`;
    document.getElementById('session-bar').style.width = `${(unlockedCount / 5) * 100}%`;
}

function unlockNextStep(currentStepKey, nextStepKey) {
    appState.unlockedSteps[nextStepKey] = true;
    saveState();
    updateStepsUI();
    switchTab(nextStepKey);
}

function switchTab(tabName) {
    if (!appState.unlockedSteps[tabName]) {
        showCustomModal("Phase Locked 🔒", "Complete the previous phase first.", "⚠️");
        return;
    }
    document.querySelectorAll('#lesson-view-container > div').forEach(el => el.classList.add('hidden'));
    document.getElementById('content-' + tabName).classList.remove('hidden');
}


// ==========================================
// 5. CONFIGURACIÓN INICIAL Y MODAL DE ACCESO
// ==========================================

function setInitialMode(mode) {
    selectedSetupMode = mode;
    const btnBeg = document.getElementById('btn-mode-beginner');
    const btnInt = document.getElementById('btn-mode-intermediate');
    const passContainer = document.getElementById('password-container');
    
    if (!btnBeg || !btnInt) return;

    if (mode === 'beginner') {
        btnBeg.className = "p-3 rounded-2xl border-2 border-sky-500 bg-sky-50 text-xs font-extrabold text-sky-800 transition cursor-pointer shadow-sm";
        btnInt.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 transition cursor-pointer hover:border-emerald-400";
        if (passContainer) passContainer.classList.add('hidden'); // Ocultar contraseña en beginner
    } else {
        btnInt.className = "p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-xs font-extrabold text-emerald-800 transition cursor-pointer shadow-sm";
        btnBeg.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 transition cursor-pointer hover:border-sky-400";
        if (passContainer) passContainer.classList.remove('hidden'); // Mostrar contraseña en intermedio
    }
}

function completeSetupAndStart() {
    const nameInput = document.getElementById('setup-name-input');
    const userName = nameInput ? nameInput.value.trim() : '';

    // Validar nombre obligatorio
    if (!userName) {
        showCustomModal("Nombre Requerido ⚠️", "Por favor, escribe tu nombre para continuar.", "✍️");
        return;
    }

    // Validaciones estrictas según el nivel
    if (selectedSetupMode === 'intermediate') {
        const passInput = document.getElementById('setup-password-input');
        const passwordValue = passInput ? passInput.value.trim() : '';
        
        if (passwordValue !== 'b1pro') {
            showCustomModal("Acceso Denegado 🔒", "La contraseña introducida es incorrecta. Acceso restringido.", "⚠️");
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


// ==========================================
// 6. CARGA Y LÓGICA DE LECCIONES Y FASES
// ==========================================

function loadCurrentLesson() {
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    
    let activeCurriculum = isInter ? curriculumIntermediate : curriculumBeginner;
    let lessonIndex = (currLesson - 1) % activeCurriculum.length;
    let lessonData = activeCurriculum[lessonIndex];

    currentRoleplayData = lessonData.roleplay;
    currentListeningTarget = lessonData.listening;
    roleplayInteractionCount = 0;
    requiredRoleplayTurns = 4;

    document.getElementById('roleplay-scenario-tag').innerText = `Lesson ${currLesson}: ${lessonData.theme}`;
    document.getElementById('shadow-text').innerText = `"${lessonData.shadow}"`;
    document.getElementById('flashcard-phase-title').innerText = `Phase 2: Vocabulary Mastery (Lesson ${currLesson})`;
    document.getElementById('roleplay-counter-label').innerText = `Turns: 0 / 4 completed`;

    activeFlashcards = lessonData.flashcards;
    activeQuizzes = lessonData.quizzes;

    const chatBox = document.getElementById('chat-messages-container');
    chatBox.innerHTML = `
        <div class="flex items-start gap-2.5">
            <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">🤖</div>
            <div class="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm text-xs text-slate-800 max-w-[85%]">
                <p class="font-extrabold text-sky-700 mb-0.5">Tutor (Nativo):</p>
                <p class="font-medium">${currentRoleplayData.introLine}</p>
            </div>
        </div>
    `;

    currentCard = 0;
    currentQuizIndex = 0;
    updateCard();
    loadQuizQuestion();
    switchTab('speaking');
}

function sendRoleplayMessage() {
    const input = document.getElementById('roleplay-user-input');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('chat-messages-container');
    const wordCount = text.split(/\s+/).length;
    const hasValidContext = wordCount >= 2;

    if (!hasValidContext) {
        chatBox.innerHTML += `
            <div class="flex items-start gap-2.5 justify-end">
                <div class="bg-rose-500 text-white p-3.5 rounded-2xl shadow-sm text-xs max-w-[85%]">
                    <p class="font-extrabold text-rose-100 mb-0.5">Tú (${appState.userName || 'Kevin'}):</p>
                    <p class="font-medium">${text}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">⚠️</div>
            </div>
            <div class="flex items-start gap-2.5">
                <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">🤖</div>
                <div class="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl shadow-sm text-xs text-amber-900 max-w-[85%]">
                    <p class="font-extrabold mb-0.5">Tutor:</p>
                    <p class="font-medium">⚠️ ¡Escribe al menos 2 palabras en inglés!</p>
                </div>
            </div>
        `;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    chatBox.innerHTML += `
        <div class="flex items-start gap-2.5 justify-end">
            <div class="bg-emerald-500 text-white p-3.5 rounded-2xl shadow-sm text-xs max-w-[85%]">
                <p class="font-extrabold text-emerald-100 mb-0.5">Tú (${appState.userName || 'Kevin'}):</p>
                <p class="font-medium">${text}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">😎</div>
        </div>
    `;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        let lowerText = text.toLowerCase();
        let correctionNotice = "";

        if (lowerText.includes("goof")) {
            correctionNotice = "💡 <strong>Corrección rápida:</strong> Escribiste <em>'goof'</em>. Para decir bien se escribe <strong>'good'</strong>.<br><br>";
        } else {
            roleplayInteractionCount++;
            document.getElementById('roleplay-counter-label').innerText = `Turns: ${roleplayInteractionCount} / 4 completed`;
        }

        let tutorReply = "";
        if (correctionNotice !== "") {
            tutorReply = correctionNotice + "Vuelve a enviar tu respuesta corregida.";
        } else if (roleplayInteractionCount === 1) {
            tutorReply = `Oh, nice! Pretty good here too, man. Hey, I gotta run soon. Catch you later!`;
        } else if (roleplayInteractionCount === 2) {
            tutorReply = `Sounds good! Take care, see you around!`;
        } else if (roleplayInteractionCount === 3) {
            tutorReply = `Alright man, have a great rest of your day!`;
        } else {
            tutorReply = `¡Excelente práctica nativa! Completaste los 4 turnos. Haz clic en 'Validate Roleplay & Proceed'.`;
        }

        chatBox.innerHTML += `
            <div class="flex items-start gap-2.5">
                <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">🤖</div>
                <div class="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm text-xs text-slate-800 max-w-[85%]">
                    <p class="font-extrabold text-sky-700 mb-0.5">Tutor (Nativo):</p>
                    <p class="font-medium">${tutorReply}</p>
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

function completeRoleplayPhase() {
    if (roleplayInteractionCount < 4) {
        showCustomModal("Incomplete Conversation ⚠️", `Completa los 4 turnos de charla conversacional primero (llevas ${roleplayInteractionCount}).`, "💬");
        return;
    }

    showCustomModal("Roleplay Approved! 🌟", "Tutor: ¡Excelente fluidez nativa! Pasamos a la Bóveda de Vocabulario.", "💬");
    setTimeout(() => {
        closeModal();
        unlockNextStep('speaking', 'flashcards');
    }, 1200);
}

function speakSpecificTextCustom(text) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

let activeRecognition = null;
function toggleSpeechRecognition() {
    const statusText = document.getElementById('mic-status-text');
    const input = document.getElementById('roleplay-user-input');
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        showCustomModal("Notice", "Speech recognition not supported in this browser.", "🎙️");
        return;
    }
    try {
        if (activeRecognition) { activeRecognition.stop(); activeRecognition = null; statusText.innerText = 'Mic'; return; }
        activeRecognition = new SpeechRecognitionAPI();
        activeRecognition.lang = 'en-US';
        activeRecognition.onstart = () => { statusText.innerText = 'Listening...'; };
        activeRecognition.onresult = (event) => {
            input.value = event.results[0][0].transcript;
            statusText.innerText = 'Mic';
            activeRecognition = null;
            sendRoleplayMessage();
        };
        activeRecognition.onerror = () => { statusText.innerText = 'Mic'; activeRecognition = null; };
        activeRecognition.onend = () => { statusText.innerText = 'Mic'; activeRecognition = null; };
        activeRecognition.start();
    } catch (err) { statusText.innerText = 'Mic'; activeRecognition = null; }
}

function updateCard() {
    if (activeFlashcards.length === 0) return;
    const card = activeFlashcards[currentCard];
    document.getElementById('flash-badge').innerText = `Word #${currentCard + 1} de 4`;
    document.getElementById('flashcard-counter-label').innerText = `Reviewing vocabulary (${currentCard + 1} de 4)...`;
    document.getElementById('flash-term').innerText = card.term;
    document.getElementById('flash-def').innerText = card.def;
    document.getElementById('flash-es').innerText = card.es;
    document.getElementById('flash-img').innerText = card.emoji || "📚";
}

function nextCard() {
    currentCard++;
    if (currentCard >= activeFlashcards.length) {
        activeFlashcards.forEach(card => {
            let entryObj = { term: card.term, def: card.def, es: card.es, emoji: card.emoji || "📖" };
            if (!appState.learnedFlashcards.some(item => item.term === entryObj.term)) {
                appState.learnedFlashcards.push(entryObj);
            }
        });
        saveState();
        showCustomModal("Vocabulary Approved 🌟", "Words saved to your Vault! Moving to Grammar Check.", "📚");
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
    
    const optionsContainer = document.getElementById('quiz-options');
    const errorContainer = document.getElementById('error-repair-container');
    const feedbackBox = document.getElementById('quiz-instant-feedback');
    
    optionsContainer.innerHTML = '';
    feedbackBox.classList.add('hidden');
    document.getElementById('error-input').value = '';

    if (activeQuizItem.type === "repair") {
        optionsContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
    } else {
        errorContainer.classList.add('hidden');
        optionsContainer.classList.remove('hidden');
        activeQuizItem.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-800 transition cursor-pointer font-bold shadow-sm";
            btn.innerText = opt.text;
            btn.onclick = () => processQuizAnswer(opt.correct);
            optionsContainer.appendChild(btn);
        });
    }
}

function submitErrorCorrection() {
    const userVal = document.getElementById('error-input').value.trim().toLowerCase();
    const expected = activeQuizItem.answer.toLowerCase();
    const isCorrect = userVal.includes(expected) || expected.includes(userVal);
    processQuizAnswer(isCorrect);
}

function processQuizAnswer(isCorrect) {
    const feedbackBox = document.getElementById('quiz-instant-feedback