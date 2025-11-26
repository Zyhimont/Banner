const SUPPORTED_LANGS = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    ja: 'ja',
    pt: 'pt'
};

export const PRICES = {
    yearly: "$39.99",
    weekly: "$6.99",
    weeklyCalculated: "$0.48"
};

export function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && SUPPORTED_LANGS[urlLang]) {
        return urlLang;
    }

    const systemLang = navigator.language.slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS[systemLang]) {
        return systemLang;
    }

    return SUPPORTED_LANGS.en;
}

export async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);

        if (!response.ok) {
            throw new Error(`Error loading translations: ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        if (lang !== SUPPORTED_LANGS.en) {
            return loadTranslations(SUPPORTED_LANGS.en);
        }

        return null;
    }
}

export function replacePlaceholders(translationStr, replacementValues) {
    let resultStr = translationStr;

    for (const key in replacementValues) {
        resultStr = resultStr.replace(new RegExp(`{{${key}}}`, 'g'), replacementValues[key]);
    }

    return resultStr;
}