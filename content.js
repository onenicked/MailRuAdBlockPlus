const adKeywords = ["рекл", "спонсор", "реклама"];

function isAdElement(el) {
    if (!el || !el.textContent) return false;

    const text = el.textContent.toLowerCase();

    return adKeywords.some(keyword => text.includes(keyword));
}

function removeAds(root = document) {
    const candidates = root.querySelectorAll('div[class*="sc-"], div[class*="banner"], div[class*="promo"]');

    candidates.forEach(el => {
        if (isAdElement(el)) {
            console.log("Удалён рекламный блок:", el);
            el.remove();
        }
    });
}

const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
                removeAds(node);
            }
        }
    }
});

window.addEventListener("load", () => {
    removeAds();

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
