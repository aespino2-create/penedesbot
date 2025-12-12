document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Inicialitzar la graella del patró quan la pàgina 2 es carrega
    generatePatternGrid();
});

// Funció general per canviar de pàgina
function goToPage(pageNumber) {
    // Oculta totes les pàgines
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Mostra la pàgina sol·licitada
    const targetPage = document.getElementById(`page${pageNumber}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    // Reinicia els missatges
    document.getElementById('codeMessage').textContent = '';
    document.getElementById('patternMessage').textContent = '';

    // Si tornem a la pàgina 1, netejar l'input de codi
    if (pageNumber === 1) {
        document.getElementById('accessCode').value = '';
    }

    // Si anem a la pàgina 2, reinicia el patró
    if (pageNumber === 2) {
        resetPatternGrid();
    }
}

// ----------------------------------------------------
// LÒGICA DE LA PÀGINA 1: Codi de 4 xifres (1234)
// ----------------------------------------------------

function checkCode() {
    const correctCode = '1234';
    const inputElement = document.getElementById('accessCode');
    const messageElement = document.getElementById('codeMessage');
    const inputCode = inputElement.value;

    if (inputCode === correctCode) {
        messageElement.textContent = 'Codi correcte! Accedint a Pàgina 2...';
        messageElement.style.color = 'green';
        setTimeout(() => {
            goToPage(2);
        }, 800);
    } else {
        messageElement.textContent = 'Codi incorrecte. Torna a intentar.';
        messageElement.style.color = 'red';
        inputElement.value = ''; // Neteja l'input
    }
}

// ----------------------------------------------------
// LÒGICA DE LA PÀGINA 2: Patró 5x5
// ----------------------------------------------------

// Genera el marc de 5x5 amb cel·les interactives
function generatePatternGrid() {
    const grid = document.getElementById('patternGrid');
    const gridSize = 5;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        // Emmagatzema la posició de la columna (0-4)
        const col = i % gridSize; 
        cell.dataset.col = col; 
        
        // Afegeix l'esdeveniment de clic
        cell.addEventListener('click', function() {
            this.classList.toggle('selected');
        });

        grid.appendChild(cell);
    }
}

// Reinicia l'estat del patró (totes les cel·les sense seleccionar)
function resetPatternGrid() {
    document.querySelectorAll('#patternGrid .cell').forEach(cell => {
        cell.classList.remove('selected');
    });
}

// Comprova si el patró seleccionat és correcte
function checkPattern() {
    const cells = document.querySelectorAll('#patternGrid .cell');
    const gridSize = 5;
    let isCorrect = true;
    const messageElement = document.getElementById('patternMessage');

    // El patró correcte és seleccionar TOTA la columna 0 (la més a l'esquerra)
    cells.forEach(cell => {
        const col = parseInt(cell.dataset.col);
        const isSelected = cell.classList.contains('selected');

        if (col === 0) {
            // Les cel·les de la primera columna HAN d'estar seleccionades
            if (!isSelected) {
                isCorrect = false;
            }
        } else {
            // Les cel·les de les altres columnes NO HAN d'estar seleccionades
            if (isSelected) {
                isCorrect = false;
            }
        }
    });

    if (isCorrect) {
        messageElement.textContent = 'Patró correcte! Accedint a Pàgina 3...';
        messageElement.style.color = 'green';
        setTimeout(() => {
            goToPage(3);
        }, 800);
    } else {
        messageElement.textContent = 'Patró incorrecte. Assegura\'t de marcar NOMÉS la columna de l\'esquerra.';
        messageElement.style.color = 'red';
        // Opcional: restablir la graella després d'un error
        // setTimeout(resetPatternGrid, 2000); 
    }
}

// Inici: Assegura't que l'aplicació comença a la Pàgina 1
goToPage(1);
