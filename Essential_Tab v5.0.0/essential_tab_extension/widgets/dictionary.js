// Dictionary Widget Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('dictOverlay');
    const dictInput = document.getElementById('dictInput');
    const dictSearchBtn = document.getElementById('dictSearchBtn');
    const dictContent = document.getElementById('dictContent');
    const dictVocabList = document.getElementById('dictVocabList');
    const closeBtn = document.getElementById('dictClose');
    const clearAllBtn = document.getElementById('dictClearAll');

    let vocabulary = [];
    const STORAGE_KEY = 'et_dictionary_vocab';

    // Local dictionary database - common words
    const DICTIONARY = {
        'focus': {
            phonetic: '/ˈfōkəs/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The center of interest or attention.',
                    'The point at which rays of light converge.'
                ],
                synonyms: ['concentration', 'center', 'centre', 'focal point']
            }, {
                type: 'verb',
                definitions: [
                    'Pay particular attention to.',
                    'Cause (rays or waves) to converge.'
                ],
                synonyms: ['concentrate', 'direct', 'aim']
            }]
        },
        'productivity': {
            phonetic: '/ˌpräəkˈdivədē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The state or quality of being productive.',
                    'The rate at which a worker, a company, or a country produces goods and services.'
                ],
                synonyms: ['output', 'yield', 'performance', 'efficiency']
            }]
        },
        'minimalism': {
            phonetic: '/ˈmin(ə)məˌlizəm/',
            parts: [{
                type: 'noun',
                definitions: [
                    'A style or technique characterized by extreme simplicity.',
                    'A movements in various forms of art and design.'
                ],
                synonyms: ['simplicity', 'plainness', 'spareness', 'minimalist approach']
            }]
        },
        'simplicity': {
            phonetic: '/simˈplisədē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The quality or condition of being easy to understand or do.',
                    'Lack of ornamentation or decoration.'
                ],
                synonyms: ['plainness', 'clarity', 'easiness', 'lessness']
            }]
        },
        'clarity': {
            phonetic: '/ˈklerədē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The quality of being clear and easy to understand.',
                    'The quality of being pure or transparent.'
                ],
                synonyms: ['clearness', 'lucidity', 'transparency', 'precision']
            }]
        },
        'efficiency': {
            phonetic: '/əˈfiSHənsē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The state or quality of achieving maximum productivity with minimum wasted effort.',
                    'The ratio of useful output to total input.'
                ],
                synonyms: ['productivity', 'effectiveness', 'competence', 'performance']
            }]
        },
        'creativity': {
            phonetic: '/ˌkrēāˈdivədē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The use of imagination or original ideas to create something.',
                    'Ingenuity or inventiveness.'
                ],
                synonyms: ['imagination', 'inventiveness', 'originality', 'ingenuity']
            }]
        },
        'habit': {
            phonetic: '/ˈhabət/',
            parts: [{
                type: 'noun',
                definitions: [
                    'A settled or regular tendency or practice.',
                    'An automatic response to a specific situation.'
                ],
                synonyms: ['custom', 'practice', 'routine', 'pattern']
            }]
        },
        'discipline': {
            phonetic: '/ˈdisəplən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The practice of training people to obey rules or a code of behavior.',
                    'Control gained by enforcing obedience or order.'
                ],
                synonyms: ['control', 'order', 'self-control', 'training']
            }, {
                type: 'verb',
                definitions: [
                    'Train (someone) to obey rules or a code of behavior.',
                    'Punish or rebuke.'
                ],
                synonyms: ['train', 'correct', 'chastise']
            }]
        },
        'motivation': {
            phonetic: '/ˌmōdəˈvāSHən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The reason or reasons one has for acting or behaving in a particular way.',
                    'The general desire or willingness of someone to do something.'
                ],
                synonyms: ['drive', 'incentive', 'inspiration', 'stimulus']
            }]
        },
        'consistency': {
            phonetic: '/kənˈsisənsē/',
            parts: [{
                type: 'noun',
                definitions: [
                    'Conformity in the application of something.',
                    'The quality of always behaving or performing in a similar way.'
                ],
                synonyms: ['steadiness', 'uniformity', 'constancy', 'stability']
            }]
        },
        'intention': {
            phonetic: '/inˈtenSHən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'A thing intended; an aim or plan.',
                    'The act or fact of intending.'
                ],
                synonyms: ['aim', 'purpose', 'goal', 'objective']
            }]
        },
        'iteration': {
            phonetic: '/ˌidəˈrāSHən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The process of repeating a process.',
                    'A repetition of a sequence of operations.'
                ],
                synonyms: ['repetition', 'recurrence', 'repetition', 'loop']
            }]
        },
        'optimization': {
            phonetic: '/ˌäptəməˈzāSHən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The action of making the best or most effective use of a situation or resource.'
                ],
                synonyms: ['improvement', 'enhancement', 'refinement', 'development']
            }]
        },
        'workflow': {
            phonetic: '/wərkˌflō/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The sequence of industrial, administrative, or other processes through which a piece of work passes.',
                    'The manner in which work progresses.'
                ],
                synonyms: ['procedure', 'process', 'operation', 'system']
            }]
        },
        'procrastination': {
            phonetic: '/prōˌkrastəˈnāSHən/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The action of delaying or postponing something.'
                ],
                synonyms: ['delay', 'postponement', 'deferral', 'hesitation']
            }]
        },
        'momentum': {
            phonetic: '/məˈmen(t)əm/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The quantity of motion of a moving body.',
                    'The impetus gained by a moving object.'
                ],
                synonyms: ['impetus', 'drive', 'impulse', 'force']
            }]
        },
        'perspective': {
            phonetic: '/pərˈspektiv/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The art of drawing solid objects on a two-dimensional surface.',
                    'A particular attitude toward or way of regarding something.'
                ],
                synonyms: ['viewpoint', 'outlook', 'angle', 'standpoint']
            }]
        },
        'gratitude': {
            phonetic: '/ˈɡradəˌt(y)o͞od/',
            parts: [{
                type: 'noun',
                definitions: [
                    'The quality of being thankful; readiness to show appreciation.'
                ],
                synonyms: ['thanks', 'appreciation', 'thankfulness', 'acknowledgment']
            }]
        },
        'mindfulness': {
            phonetic: '/ˈmīn(d)f(ə)lnəs/',
            parts: [{
                type: 'noun',
                definitions: [
                    'A mental state achieved by focusing awareness on the present moment.',
                    'The practice of maintaining a nonjudgmental state of heightened awareness.'
                ],
                synonyms: ['awareness', 'consciousness', 'attention', 'presence']
            }]
        }
    };

    function init() {
        loadVocabulary();
        setupEventListeners();
    }

    function loadVocabulary() {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            vocabulary = result[STORAGE_KEY] || [];
            renderVocabulary();
        });
    }

    function saveVocabulary() {
        chrome.storage.sync.set({ [STORAGE_KEY]: vocabulary });
    }

    function renderVocabulary() {
        if (vocabulary.length === 0) {
            dictVocabList.innerHTML = '<div style="text-align:center;color:#666;font-size:11px;padding:20px;">No saved words yet</div>';
            return;
        }

        dictVocabList.innerHTML = vocabulary.map(word => `
            <div class="dict-vocab-item" data-word="${encodeURIComponent(word)}">
                <span class="dict-vocab-word">${escapeHtml(word)}</span>
                <button class="dict-vocab-delete" data-action="delete" data-word="${encodeURIComponent(word)}">×</button>
            </div>
        `).join('');

        dictVocabList.querySelectorAll('.dict-vocab-item').forEach(item => {
            const word = decodeURIComponent(item.dataset.word);
            
            item.querySelector('.dict-vocab-word').addEventListener('click', () => {
                dictInput.value = word;
                lookup(word);
            });

            item.querySelector('.dict-vocab-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                vocabulary = vocabulary.filter(w => w !== word);
                saveVocabulary();
                renderVocabulary();
            });
        });
    }

    function lookup(word) {
        const key = word.toLowerCase().trim();
        
        if (!key) {
            dictContent.innerHTML = '<div class="dict-empty"><div>Please enter a word</div></div>';
            return;
        }

        const entry = DICTIONARY[key];
        
        if (entry) {
            renderDefinition(entry, key);
        } else {
            // Try partial match
            const matches = Object.keys(DICTIONARY).filter(w => w.includes(key));
            
            if (matches.length > 0) {
                dictContent.innerHTML = `
                    <div class="dict-empty">
                        <div style="font-size: 14px; margin-bottom: 8px;">Word not found</div>
                        <div>Did you mean:</div>
                        <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                            ${matches.slice(0, 5).map(w => `
                                <span class="dict-synonym" data-word="${w}">${w}</span>
                            `).join('')}
                        </div>
                    </div>
                `;
                
                dictContent.querySelectorAll('.dict-synonym').forEach(btn => {
                    btn.addEventListener('click', () => {
                        dictInput.value = btn.dataset.word;
                        lookup(btn.dataset.word);
                    });
                });
            } else {
                dictContent.innerHTML = `
                    <div class="dict-empty">
                        <div style="font-size: 24px; margin-bottom: 12px;">⊡</div>
                        <div>Word not found</div>
                        <div style="margin-top: 12px; font-size: 11px; color: #666;">Try a different word</div>
                    </div>
                `;
            }
        }
    }

    function renderDefinition(entry, word) {
        const isSaved = vocabulary.includes(word.toLowerCase());
        
        dictContent.innerHTML = `
            <div class="dict-word">${word}</div>
            <div class="dict-phonetic">${entry.phonetic}</div>
            ${entry.parts.map(part => `
                <div class="dict-part">${part.type}</div>
                ${part.definitions.map((def, i) => `
                    <div class="dict-definition">${part.type === 'noun' ? (i + 1) + '. ' : ''}${def}</div>
                `).join('')}
                ${part.synonyms ? `
                    <div class="dict-synonyms">
                        ${part.synonyms.map(s => `<span class="dict-synonym" data-word="${s}">${s}</span>`).join('')}
                    </div>
                ` : ''}
            `).join('')}
            <div style="text-align: center; margin-top: 20px;">
                <button class="dict-btn" id="saveWordBtn" style="
                    background: ${isSaved ? 'var(--nm-surface)' : 'var(--nm-text)'};
                    color: ${isSaved ? 'var(--nm-text)' : 'var(--nm-bg)'};
                    border: 1px solid ${isSaved ? 'var(--nm-border)' : 'var(--nm-text)'};
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-family: var(--nm-font);
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">
                    ${isSaved ? '✓ SAVED' : '☆ SAVE WORD'}
                </button>
            </div>
        `;

        // Add click handlers for synonyms
        dictContent.querySelectorAll('.dict-synonym').forEach(btn => {
            btn.addEventListener('click', () => {
                dictInput.value = btn.dataset.word;
                lookup(btn.dataset.word);
            });
        });

        // Save button
        const saveBtn = document.getElementById('saveWordBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const lowerWord = word.toLowerCase();
                if (!vocabulary.includes(lowerWord)) {
                    vocabulary.push(lowerWord);
                    saveVocabulary();
                    renderVocabulary();
                    lookup(word); // Re-render to update button
                }
            });
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function setupEventListeners() {
        closeBtn.addEventListener('click', closeModal);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        dictSearchBtn.addEventListener('click', () => {
            lookup(dictInput.value);
        });

        dictInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                lookup(dictInput.value);
            }
        });

        clearAllBtn.addEventListener('click', () => {
            if (confirm('Clear all saved words?')) {
                vocabulary = [];
                saveVocabulary();
                renderVocabulary();
            }
        });

        document.addEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        }
    }

    function openModal() {
        overlay.classList.add('active');
        dictInput.focus();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openDictionary') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.DictionaryWidget = { open: openModal, close: closeModal };
    init();
})();
