// Daily Quote Widget Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('quoteOverlay');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const closeBtn = document.getElementById('quoteClose');
    const copyBtn = document.getElementById('quoteCopy');
    const shareBtn = document.getElementById('quoteShare');
    const newBtn = document.getElementById('quoteNew');

    let currentQuote = null;
    let usedQuotes = [];

    // Curated quotes database - minimal, thoughtful, productivity-focused
    const QUOTES = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
        { text: "Die with memories, not dreams.", author: "Unknown" },
        { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
        { text: "Determine your priorities and focus on them.", author: "Jerry Seinfeld" },
        { text: "Be so good they can't ignore you.", author: "Steve Martin" },
        { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
        { text: "Whatever you do, do it well.", author: "Walt Disney" },
        { text: "What we think, we become.", author: "Buddha" },
        { text: "Act as if what you do makes a difference.", author: "William James" },
        { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
        { text: "The only limit to our realization of tomorrow is our doubts today.", author: "Franklin D. Roosevelt" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "Happiness depends upon ourselves.", author: "Aristotle" },
        { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
        { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
        { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
        { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
        { text: "Go confidently in the direction of your dreams.", author: "Henry David Thoreau" },
        { text: "Simplicity is the essence of happiness.", author: "Cedric Bledsoe" },
        { text: "Less is more.", author: "Ludwig Mies van der Rohe" },
        { text: "Make each day your masterpiece.", author: "John Wooden" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Knowledge is power.", author: "Francis Bacon" },
        { text: "Education is the passport to the future.", author: "Unknown" },
        { text: "Work smarter, not harder.", author: "Unknown" },
        { text: "One day or day one. You decide.", author: "Unknown" },
        { text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" },
        { text: "The price of anything is the amount of life you exchange for it.", author: "Henry David Thoreau" },
        { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
        { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { text: "Your vision will become clear only when you can look into your own heart.", author: "Carl Jung" },
        { text: "Simplicity, patience, compassion. These three are your greatest treasures.", author: "Lao Tzu" },
        { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
        { text: "The unexamined life is not worth living.", author: "Socrates" },
        { text: "To know oneself is to study oneself in action with another person.", author: "Bruce Lee" },
        { text: "Muddy water is best cleared by leaving it alone.", author: "Alan Watts" }
    ];

    const STORAGE_KEY = 'et_used_quotes';

    function init() {
        loadUsedQuotes();
        getDailyQuote();
        setupEventListeners();
    }

    function loadUsedQuotes() {
        chrome.storage.sync.get([STORAGE_KEY], (result) => {
            usedQuotes = result[STORAGE_KEY] || [];
        });
    }

    function saveUsedQuotes() {
        chrome.storage.sync.set({ [STORAGE_KEY]: usedQuotes.slice(-50) });
    }

    function getDailyQuote() {
        // Use date-based seed for daily quote
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Simple seeded random
        const index = Math.floor(seed % QUOTES.length);
        
        // If we've used all quotes, reset
        if (usedQuotes.length >= QUOTES.length) {
            usedQuotes = [];
        }
        
        currentQuote = QUOTES[index];
        displayQuote();
    }

    function getRandomQuote() {
        // Filter out recently used quotes
        const available = QUOTES.filter((_, idx) => !usedQuotes.includes(idx));
        
        if (available.length === 0) {
            usedQuotes = [];
            available = QUOTES;
        }
        
        const index = Math.floor(Math.random() * available.length);
        
        // Find the original index
        const originalIndex = QUOTES.indexOf(available[index]);
        usedQuotes.push(originalIndex);
        saveUsedQuotes();
        
        currentQuote = available[index];
        displayQuote();
    }

    function displayQuote() {
        if (!currentQuote) return;
        
        quoteText.textContent = `"${currentQuote.text}"`;
        quoteAuthor.textContent = currentQuote.author;
    }

    function setupEventListeners() {
        closeBtn.addEventListener('click', closeModal);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        newBtn.addEventListener('click', getRandomQuote);

        copyBtn.addEventListener('click', async () => {
            const text = `${currentQuote.text} — ${currentQuote.author}`;
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.innerHTML = '<span>✓</span> COPIED';
                setTimeout(() => {
                    copyBtn.innerHTML = '<span>⊛</span> COPY';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        shareBtn.addEventListener('click', saveToNotes);
    }

    async function saveToNotes() {
        const noteText = `${currentQuote.text} — ${currentQuote.author}`;
        
        // Get existing notes
        const result = await new Promise(resolve => {
            chrome.storage.sync.get(['et_notes_v2'], resolve);
        });
        
        let notes = result.et_notes_v2 || [];
        
        if (notes.length === 0) {
            notes.push({
                id: 'note_default',
                title: 'Quick Note',
                content: noteText,
                date: Date.now()
            });
        } else {
            // Add to the most recent note
            notes[0].content = noteText + '\n\n' + notes[0].content;
            notes[0].date = Date.now();
        }
        
        await new Promise(resolve => {
            chrome.storage.sync.set({ et_notes_v2: notes }, resolve);
        });

        shareBtn.innerHTML = '<span>✓</span> SAVED';
        setTimeout(() => {
            shareBtn.innerHTML = '<span>⊕</span> SAVE TO NOTES';
        }, 2000);
    }

    function openModal() {
        overlay.classList.add('active');
        getDailyQuote();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openQuote') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.QuoteWidget = { open: openModal, close: closeModal };
    init();
})();
