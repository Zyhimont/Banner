import { getLanguage, loadTranslations, replacePlaceholders, PRICES } from './i18n.js';

function fitTextToContainer(element) {
    if (!element) {
        return;
    }

    // Reset the inline style to read the original CSS font size, 
    // ensuring we start the check from the correct base size.
    element.style.fontSize = '';
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const MIN_FONT_SIZE = 10;

    while (
        (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) &&
        fontSize > MIN_FONT_SIZE
    ) {
        fontSize--;
        element.style.fontSize = fontSize + 'px';
    }
}

async function initLocalization() {
    const currentLanguage = getLanguage();
    const translationDictionary = await loadTranslations(currentLanguage);

    if (!translationDictionary) {
        return;
    }

    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        let translationText = translationDictionary[key] || key;

        const priceType = el.getAttribute('data-price');
        if (priceType && PRICES[priceType]) {
            translationText = replacePlaceholders(translationText, { price: PRICES[priceType] });
        }

        el.innerHTML = translationText;
    });

    setTimeout(() => {
        fitTextToContainer(document.getElementById('txt-card1'));
        fitTextToContainer(document.getElementById('txt-card2'));
        fitTextToContainer(document.getElementById('txt-card3'));
        fitTextToContainer(document.getElementById('txt-yearly-sub'));
    }, 50);
}

const options = document.querySelectorAll('.option-row');
const continueBtn = document.getElementById('txt-continue');
let currentUrl = '#';

function updateLink() {
    const selected = document.querySelector('.option-row.selected');
    if (selected) {
        currentUrl = selected.getAttribute('data-href');
    }
}

function setupEventListeners() {
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            updateLink();
        });
    });

    continueBtn.addEventListener('click', () => {
        window.location.href = currentUrl;
    });

    window.addEventListener('resize', () => {
        setTimeout(() => {
            fitTextToContainer(document.getElementById('txt-card1'));
            fitTextToContainer(document.getElementById('txt-card2'));
            fitTextToContainer(document.getElementById('txt-card3'));
            fitTextToContainer(document.getElementById('txt-yearly-sub'));
        }, 50);
    });
}

window.addEventListener('load', () => {
    initLocalization();
    setupEventListeners();
    updateLink();
});