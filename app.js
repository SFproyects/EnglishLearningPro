// ==========================================
// 1. INICIALIZACIÓN Y ESTADO DE LA APLICACIÓN
// ==========================================

// Inicializar iconos de Lucide
lucide.createIcons();

// Cargar el estado guardado en el navegador (localStorage) o usar valores por defecto
let appState = JSON.parse(localStorage.getItem('english_pro_ultimate_state')) || {
    userName: 'Kevin',
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
// 2. CURRICULUM DE LECCIONES (40 LECCIONES)
// ==========================================

const curriculum40 = [];
for (let i = 1; i <= 40; i++) {
    let blockNum = Math.ceil(i / 10);
    let themeName = `Lesson Topic ${i}`;
    
    let gSlang1 = "Hey! I'm Kevin, great to meet you.";
    let gSlang1Es = "¡Ey! Soy Kevin, qué gusto conocerte.";
    let gSlang2 = "What's up? I'm Kevin, let's chat!";
    let gSlang2Es = "¿Qué tal? Soy Kevin, ¡hablemos!";

    let fForm1 = "Thank you for your time. Have a wonderful day.";
    let fForm1Es = "Gracias por su tiempo. Que tenga un día maravilloso.";
    let fForm2 = "It was a productive conversation. Goodbye.";
    let fForm2Es = "Fue una conversación productiva. Adiós.";
    let fSlang1 = "Catch you later! See you around.";
    let fSlang1Es = "¡Nos vemos luego! Te veo por ahí.";
    let fSlang2 = "Alright, I'm heading out. Take care!";
    let fSlang2Es = "Bien, ya me voy. ¡Cuídate!";

    let tutorIntro = "Hey Kevin! What's up man? Just grabbing a quick coffee. How's it going with you?";

    if (i === 1) {
        themeName = "Professional Greetings & Introductions";
        tutorIntro = "Hey Kevin! What's up man? Just grabbing a quick coffee. How's it going with you?";
    }

    let words = [
        {w:"Greeting",d:"Saludo",e:"👋"}, {w:"Introduction",d:"Presentación",e:"🤝"}, 
        {w:"Price",d:"Precio",e:"💲"}, {w:"Discount",d:"Descuento",e:"🏷️"}
    ];

    curriculum40.push({
        id: i,
        block: blockNum,
        theme: themeName,
        grammarTitle: "B1 Mastery Core Workflow",
        roleplay: {
            title: `Lesson ${i}: ${themeName}`,
            turns: 4,
            introLine: tutorIntro,
            gSlang1: gSlang1, gSlang1Es: gSlang1Es,
            gSlang2: gSlang2, gSlang2Es: gSlang2Es,
            fForm1: fForm1, fForm1Es: fForm1Es,
            fForm2: fForm2, fForm2Es: fForm2Es,
            fSlang1: fSlang1, fSlang1Es: fSlang1Es,
            fSlang2: fSlang2, fSlang2Es: fSlang2Es
        },
        flashcards: words.map((w) => ({ term: w.w, def: w.d, es: w.e, emoji: w.e })),
        quizzes: [
            { id: `l${i}_q1`, type: 'mc', title: `Grammar (Block ${blockNum})`, desc: "We ___ our best to optimize the system every single day.", options: [{text: 'A) do', correct: true}, {text: 'B) does', correct: false}], correction: "Con el pronombre 'We' siempre se utiliza 'do'." },
            { id: `l${i}_q2`, type: 'repair', title: 'Essential Vocabulary', desc: `Type in English for '${words[0].d}':`, answer: words[0].w.toLowerCase(), correction: `Se escribe '${words[0].w}'.` }
        ],
        listening: `We are successfully mastering advanced English expressions today`,
        shadow: gSlang1
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

// Guardar estado actual en el almacenamiento local
function saveState() {
    localStorage.setItem('english_pro_ultimate_state', JSON.stringify(appState));
}

// Mostrar modal de alertas personalizado
function showCustomModal(title, message, icon = "✨") {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    document.getElementById('modal-icon').innerText = icon;
    document.getElementById('custom-modal').classList.remove('hidden');
}

// Cerrar modal de alertas
function closeModal() {
    document.getElementById('custom-modal').classList.add('hidden');
}

// Actualizar contadores y estadísticas en el Header
function updateUIStats() {
    document.getElementById('streak-count').innerText = appState.streak + 'd';
    document.getElementById('vocab-vault-count').innerText = appState.learnedFlashcards.length;
    
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    
    document.getElementById('current-block-label').innerText = isInter ? 'Nivel: Intermedio B1 Mastery' : 'Nivel: Beginner Progressive';
    document.getElementById('header-badge').innerText = `Lesson ${currLesson} / 40`;
    document.getElementById('course-subtitle').innerText = isInter ? 'Intermediate B1 Mastery & Professional Edge' : 'Progressive Beginner Course (A2+ to B1)';
    document.getElementById('welcome-title').innerText = `Welcome back, ${appState.userName || 'Kevin'}!`;
    updateStepsUI();
}

// Actualizar barra de progreso de las 5 fases
function updateStepsUI() {
    let unlockedCount = Object.values(appState.unlockedSteps).filter(Boolean).length;
    document.getElementById('session-progress-text').innerText = `Phase ${unlockedCount} / 5`;
    document.getElementById('session-bar').style.width = `${(unlockedCount / 5) * 100}%`;
}

// Desbloquear la siguiente fase de estudio
function unlockNextStep(currentStepKey, nextStepKey) {
    appState.unlockedSteps[nextStepKey] = true;
    saveState();
    updateStepsUI();
    switchTab(nextStepKey);
}

// Cambiar de pestaña/fase en la interfaz
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

// Seleccionar nivel en el modal de bienvenida y reordenar inputs dinámicamente
function setInitialMode(mode) {
    selectedSetupMode = mode;
    const btnBeg = document.getElementById('btn-mode-beginner');
    const btnInt = document.getElementById('btn-mode-intermediate');
    const passContainer = document.getElementById('password-container');
    const nameWrapper = document.getElementById('name-input-wrapper');
    const dynamicContainer = document.getElementById('dynamic-inputs-container');
    
    if (!btnBeg || !btnInt) return;

    if (mode === 'beginner') {
        btnBeg.className = "p-3 rounded-2xl border-2 border-sky-500 bg-sky-50 text-xs font-extrabold text-sky-800 transition cursor-pointer shadow-sm";
        btnInt.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 transition cursor-pointer hover:border-emerald-400";
        
        if (passContainer) passContainer.classList.add('hidden'); // Ocultar contraseña
        if (dynamicContainer && nameWrapper) {
            dynamicContainer.prepend(nameWrapper); // Poner nombre arriba si es beginner
        }
    } else {
        btnInt.className = "p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-xs font-extrabold text-emerald-800 transition cursor-pointer shadow-sm";
        btnBeg.className = "p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 transition cursor-pointer hover:border-sky-400";
        
        if (passContainer) passContainer.classList.remove('hidden'); // Mostrar contraseña
        if (dynamicContainer && nameWrapper) {
            dynamicContainer.appendChild(nameWrapper); // Mover el nombre ABAJO, justo encima de la contraseña
        }
    }
}

// Validar credenciales y arrancar la app sin congelarse
function completeSetupAndStart() {
    const nameInput = document.getElementById('setup-name-input');
    const userName = nameInput ? nameInput.value.trim() : '';

    if (!userName) {
        showCustomModal("Nombre Requerido ⚠️", "Por favor, escribe tu nombre para continuar.", "✍️");
        return;
    }
    appState.userName = userName;
    
    // Si selecciona Intermedio B1, validar la contraseña de forma privada
    if (selectedSetupMode === 'intermediate') {
        const passInput = document.getElementById('setup-password-input');
        if (!passInput || passInput.value.trim() !== 'kevin b1pro') {
            showCustomModal("Acceso Denegado 🔒", "La contraseña introducida es incorrecta. Acceso restringido.", "⚠️");
            return;
        }
    }

    appState.currentMode = selectedSetupMode;
    appState.hasStarted = true;
    saveState();

    // Ocultar el modal de forma inmediata y limpia
    const setupContainer = document.getElementById('welcome-setup-container');
    if (setupContainer) {
        setupContainer.classList.add('hidden');
    }
    
    // Cargar datos y lección sin bloqueos
    updateUIStats();
    loadCurrentLesson();
}
// ==========================================
// 6. CARGA Y LÓGICA DE LECCIONES Y FASES
// ==========================================

// Cargar la lección correspondiente al nivel actual
function loadCurrentLesson() {
    const isInter = appState.currentMode === 'intermediate';
    let currLesson = isInter ? appState.intermediateLesson : appState.beginnerLesson;
    let lessonIndex = (currLesson - 1) % curriculum40.length;
    let lessonData = curriculum40[lessonIndex];

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

// Enviar mensajes en la Fase 1 (Chat de Roleplay con Tutor Nativo)
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

// Validar que se completaron los 4 turnos de chat
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

// Reproductor de texto a voz (SpeechSynthesis)
function speakSpecificTextCustom(text) {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// Reconocimiento de voz por micrófono en el Chat
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

// Actualizar tarjeta actual en Fase 2 (Flashcards)
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

// Siguiente flashcard o pasar a Gramática
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

// Cargar pregunta de gramática (Fase 3)
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
    const feedbackBox = document.getElementById('quiz-instant-feedback');
    feedbackBox.classList.remove('hidden');
    appState.quizScores.push({ id: activeQuizItem.id, correct: isCorrect });

    if (isCorrect) {
        feedbackBox.className = "text-xs mt-3 p-4 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 font-extrabold shadow-sm";
        feedbackBox.innerHTML = `<div>Correct! 🌟</div><div class="text-[11px] font-medium mt-1">${activeQuizItem.correction}</div>`;
    } else {
        feedbackBox.className = "text-xs mt-3 p-4 rounded-xl bg-rose-100 text-rose-900 border border-rose-200 font-medium shadow-sm space-y-1";
        feedbackBox.innerHTML = `<div class="font-extrabold">❌ Incorrect.</div><div class="text-[11px]"><strong>Rule:</strong> ${activeQuizItem.correction}</div>`;
    }

    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < activeQuizzes.length) { loadQuizQuestion(); }
        else { unlockNextStep('grammar', 'listening'); }
    }, 2500);
}

// Reproducir audio nativo para dictado (Fase 4)
function playListeningAudio() {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentListeningTarget);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function checkListeningDictation() {
    const userText = document.getElementById('listening-input').value.trim().toLowerCase();
    if (userText.length > 3) {
        document.getElementById('listening-result').innerHTML = '<span class="text-emerald-700 font-extrabold">🎯 Dictation approved! Moving to Shadowing.</span>';
        setTimeout(() => unlockNextStep('listening', 'shadowing'), 1000);
    } else {
        document.getElementById('listening-result').innerHTML = '<span class="text-rose-600 font-bold">⚠️ Try again.</span>';
    }
}

// Reproducir audio de Shadowing (Fase 5)
function speakShadowText() {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(document.getElementById('shadow-text').innerText.replace(/"/g, ''));
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// Verificar pronunciación mediante micrófono para completar la lección
function verifyShadowingVoice() {
    const statusText = document.getElementById('shadow-mic-status');
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
        const rec = new SpeechRecognitionAPI();
        rec.lang = 'en-US';
        rec.onstart = () => { statusText.innerText = 'Listening...'; };
        rec.onresult = () => {
            statusText.innerText = 'Record with Mic 🎙️';
            document.getElementById('shadow-result').innerHTML = '<span class="text-emerald-700 font-extrabold">🌟 Pronunciation approved! Lesson completed.</span>';
            
            const isInter = appState.currentMode === 'intermediate';
            if (isInter) {
                if (appState.intermediateLesson < 40) appState.intermediateLesson += 1;
            } else {
                if (appState.beginnerLesson < 40) appState.beginnerLesson += 1;
            }

            appState.unlockedSteps = { speaking: true, flashcards: false, grammar: false, listening: false, shadowing: false };
            saveState();
            setTimeout(() => loadCurrentLesson(), 1500);
        };
        rec.start();
    } catch (err) { statusText.innerText = 'Record with Mic 🎙️'; }
}

// Abrir modal de Bóveda de Vocabulario guardado
function openVocabularyVault() {
    const container = document.getElementById('vault-list-container');
    container.innerHTML = '';
    
    if (appState.learnedFlashcards && appState.learnedFlashcards.length > 0) {
        appState.learnedFlashcards = appState.learnedFlashcards.map(item => {
            if (typeof item === 'object' && item.term) {
                let cleanEmoji = "📖";
                let t = item.term.toLowerCase();
                if (t.includes('greet')) cleanEmoji = "👋";
                else if (t.includes('intro')) cleanEmoji = "🤝";
                else if (t.includes('price')) cleanEmoji = "💲";
                else if (t.includes('disc')) cleanEmoji = "🏷️";
                return { term: item.term, def: item.def || 'Vocabulario', es: item.es || '', emoji: cleanEmoji };
            }
            return { term: "Vocabulary", def: "Término guardado", es: "Recordatorio B1", emoji: "📖" };
        });
    }

    if (!appState.learnedFlashcards || appState.learnedFlashcards.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 space-y-2">
                <span class="text-4xl">📭</span>
                <p class="text-xs text-slate-500 font-semibold">Tu Bóveda está vacía aún. Completa la Fase 2.</p>
            </div>
        `;
    } else {
        appState.learnedFlashcards.forEach(item => {
            container.innerHTML += `
                <div class="bg-gradient-to-r from-purple-50/60 to-sky-50/60 border border-purple-100 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-11 h-11 bg-white rounded-2xl border border-purple-200 flex items-center justify-center text-xl shadow-inner flex-shrink-0">${item.emoji || '📖'}</div>
                        <div>
                            <h4 class="text-xs sm:text-sm font-extrabold text-slate-900">${item.term} <span class="text-slate-500 font-semibold">(${item.def})</span></h4>
                            <p class="text-[11px] text-purple-700 font-extrabold mt-0.5">${item.es || ''}</p>
                        </div>
                    </div>
                    <button onclick="speakSpecificTextCustom('${item.term}')" class="bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm cursor-pointer inline-flex items-center gap-1.5 transition flex-shrink-0">
                        🔊 Listen
                    </button>
                </div>
            `;
        });
    }
    document.getElementById('vocabulary-vault-modal').classList.remove('hidden');
}


// ==========================================
// 7. ARRANQUE AUTOMÁTICO AL CARGAR EL DOM
// ==========================================

const setupContainer = document.getElementById('welcome-setup-container');

if (!appState.hasStarted) {
    // Forzar la aparición del modal de configuración quitando la clase hidden
    if (setupContainer) {
        setupContainer.classList.remove('hidden');
    }
} else {
    // Si ya inició, ocultar el setup y cargar lección
    if (setupContainer) {
        setupContainer.classList.add('hidden');
    }
    loadCurrentLesson();
    updateUIStats();
}