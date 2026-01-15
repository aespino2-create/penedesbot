document.addEventListener('DOMContentLoaded', () => {
    // Inicialitzacions en carregar la pàgina
    initGrid5x5();
    initMobilePattern3x3();
    goToPage(1); // Comença sempre a la pàgina 1
});

// ==========================================
// SISTEMA DE NAVEGACIÓ CENTRALITZAT
// ==========================================
function goToPage(pageNumber) {
    // 1. Ocultar totes les pàgines
    for (let i = 1; i <= 9; i++) {
        const page = document.getElementById(`page${i}`);
        if (page) page.classList.add('hidden');
    }

    // 2. Mostrar la pàgina objectiu
    const targetPage = document.getElementById(`page${pageNumber}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        // Scroll cap amunt per si la pàgina anterior era llarga
        window.scrollTo(0, 0);
    }

    // 3. Netejar missatges d'error i inputs antics quan es canvia de pàgina
    resetFormsAndMessages(pageNumber);
}

function resetFormsAndMessages(currentPage) {
    const messages = ['msgPuzzle1', 'msgPuzzle2', 'msgPuzzle3', 'msgPuzzle4'];
    messages.forEach(id => { 
        const el = document.getElementById(id);
        if(el) { el.textContent = ''; el.style.color = 'inherit'; }
    });

    // Netejar inputs específics segons on anem
    if (currentPage === 2) document.getElementById('puzzle1Code').value = '';
    if (currentPage === 4) resetGrid5x5();
    if (currentPage === 6) document.getElementById('puzzle3Word').value = '';
    if (currentPage === 8) resetMobilePattern();
}


// ==========================================
// LÒGICA PUZLE 1: Codi Numèric (Pàgina 2)
// ==========================================
function checkPuzzle1() {
    const codeInput = document.getElementById('puzzle1Code');
    const msg = document.getElementById('msgPuzzle1');
    
    if (codeInput.value === '5555') {
        msg.textContent = 'Correcte! Accedint...';
        msg.style.color = 'green';
        setTimeout(() => goToPage(3), 800);
    } else {
        msg.textContent = 'Codi incorrecte. Torna-ho a provar.';
        msg.style.color = 'red';
        codeInput.value = '';
    }
}


// ==========================================
// LÒGICA PUZLE 2: Graella 5x5 (Pàgina 4)
// ==========================================
function initGrid5x5() {
    const grid = document.getElementById('patternGrid5x5');
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell-5x5');
        cell.dataset.index = i;
        cell.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
        grid.appendChild(cell);
    }
}

function resetGrid5x5() {
    document.querySelectorAll('.cell-5x5').forEach(c => c.classList.remove('selected'));
}

function checkPuzzle2() {
    const cells = document.querySelectorAll('.cell-5x5');
    const msg = document.getElementById('msgPuzzle2');
    let isCorrect = true;
    // L'índex correcte és: Primera fila (fila 0), segona columna (col 1).
    // En una graella plana de 0 a 24, això és l'índex 1.
    const correctIndex = 1; 

    cells.forEach((cell, index) => {
        const isSelected = cell.classList.contains('selected');
        if (index === correctIndex) {
            if (!isSelected) isCorrect = false; // Ha d'estar marcat
        } else {
            if (isSelected) isCorrect = false; // No ha d'estar marcat
        }
    });

    if (isCorrect) {
        msg.textContent = 'Patró correcte! Accedint...';
        msg.style.color = 'green';
        setTimeout(() => goToPage(5), 800);
    } else {
        msg.textContent = 'Patró incorrecte. Revisa la pista.';
        msg.style.color = 'red';
    }
}


// ==========================================
// LÒGICA PUZLE 3: Paraula "robots" (Pàgina 6)
// ==========================================
function checkPuzzle3() {
    const wordInput = document.getElementById('puzzle3Word');
    const msg = document.getElementById('msgPuzzle3');
    
    // Convertim a minúscules per fer-ho més fàcil
    if (wordInput.value.toLowerCase() === 'robots') {
        msg.textContent = 'Paraula correcta! Accedint...';
        msg.style.color = 'green';
        setTimeout(() => goToPage(7), 800);
    } else {
        msg.textContent = 'Paraula incorrecta.';
        msg.style.color = 'red';
        wordInput.value = '';
    }
}


// ==========================================
// LÒGICA PUZLE 4: Patró Mòbil 'M' (Pàgina 8)
// ==========================================
let isDrawing = false;
let patternSequence = [];

function initMobilePattern3x3() {
    const grid = document.getElementById('pattern3x3');
    // IDs per als punts com un teclat numèric:
    // 1 2 3
    // 4 5 6
    // 7 8 9
    const dotIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    dotIds.forEach(id => {
        const dot = document.createElement('div');
        dot.classList.add('dot-3x3');
        dot.dataset.id = id;
        
        // Esdeveniments per a ratolí i tàctil
        dot.addEventListener('mousedown', startPattern);
        dot.addEventListener('touchstart', startPattern, {passive: false});
        dot.addEventListener('mouseover', trackPattern);
        // Per a tàctil, necessitem un tractament especial ja que no hi ha 'mouseover' equivalent directe
        dot.addEventListener('touchmove', handleTouchMove, {passive: false});

        grid.appendChild(dot);
    });

    document.addEventListener('mouseup', endPattern);
    document.addEventListener('touchend', endPattern);
}

function startPattern(e) {
    e.preventDefault(); // Evita scroll en mòbils
    isDrawing = true;
    patternSequence = [];
    resetMobilePatternVisuals();
    addToSequence(e.target);
}

function trackPattern(e) {
    if (!isDrawing) return;
    addToSequence(e.target);
}

// Gestió especial per al moviment tàctil
function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    // Busca quin element hi ha sota el dit
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementUnderTouch && elementUnderTouch.classList.contains('dot-3x3')) {
        addToSequence(elementUnderTouch);
    }
}

function addToSequence(dotElement) {
    const id = parseInt(dotElement.dataset.id);
    // Només afegim si no és l'últim punt afegit (evita duplicats seguits)
    if (patternSequence[patternSequence.length - 1] !== id) {
        patternSequence.push(id);
        dotElement.classList.add('active');
    }
}

function endPattern() {
    if (!isDrawing) return;
    isDrawing = false;
    checkMobileSolution();
}

function checkMobileSolution() {
    const msg = document.getElementById('msgPuzzle4');
    // Definició de la 'M': Comença a baix esquerra (7) -> dalt esquerra (1) -> centre (5) -> dalt dreta (3) -> baix dreta (9)
    // Seqüència: [7, 1, 5, 3, 9]
    // També acceptem la 'M' dibuixada a la inversa: [9, 3, 5, 1, 7]
    const seqString = patternSequence.join(',');

    if (seqString === '7,1,5,3,9' || seqString === '9,3,5,1,7') {
        msg.textContent = 'Patró M correcte! Felicitats!';
        msg.style.color = 'green';
        // Marcar tots els punts com a correctes visualment
        document.querySelectorAll('.dot-3x3.active').forEach(d => d.style.backgroundColor = '#28a745');
        setTimeout(() => goToPage(9), 1000);
    } else {
        msg.textContent = 'Patró incorrecte. Intenta fer una "M".';
        msg.style.color = 'red';
        // Error visual
        document.querySelectorAll('.dot-3x3.active').forEach(d => d.style.backgroundColor = '#dc3545');
        setTimeout(resetMobilePattern, 1000); // Reinicia automàticament després d'un segon
    }
}

function resetMobilePattern() {
    isDrawing = false;
    patternSequence = [];
    resetMobilePatternVisuals();
    document.getElementById('msgPuzzle4').textContent = '';
}

function resetMobilePatternVisuals() {
    document.querySelectorAll('.dot-3x3').forEach(dot => {
        dot.classList.remove('active');
        dot.style.backgroundColor = ''; // Neteja colors inline d'èxit/error
    });
}
