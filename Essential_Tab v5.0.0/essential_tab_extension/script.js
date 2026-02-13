document.addEventListener('DOMContentLoaded', () => {
    
    // --- Config ---
    const config = {
        userName: localStorage.getItem('et_name') || 'USER',
        blur: localStorage.getItem('et_blur') || 24,
        borderRadius: localStorage.getItem('et_radius') || 20,
        dockScale: localStorage.getItem('et_dock_scale') || 1,
        showDock: localStorage.getItem('et_dock') !== 'false',
        dockAutoHide: localStorage.getItem('et_dock_hide') === 'true',
        dockMagnification: localStorage.getItem('et_dock_mag') === 'true',
        dockHoverName: localStorage.getItem('et_dock_names') === 'true',
        dockMagStrength: parseFloat(localStorage.getItem('et_dock_mag_str') || '0.75'),
        theme: localStorage.getItem('et_theme') || 'dark',
        font: localStorage.getItem('et_font') || 'Inter',
        bgImage: localStorage.getItem('et_bg') || null,
        userWallpapers: JSON.parse(localStorage.getItem('et_user_wallpapers') || '[]'),
        use24h: localStorage.getItem('et_24h') === 'true',
        showSeconds: localStorage.getItem('et_seconds') === 'true',
        gridAlign: localStorage.getItem('et_grid_align') || 'center',
        layoutOrder: JSON.parse(localStorage.getItem('et_layout') || '["widget-clock", "widget-stack", "widget-search", "widget-todo", "widget-recents"]'),
        hiddenWidgets: JSON.parse(localStorage.getItem('et_hidden') || '["widget-notes", "widget-bookmarks", "widget-countdown", "widget-music"]'),
        sidebarWidget: localStorage.getItem('et_sidebar_widget') || null,
        stickers: JSON.parse(localStorage.getItem('et_stickers') || '[]'),
        customStickers: JSON.parse(localStorage.getItem('et_custom_stickers') || '[]'),
        searchHalfWidth: localStorage.getItem('et_search_half') === 'true',
        experimental: localStorage.getItem('et_experimental') === 'true',
        disableBlurAnim: localStorage.getItem('et_disable_blur_anim') === 'true',
        coverSize: localStorage.getItem('et_cover_size') || 110,
        ambientMode: localStorage.getItem('et_ambient') === 'true',
        lenticular: localStorage.getItem('et_lenticular') === 'true',
        albumGlow: localStorage.getItem('et_album_glow') === 'true',
        emojiIcons: localStorage.getItem('et_emoji_icons') === 'true',
        countdownDate: localStorage.getItem('et_cd_date') || null,
        countdownLabel: localStorage.getItem('et_cd_label') || 'EVENT',
        briefAutoShow: localStorage.getItem('et_brief_auto') !== 'false',
        briefNewsTopic: localStorage.getItem('et_brief_topic') || 'tech',
        briefOrder: JSON.parse(localStorage.getItem('et_brief_order') || '["greeting", "weather", "tasks", "fact", "quote", "news", "music", "surprise"]'),
        briefButtonLocation: localStorage.getItem('et_brief_btn_loc') || 'homepage',
        currentAudioTabId: null,
        minecraftTheme: localStorage.getItem('et_mc_theme') === 'true',
        geminiApiKey: localStorage.getItem('et_gemini_key') || '',
        geminiModel: localStorage.getItem('et_gemini_model') || 'flash-lite',
        bookmarkOrder: localStorage.getItem('et_bookmark_order') || 'newest', // 'newest' or 'oldest'
        weatherDate: localStorage.getItem('et_weather_date') === 'true',
        // User Card Config
        userCard: JSON.parse(localStorage.getItem('et_user_card') || JSON.stringify({
            id: '#' + Math.floor(1000 + Math.random() * 9000), // Fixed random ID
            color: '#d71921',
            font: 'Space Mono',
            image: null,
            name: 'USER' // Independent display name for card
        }))
    };

    const CURRENT_VERSION = '5.0.0';

    const changelogs = [
        { version: '5.0.0', date: '2024-12-06', changes: [
            'Major Release: Essential Tab v5.0',
            'Added Notes Data Management: Backup, Import & Reset',
            'Moved Extension Information to top of System Settings',
            'New option to backup and import ur extension data',
            'Enhanced Dock animated interactions',
            'Added smooth Wallpaper entrance and transition animations',
            'Added interactive Red Pulsing Dot accent to Clock witget',
            'Added depth with small widget shadows in Dark Mode',
            'Sligtly Revamped Music Widget UI with improved sidebar integration',
            'Range Sliders now revamped for better look',
            'Pill Switches now use bouncy Animation',
            'Added thin separator lines to widget headers',
            'Feature: Added option to show date in Weather widget',
            'New notes icon'
        ]},
        { version: '4.9.1', date: '2024-02-14', changes: [
            'Patch fix: Fixed rendering maths issue in Essential Search using LaTeX',
        ]},
        { version: '4.9.0', date: '2024-02-12', changes: [
            'Added Essential Search (AI Powered)',
            'Added Drag & Drop reordering for Library/Bookmarks',
            'Fixed scrollbar styling in Library, Search, and Notes',
            'Added Bookmark sorting preference (Newest/Oldest)',
            'General UI improvements and bug fixes'
        ]},
        { version: '4.8.0', date: '2024-01-20', changes: [
            'OFFICIAL RELEASE: Beta tag removed from version',
            'Added new Easter Eggs for 4.8.0',
            'Bug fixes and stability improvements'
        ]},
        { version: '4.7.0', date: '2023-12-30', changes: [
            'Added Lenticular (Fluted Glass) Wallpaper Effect',
            'Replaced old SVGs with new refined icons',
            'Added option to disable window blur animations (Performance)',
            'Updated Settings Icon in Dock',
            'Added Morning Brief button location preference',
            'Added Beta tags to experimental labs',
            'Bug fixes & UI Polish'
        ]},
        { version: '4.6.0', date: '2023-12-30', changes: [
            'Advanced Gradient Lab: Create custom gradient wallpapers',
            'Emoji Lab 2.0: Enhanced pattern generation with density controls',
            'Live News Feed: Integrated Google News headlines in Brief',
            'Daily Challenges: Track your productive habits',
            'Community: Added Feedback & Bug Reporting',
            'Added Social Links to About Page'
        ]},
        { version: '4.5.0', date: '2023-12-25', changes: ['Revamped History Tab', 'Updated Search Bar Style', 'Optimized User Card', 'Update Log UI Improvements'] },
        { version: '4.4.0', date: '2023-12-20', changes: ['Added Interactive User ID Card', 'Customizable Card Colors', '3D Holographic Effects'] },
        { version: '4.3.0', date: '2023-12-15', changes: ['Added Dock Magnification', 'Dock Hover Names', 'Enhanced UI Animations'] },
        { version: '4.2.0', date: '2023-12-08', changes: ['Wallpaper Playground Grid Layout', 'Emoji Pattern Generator', 'Performance Improvements'] },
        { version: '4.1.0', date: '2023-12-07', changes: ['Added Morning Brief', 'Tint Control', 'Music Layout Fixes'] },
        { version: '4.0.0', date: '2023-11-06', changes: ['Major Update: Version 4.0', 'High Res Music Art Fixes', 'Celebratory Easter Eggs', 'Confetti!'] },
    ];

    // --- Sound FX ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playSound = (type) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'delete') {
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    };

    // --- DOM Elements ---
    const gridContainer = document.getElementById('gridContainer');
    const drawerContent = document.getElementById('drawerContent');
    const stickerContent = document.getElementById('stickerContent');
    const widgetDrawer = document.getElementById('widgetDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const editToggle = document.getElementById('editToggle');
    const sidebarContainer = document.getElementById('sidebarContainer');
    const sidebarPlaceholder = document.getElementById('sidebarPlaceholder');
    const settingsModal = document.getElementById('settingsModal');
    const stickerLayer = document.getElementById('stickerLayer');
    const bgVideo = document.getElementById('bgVideo');
    const briefOverlay = document.getElementById('briefOverlay');
    let isEditMode = false;
    let pinnedItems = JSON.parse(localStorage.getItem('et_pinned') || '[]');

    // --- Daily Data Content ---
    const dailyQuotes = [
        "The only way to do great work is to love what you do.",
        "Focus on being productive instead of busy.",
        "Simplicity is the ultimate sophistication.",
        "Every moment is a fresh beginning.",
        "Change the world by being yourself.",
        "Die with memories, not dreams.",
        "Everything you can imagine is real.",
        "Determine your priorities and focus on them.",
        "Be so good they can't ignore you.",
        "Dream big and dare to fail.",
        "Whatever you do, do it well.",
        "What we think, we become.",
        "Act as if what you do makes a difference.",
        "Success is not final, failure is not fatal.",
        "Believe you can and you're halfway there."
    ];

    const dailyFacts = [
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
        "Octopuses have three hearts.",
        "Bananas are berries, but strawberries aren't.",
        "A day on Venus is longer than a year on Venus.",
        "There are more stars in the universe than grains of sand on all the Earth's beaches.",
        "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
        "Water makes up about 71% of the Earth's surface.",
        "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
        "The first computer was invented in the 1940s.",
        "Human teeth are the only part of the body that cannot heal themselves.",
        "Cows have best friends and get stressed when they are separated.",
        "A cloud weighs around a million tonnes.",
        "You can't hum while holding your nose."
    ];

    const dailyChallenges = [
        "Drink 2 liters of water today.",
        "Read 10 pages of a book.",
        "Take a 15-minute walk without your phone.",
        "Declutter one small area of your desk.",
        "Write down 3 things you are grateful for.",
        "Do 20 pushups (or your variation).",
        "Send a kind message to a friend.",
        "Meditate for 5 minutes.",
        "Learn one new word today.",
        "No social media for the next hour.",
        "Fix your posture every time you remember.",
        "Eat one piece of fruit.",
        "Go to bed 30 minutes earlier."
    ];

    // Helper: Seeded Random Selection based on Date
    const getDailyItem = (array) => {
        const todayStr = new Date().toDateString(); // e.g. "Fri Dec 08 2023"
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) {
            hash = (hash << 5) - hash + todayStr.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        const index = Math.abs(hash) % array.length;
        return array[index];
    };

    // --- Morning Brief Logic ---
    const checkMorningBrief = () => {
        const today = new Date().toDateString();
        const lastShown = localStorage.getItem('et_brief_last_shown');
        
        if (config.briefAutoShow && lastShown !== today) {
            openBrief();
        }
    };

    const openBrief = () => {
        renderBriefContent();
        briefOverlay.classList.add('active');
        playSound('click');
        localStorage.setItem('et_brief_last_shown', new Date().toDateString());
    };

    const closeBrief = () => {
        briefOverlay.classList.remove('active');
    };

    document.getElementById('morningBriefBtn').onclick = openBrief;
    document.getElementById('closeBrief').onclick = closeBrief;
    briefOverlay.onclick = (e) => { if (e.target === briefOverlay) closeBrief(); };

    const getMusicRec = () => {
        const h = new Date().getHours();
        if (h < 12) return { genre: 'Acoustic / Lo-Fi', icon: '☕', link: 'https://open.spotify.com/genre/0JQ5DAqbMKFzHmL4tf05da' }; 
        if (h < 18) return { genre: 'Pop / Upbeat', icon: '⚡', link: 'https://open.spotify.com/genre/0JQ5DAqbMKFEC4WFtoNRpw' }; 
        return { genre: 'Jazz / Ambient', icon: '🌙', link: 'https://open.spotify.com/genre/0JQ5DAqbMKFAJ5xb0fwo9m' }; 
    };

    const renderBriefContent = async () => {
        const container = document.getElementById('briefContent');
        container.innerHTML = '';
        
        const now = new Date();
        const dateKey = now.toDateString();
        const todos = JSON.parse(localStorage.getItem('todos') || '[]');
        const rec = getMusicRec();

        // Get fresh daily content
        const dailyQuote = getDailyItem(dailyQuotes);
        const dailyFact = getDailyItem(dailyFacts);
        const dailyChallengeText = getDailyItem(dailyChallenges);

        // Challenge State
        const challengeKey = 'et_challenge_' + dateKey;
        
        // Helper to create sections
        const createSection = (type) => {
            const div = document.createElement('div');
            
            if (type === 'greeting') {
                div.className = 'bento-card greeting span-4';
                div.innerHTML = `<div class="brief-title">GOOD ${now.getHours() < 12 ? 'MORNING' : (now.getHours() < 17 ? 'AFTERNOON' : 'EVENING')},<br>${config.userName}</div>
                <div class="brief-subtitle" style="margin-top: auto;"><span>${now.toLocaleDateString('en-US', {weekday:'long'}).toUpperCase()}</span><span>•</span><span>${now.getDate()} ${now.toLocaleDateString('en-US', {month:'long'}).toUpperCase()}</span></div>`;
            } 
            else if (type === 'weather') {
                div.className = 'bento-card weather span-2';
                div.innerHTML = `<div class="bento-label"><span>WEATHER</span><span>LIVE</span></div>
                <div class="brief-big-text" id="briefWeather">--°</div>`;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        try {
                            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m`);
                            const data = await res.json();
                            const el = document.getElementById('briefWeather');
                            if(el) el.innerText = Math.round(data.current.temperature_2m) + '°';
                        } catch(e) {}
                    });
                }
            }
            else if (type === 'tasks') {
                div.className = 'bento-card span-2';
                const activeTasks = todos.filter(t => !t.done).slice(0, 3);
                let taskHTML = activeTasks.length ? activeTasks.map(t => `<div class="bento-list-item"><div class="bento-check"></div><span>${t.text}</span></div>`).join('') : '<span style="color:#666; font-size:0.8rem; margin-top: auto;">No pending tasks.<br>You are free!</span>';
                div.innerHTML = `<div class="bento-label"><span>PRIORITIES</span><span style="color:var(--accent);">${activeTasks.length}</span></div><div class="bento-list">${taskHTML}</div>`;
            }
            else if (type === 'fact') {
                div.className = 'bento-card span-1';
                div.innerHTML = `<div class="bento-label"><span>DID YOU KNOW?</span></div>
                <div style="font-size:0.8rem; line-height:1.4; color:#ccc; margin-top:auto;">${dailyFact}</div>`;
            }
            else if (type === 'quote') {
                div.className = 'bento-card span-2';
                div.innerHTML = `<div class="bento-label"><span>QUOTE OF THE DAY</span></div>
                <div style="font-size:1.1rem; font-style:italic; font-family:var(--font-ui); color:#fff; margin-top:auto;">"${dailyQuote}"</div>`;
            }
            else if (type === 'news') {
                div.className = 'bento-card news span-4';
                div.innerHTML = `<div class="bento-label"><span>HEADLINES</span><span>${config.briefNewsTopic.toUpperCase()}</span></div>
                <div id="briefNewsContent" style="display:flex; flex-direction:column; gap:10px; flex-grow:1; justify-content:center;">
                    <div style="color:#666; font-size:0.9rem;">Fetching ${config.briefNewsTopic} headlines...</div>
                </div>
                <button id="briefNewsBtn" style="margin-top:10px; background:rgba(255,255,255,0.1); border:none; padding:8px 12px; border-radius:6px; color:#fff; cursor:pointer; font-size:0.75rem; font-weight:bold; align-self:flex-start; transition:background 0.2s;">READ MORE →</button>`;
                
                // Fetch Logic using RSS2JSON for Google News to avoid CORS and get "actual" headlines
                const fetchNews = async () => {
                    try {
                        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(config.briefNewsTopic)}&hl=en-US&gl=US&ceid=US:en`;
                        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                        const data = await res.json();
                        
                        const newsCont = div.querySelector('#briefNewsContent');
                        if (data.items && data.items.length > 0) {
                            newsCont.innerHTML = '';
                            newsCont.style.justifyContent = 'flex-start';
                            
                            data.items.slice(0, 3).forEach(item => {
                                const row = document.createElement('div');
                                row.style.cssText = "font-size:0.9rem; border-bottom:1px solid rgba(255,255,255,0.1); padding:8px 0; cursor:pointer; transition:color 0.2s; color:#ccc;";
                                row.innerText = item.title;
                                row.onmouseover = () => row.style.color = '#fff';
                                row.onmouseout = () => row.style.color = '#ccc';
                                row.onclick = () => window.open(item.link, '_blank');
                                newsCont.appendChild(row);
                            });
                            
                            const btn = div.querySelector('#briefNewsBtn');
                            btn.onclick = () => window.open(`https://news.google.com/search?q=${config.briefNewsTopic}`, '_blank');
                            btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.2)';
                            btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.1)';
                        } else {
                            throw new Error("No items");
                        }
                    } catch (e) {
                         const newsCont = div.querySelector('#briefNewsContent');
                         if(newsCont) newsCont.innerHTML = `<div style="color:#d71921;">Unable to load live feed.</div>`;
                         const btn = div.querySelector('#briefNewsBtn');
                         if(btn) btn.onclick = () => window.open(`https://news.google.com/search?q=${config.briefNewsTopic}`, '_blank');
                    }
                };
                fetchNews();
            }
            else if (type === 'music') {
                div.className = 'bento-card music span-2';
                div.onclick = () => window.open(rec.link, '_blank');
                div.innerHTML = `<div style="font-size:2rem; margin-bottom:10px;">${rec.icon}</div>
                <div style="display:flex; flex-direction:column;"><span style="font-size:0.7rem; font-weight:bold; letter-spacing:1px; opacity:0.7;">VIBE CHECK</span><span style="font-size:1.5rem; font-weight:700;">${rec.genre}</span></div>`;
            }
            else if (type === 'surprise') {
                // Modified to be Daily Challenge
                div.className = 'bento-card span-1';
                div.style.border = '1px dashed var(--accent)';
                
                const renderChallenge = () => {
                    const done = localStorage.getItem(challengeKey) === 'true';
                    div.innerHTML = `<div class="bento-label" style="color:var(--accent);"><span>DAILY CHALLENGE</span></div>
                    <div style="font-size:0.9rem; font-weight:bold; margin-bottom:10px; line-height:1.4;">${dailyChallengeText}</div>
                    <div id="challengeCheck" style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:auto; padding-top:10px;">
                        <div style="width:20px; height:20px; border:2px solid var(--accent); border-radius:4px; display:flex; align-items:center; justify-content:center; background:${done ? 'var(--accent)' : 'transparent'}">
                            ${done ? '<span style="color:black; font-weight:bold; font-size:14px;">✓</span>' : ''}
                        </div>
                        <span style="font-size:0.75rem; font-weight:bold; color:${done ? '#fff' : '#888'}">${done ? 'COMPLETED' : 'MARK DONE'}</span>
                    </div>`;
                    
                    setTimeout(() => {
                        const checkBtn = div.querySelector('#challengeCheck');
                        if(checkBtn) checkBtn.onclick = () => {
                             const newState = !done;
                             localStorage.setItem(challengeKey, newState);
                             playSound('click');
                             if(newState && typeof startConfetti === 'function') startConfetti();
                             renderChallenge();
                        };
                    }, 0);
                };
                renderChallenge();
            }
            
            container.appendChild(div);
        };

        config.briefOrder.forEach(section => createSection(section));
    };

    // Initialize Brief
    setTimeout(checkMorningBrief, 1000);

    // --- Intro Sequence ---
    const checkIntro = () => {
        const lastVersion = localStorage.getItem('et_version_intro');
        // Show if first run (null) or version mismatch (new version installed)
        if (lastVersion !== CURRENT_VERSION) {
            const overlay = document.getElementById('introOverlay');
            const nextBtn = document.getElementById('introNextBtn');
            const dots = document.querySelectorAll('.intro-dot');
            const slides = document.querySelectorAll('.intro-slide');
            let currentStep = 0;
            
            if (overlay) overlay.classList.add('active');
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    playSound('click');
                    if (currentStep < 2) {
                        currentStep++;
                        updateSlide();
                    } else {
                        // Finish
                        localStorage.setItem('et_version_intro', CURRENT_VERSION);
                        overlay.classList.add('fade-out');
                        setTimeout(() => {
                            overlay.classList.remove('active');
                            overlay.classList.remove('fade-out');
                        }, 500);
                    }
                });
            }
            
            const updateSlide = () => {
                slides.forEach((s, i) => {
                    if (i === currentStep) s.classList.add('active');
                    else s.classList.remove('active');
                });
                dots.forEach((d, i) => {
                    if (i === currentStep) d.classList.add('active');
                    else d.classList.remove('active');
                });
                if (currentStep === 2) {
                    nextBtn.textContent = "LAUNCH";
                    nextBtn.style.background = "#d71921";
                    nextBtn.style.color = "#fff";
                }
            };
        }
    };
    checkIntro();

    
    // --- STICKERS ---
    const renderStickers = () => {
        stickerLayer.innerHTML = '';
        config.stickers.forEach(s => {
            const div = document.createElement('div');
            div.className = 'placed-sticker';
            div.id = s.id;
            div.style.left = s.x + '%';
            div.style.top = s.y + '%';
            // Rotation Transform
            div.style.transform = `translate(-50%, -50%) rotate(${s.rotation || 0}deg)`;
            
            if (s.type === 'custom') {
                div.innerHTML = `<img src="${s.src}">`;
            } else {
            const preset = document.querySelector(`.sticker-item.preset[data-type="${s.type}"]`);
                if(preset) div.innerHTML = preset.innerHTML;
            }

            // Edit Mode Controls
            if (isEditMode) {
                // Delete Button (Top-Right)
                const delBtn = document.createElement('div');
                delBtn.className = 'sticker-control-btn sticker-delete';
                delBtn.innerHTML = '×';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    playSound('delete');
                    config.stickers = config.stickers.filter(i => i.id !== s.id);
                    localStorage.setItem('et_stickers', JSON.stringify(config.stickers));
                    renderStickers();
                };
                div.appendChild(delBtn);

                // Rotate Button (Bottom-Right)
                const rotBtn = document.createElement('div');
                rotBtn.className = 'sticker-control-btn sticker-rotate';
                rotBtn.innerHTML = '⟳';
                rotBtn.onmousedown = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    div.style.transition = 'none'; // Disable transition for instant response
                    
                    // Calculate center based on percentages
                    const cx = (s.x / 100) * window.innerWidth;
                    const cy = (s.y / 100) * window.innerHeight;
                    
                    const onRotate = (mv) => {
                        // Calculate angle in degrees
                        const angle = Math.atan2(mv.clientY - cy, mv.clientX - cx);
                        const deg = angle * (180 / Math.PI) - 45; // -45 to align handle correctly
                        
                        s.rotation = deg;
                        div.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
                    };
                    
                    const onEndRotate = () => {
                        document.removeEventListener('mousemove', onRotate);
                        document.removeEventListener('mouseup', onEndRotate);
                        div.style.transition = ''; // Restore transition
                        localStorage.setItem('et_stickers', JSON.stringify(config.stickers));
                    };
                    document.addEventListener('mousemove', onRotate);
                    document.addEventListener('mouseup', onEndRotate);
                };
                div.appendChild(rotBtn);
            }

            // Drag Logic for placed stickers (Movement)
            div.addEventListener('mousedown', (e) => {
                if(!isEditMode) return;
                // Ignore if clicked on controls
                if(e.target.classList.contains('sticker-control-btn')) return;
                
                e.stopPropagation();
                div.style.transition = 'none'; // Disable transition for instant response
                
                let startX = e.clientX;
                let startY = e.clientY;
                // Current rotation must be preserved during drag visual
                const currentRot = s.rotation || 0;
                
                const onMove = (mv) => {
                    const dx = mv.clientX - startX;
                    const dy = mv.clientY - startY;
                    div.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${currentRot}deg)`;
                };
                
                const onUp = (up) => {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    div.style.transition = ''; // Restore transition
                    
                    const winW = window.innerWidth;
                    const winH = window.innerHeight;
                    
                    // Calculate delta in percentage
                    const deltaXPercent = ((up.clientX - startX) / winW) * 100;
                    const deltaYPercent = ((up.clientY - startY) / winH) * 100;
                    
                    s.x += deltaXPercent;
                    s.y += deltaYPercent;
                    
                    localStorage.setItem('et_stickers', JSON.stringify(config.stickers));
                    renderStickers();
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
            stickerLayer.appendChild(div);
        });
    };
    
    const renderCustomStickers = () => {
        const cont = document.getElementById('customStickerContainer');
        cont.innerHTML = '';
        config.customStickers.forEach((src, idx) => {
            const div = document.createElement('div');
            div.className = 'sticker-item';
            div.draggable = true;
            div.dataset.type = 'custom';
            div.dataset.idx = idx;
            div.innerHTML = `<img src="${src}">`;
            div.addEventListener('dragstart', handleStickerDragStart);
            // Delete custom
            div.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if(confirm('Remove custom sticker from library?')) {
                    config.customStickers.splice(idx, 1);
                    localStorage.setItem('et_custom_stickers', JSON.stringify(config.customStickers));
                    renderCustomStickers();
                }
            });
            cont.appendChild(div);
        });
    };

    // Sticker Upload
    document.getElementById('stickerUpload').addEventListener('change', (e) => {
        if(config.customStickers.length >= 5) { alert('Max 5 custom stickers.'); return; }
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            config.customStickers.push(evt.target.result);
            localStorage.setItem('et_custom_stickers', JSON.stringify(config.customStickers));
            renderCustomStickers();
        };
        reader.readAsDataURL(file);
    });

    const handleStickerDragStart = (e) => {
        e.dataTransfer.setData('type', 'sticker');
        e.dataTransfer.setData('stickerType', e.currentTarget.dataset.type);
        if(e.currentTarget.dataset.type === 'custom') {
             e.dataTransfer.setData('stickerSrc', config.customStickers[e.currentTarget.dataset.idx]);
        }
    };
    
    document.querySelectorAll('.sticker-item.preset').forEach(el => {
        el.addEventListener('dragstart', handleStickerDragStart);
    });

    renderStickers();
    renderCustomStickers();

    // --- Clock Logic ---
    const updateTime = () => {
        const now = new Date();
        const opts = { hour12: !config.use24h, hour: '2-digit', minute: '2-digit' };
        if(config.showSeconds) opts.second = '2-digit';
        document.getElementById('clockTime').textContent = now.toLocaleTimeString('en-US', opts);
        const hrs = now.getHours();
        document.getElementById('greetingText').textContent = hrs < 12 ? 'GOOD MORNING' : (hrs < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING');
        document.getElementById('calDay').textContent = now.toLocaleDateString('en-US', {weekday:'short'}).toUpperCase();
        document.getElementById('calDate').textContent = now.getDate();
        document.getElementById('clockDateFull').textContent = now.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'}).toUpperCase();
        
        const weatherDate = document.getElementById('weatherDate');
        if (weatherDate) weatherDate.textContent = now.toLocaleDateString('en-US', {month:'short', day:'numeric'}).toUpperCase();

        // Countdown Logic
        const label = config.countdownLabel || 'EVENT';
        document.getElementById('countdownLabel').textContent = label;
        
        if(config.countdownDate) {
            // Construct date in local time to avoid timezone issues (YYYY-MM-DD input is local)
            const parts = config.countdownDate.split('-');
            const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            // Clear time part of target
            target.setHours(0,0,0,0);
            
            const today = new Date();
            today.setHours(0,0,0,0);
            
            const diff = target - today;
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) document.getElementById('countdownTime').textContent = daysLeft + ' DAYS';
            else if (daysLeft === 0) document.getElementById('countdownTime').textContent = 'TODAY';
            else document.getElementById('countdownTime').textContent = 'PASSED';

            // Progress Bar
            const startTime = localStorage.getItem('et_cd_start');
            if (startTime) {
                const start = new Date(parseInt(startTime));
                const total = target - start;
                const elapsed = today - start;
                const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
                const fill = document.getElementById('countdownFill');
                if(fill) fill.style.width = pct + '%';
            }
        }
    };
    setInterval(updateTime, 1000); updateTime();

    // Calendar Month View Logic (Dynamic)
    document.getElementById('calToggleView').addEventListener('click', () => {
        const simple = document.getElementById('calSimpleView');
        const month = document.getElementById('calMonthView');
        simple.classList.toggle('hidden');
        month.classList.toggle('hidden');
        
        if (!month.classList.contains('hidden')) {
            const now = new Date();
            const grid = document.getElementById('calGrid');
            grid.innerHTML = '';
            
            const monthName = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
            document.getElementById('calMonthName').textContent = monthName;
            
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay(); // 0-6
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            
            for (let i = 0; i < firstDay; i++) {
                const d = document.createElement('div');
                d.className = 'grid-day';
                grid.appendChild(d);
            }
            
            for (let i = 1; i <= daysInMonth; i++) {
                const d = document.createElement('div');
                d.className = 'grid-day' + (i === now.getDate() ? ' today' : '');
                d.textContent = i;
                grid.appendChild(d);
            }
        }
    });

    // Countdown Save Handler
    document.getElementById('saveCountdownBtn').addEventListener('click', () => {
        const label = document.getElementById('countdownLabelInput').value;
        const date = document.getElementById('countdownDateInput').value;
        
        if (date) {
            localStorage.setItem('et_cd_label', label);
            localStorage.setItem('et_cd_date', date);
            config.countdownLabel = label;
            config.countdownDate = date;
            
            // Set start date if new
            if (!localStorage.getItem('et_cd_start')) {
                localStorage.setItem('et_cd_start', Date.now().toString());
            }
            
            updateTime();
            alert('Countdown Updated');
        } else {
            alert('Please select a valid date');
        }
    });

    // --- Weather ---
    const updateWeather = async () => {
        if (!navigator.geolocation) {
             document.getElementById('weatherDesc').textContent = 'GPS NA';
             return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,weather_code`);
                const data = await res.json();
                document.getElementById('weatherTemp').textContent = Math.round(data.current.temperature_2m) + '°';
                document.getElementById('weatherDesc').textContent = 'LAT: ' + pos.coords.latitude.toFixed(2);
            } catch(e) {
                document.getElementById('weatherDesc').textContent = 'ERR';
            }
        }, () => {
            document.getElementById('weatherDesc').textContent = 'GPS OFF';
        });
    };
    updateWeather();

    // Stack Logic
    let stackIdx = 0; const stacks = ['view-weather', 'view-music', 'view-calendar'];
    const updateStack = () => {
        stacks.forEach((id, i) => document.getElementById(id).classList.toggle('active', i === stackIdx));
        document.getElementById('stackDots').innerHTML = stacks.map((_, i) => `<div class="stack-dot ${i === stackIdx ? 'active' : ''}"></div>`).join('');
    };
    document.getElementById('nextStack').onclick = () => { stackIdx = (stackIdx + 1) % 3; updateStack(); };
    document.getElementById('prevStack').onclick = () => { stackIdx = (stackIdx - 1 + 3) % 3; updateStack(); };
    updateStack();

    // Recents (History Fallback)
    const renderRecents = () => {
        const list = document.getElementById('recentsList');
        list.innerHTML = '';
        if (chrome.history) {
             chrome.history.search({text: '', maxResults: 7}, (results) => {
                 results.forEach(page => {
                     const a = document.createElement('a'); a.className = 'list-item'; a.href = page.url;
                     a.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain_url=${page.url}"><span>${page.title || page.url}</span>`;
                     list.appendChild(a);
                 });
             });
        } else if (chrome.topSites) {
            chrome.topSites.get(sites => {
                sites.slice(0, 7).forEach(site => {
                    const a = document.createElement('a'); a.className = 'list-item'; a.href = site.url;
                    a.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain_url=${site.url}"><span>${site.title}</span>`;
                    list.appendChild(a);
                });
            });
        }
    };
    renderRecents();
    
    // --- Bookmarks Logic ---
    const renderBookmarks = () => {
         if(!chrome.bookmarks) return;

         const sortItems = (items) => {
             // 1. Primary Sort based on config
             if (config.bookmarkOrder === 'oldest') {
                 items.reverse();
             }
             
             // 2. Apply Custom User Sort if exists
             const savedOrder = JSON.parse(localStorage.getItem('et_library_order') || '[]');
             if (savedOrder.length > 0) {
                 items.sort((a, b) => {
                     const idxA = savedOrder.indexOf(a.url);
                     const idxB = savedOrder.indexOf(b.url);
                     
                     // If both items have a saved custom position, sort by that index
                     if (idxA > -1 && idxB > -1) return idxA - idxB;
                     
                     // If only one has a custom position, prioritize it
                     if (idxA > -1) return -1;
                     if (idxB > -1) return 1;
                     
                     // Otherwise keep original relative order (from step 1)
                     return 0; 
                 });
             }
             return items;
         };
         
         // 1. For Widget
         const widgetList = document.getElementById('bookmarksList');
         if(widgetList) {
             widgetList.innerHTML = '';
             chrome.bookmarks.getRecent(7, (items) => {
                 // For widget, we stick to time-based unless we want custom there too. 
                 // Usually recent is expected here, but consistency is good. 
                 // Let's use the sorted list for consistency.
                 const sorted = sortItems(items);
                 sorted.forEach(item => {
                     const a = document.createElement('a'); a.className = 'list-item'; a.href = item.url;
                     a.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}"><span>${item.title}</span>`;
                     widgetList.appendChild(a);
                 });
             });
         }
         
         // 2. For Library Modal
         const libContent = document.getElementById('libraryContent');
         if(libContent) {
              libContent.innerHTML = '';
              chrome.bookmarks.getRecent(50, (items) => {
                 const sorted = sortItems(items);
                 
                 sorted.forEach(item => {
                     const div = document.createElement('div'); 
                     div.className = 'library-item';
                     div.draggable = true;
                     div.dataset.url = item.url; // Use URL as identifier
                     
                     // Standard click navigation
                     div.onclick = () => window.location.href = item.url;
                     
                     div.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}"><span>${item.title}</span>`;
                     
                     // --- Drag & Drop Logic ---
                     div.addEventListener('dragstart', (e) => {
                         e.dataTransfer.setData('text/plain', item.url);
                         e.dataTransfer.setData('type', 'library-item');
                         div.classList.add('dragging-lib');
                     });
                     
                     div.addEventListener('dragend', () => {
                         div.classList.remove('dragging-lib');
                         document.querySelectorAll('.library-item').forEach(el => el.classList.remove('drag-over-lib'));
                     });
                     
                     div.addEventListener('dragover', (e) => {
                         e.preventDefault(); // allow drop
                         const dragging = document.querySelector('.dragging-lib');
                         if (dragging && dragging !== div) {
                             div.classList.add('drag-over-lib');
                         }
                     });
                     
                     div.addEventListener('dragleave', () => {
                         div.classList.remove('drag-over-lib');
                     });
                     
                     div.addEventListener('drop', (e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         div.classList.remove('drag-over-lib');
                         
                         const draggedUrl = e.dataTransfer.getData('text/plain');
                         const type = e.dataTransfer.getData('type');
                         
                         if (type === 'library-item') {
                             const draggingEl = document.querySelector(`.library-item[dragging-lib]`) || document.querySelector(`.library-item[data-url="${draggedUrl}"]`);
                             
                             if (draggingEl && draggingEl !== div) {
                                 // Determine position relative to drop target center
                                 const rect = div.getBoundingClientRect();
                                 const relX = e.clientX - rect.left;
                                 
                                 // Insert before or after based on drop position
                                 if (relX > rect.width / 2) {
                                     div.parentNode.insertBefore(draggingEl, div.nextSibling);
                                 } else {
                                     div.parentNode.insertBefore(draggingEl, div);
                                 }
                                 
                                 playSound('click');
                                 
                                 // Save the new order
                                 const newOrder = Array.from(libContent.children)
                                     // @ts-ignore
                                     .map(child => child.dataset.url)
                                     .filter(u => u);
                                     
                                 localStorage.setItem('et_library_order', JSON.stringify(newOrder));
                             }
                         }
                     });

                     libContent.appendChild(div);
                 });
              });
         }
    };
    renderBookmarks();

    // --- To-Do Logic ---
    const renderTodos = () => {
        const list = document.getElementById('todoList');
        const todos = JSON.parse(localStorage.getItem('et_todos') || '[]');
        if(!list) return;
        list.innerHTML = '';
        todos.forEach((t, i) => {
             const div = document.createElement('div');
             div.className = 'todo-item' + (t.done ? ' completed' : '');
             div.innerHTML = `<div class="todo-check ${t.done ? 'checked' : ''}"></div><span>${t.text}</span><div class="todo-delete">×</div>`;
             
             div.querySelector('.todo-check').onclick = (e) => {
                 e.stopPropagation();
                 todos[i].done = !todos[i].done;
                 localStorage.setItem('et_todos', JSON.stringify(todos));
                 renderTodos();
             };
             div.querySelector('.todo-delete').onclick = (e) => {
                 e.stopPropagation();
                 playSound('delete');
                 todos.splice(i, 1);
                 localStorage.setItem('et_todos', JSON.stringify(todos));
                 renderTodos();
             };
             list.appendChild(div);
        });
        localStorage.setItem('todos', JSON.stringify(todos)); // Sync for Brief
    };
    
    const addTodoItem = () => {
        const input = document.getElementById('todoInput');
        const val = input.value.trim();
        if(val) {
            playSound('click');
            const todos = JSON.parse(localStorage.getItem('et_todos') || '[]');
            todos.push({ text: val, done: false });
            localStorage.setItem('et_todos', JSON.stringify(todos));
            input.value = '';
            renderTodos();
        }
    };

    document.getElementById('todoAddBtn').addEventListener('click', addTodoItem);
    
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') addTodoItem();
    });
    
    renderTodos();

    // --- Essential Notes Logic (Multi-Note System) ---
    // Migration: Check for old 'et_notes' string
    const migrateNotes = () => {
        const oldNote = localStorage.getItem('et_notes');
        if (oldNote && !localStorage.getItem('et_notes_v2')) {
            const notes = [{
                id: 'note_' + Date.now(),
                title: 'Quick Note',
                content: oldNote,
                date: Date.now()
            }];
            localStorage.setItem('et_notes_v2', JSON.stringify(notes));
            localStorage.removeItem('et_notes');
        }
    };
    migrateNotes();

    let allNotes = JSON.parse(localStorage.getItem('et_notes_v2') || '[]');
    // Fix: Ensure locked notes are locked on reload by clearing temp state
    allNotes.forEach(n => delete n._tempUnlocked);

    if (allNotes.length === 0) {
        allNotes.push({ id: 'note_default', title: 'Welcome', content: 'Welcome to Essential Notes.', date: Date.now() });
    }
    let activeNoteId = allNotes[0].id;
    
    const getLockIcon = () => '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto; opacity:0.7;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

    const renderNoteSidebar = () => {
        const list = document.getElementById('notesList');
        if(!list) return;
        list.innerHTML = '';
        
        // Sort by date desc
        allNotes.sort((a,b) => b.date - a.date);
        
        allNotes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-item' + (note.id === activeNoteId ? ' active' : '');
            const dateStr = new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            div.innerHTML = `
                <div class="note-item-title">${note.title || 'Untitled Note'}</div>
                <div class="note-item-date">
                    ${dateStr}
                    ${note.locked ? getLockIcon() : ''}
                </div>
            `;
            div.onclick = () => {
                // If switching away from a temporarily unlocked note, re-lock it (clear temp flag)
                if (activeNoteId !== note.id) {
                     const prev = allNotes.find(n => n.id === activeNoteId);
                     if(prev && prev._tempUnlocked) prev._tempUnlocked = false; 
                }
                
                activeNoteId = note.id;
                renderNoteSidebar(); // refresh active state
                renderNoteEditor();
            };
            list.appendChild(div);
        });
    };

    const triggerSave = () => {
        saveActiveNote();
        renderNoteSidebar(); 
    };

    const renderNoteEditor = () => {
        const note = allNotes.find(n => n.id === activeNoteId);
        if(!note) return;
        
        const editorContainer = document.querySelector('.notes-editor');
        
        // Locked View Check
        if (note.locked && !note._tempUnlocked) {
            editorContainer.innerHTML = `
                <button id="closeNotes" class="btn-icon absolute-close">×</button>
                <div class="note-locked-view">
                    <div class="lock-icon-large">🔒</div>
                    <h3>This note is locked</h3>
                    <input type="password" id="unlockPassInput" placeholder="Enter Password" class="note-password-input">
                    <button id="unlockBtn" class="file-upload-btn">UNLOCK</button>
                    <div id="hintContainer" class="hidden" style="margin-top:15px; color:#888; font-size:0.8rem; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">Hint: <span id="hintText" style="color:#fff; font-weight:bold;"></span></div>
                    <button id="forgotBtn" class="danger-text-btn" style="margin-top:10px;">Forgot Password?</button>
                </div>
            `;
            
            const closeBtn = document.getElementById('closeNotes');
            if(closeBtn) closeBtn.onclick = () => document.getElementById('essentialNoteModal').classList.remove('open');
            
            const btn = document.getElementById('unlockBtn');
            const inp = document.getElementById('unlockPassInput');
            const forgotBtn = document.getElementById('forgotBtn');
            const hintContainer = document.getElementById('hintContainer');
            const hintText = document.getElementById('hintText');
            
            const tryUnlock = () => {
                if (inp.value === note.password) {
                    note._tempUnlocked = true;
                    renderNoteEditor();
                } else {
                    inp.classList.add('error');
                    setTimeout(() => inp.classList.remove('error'), 500);
                }
            };
            
            btn.onclick = tryUnlock;
            inp.onkeypress = (e) => { if(e.key === 'Enter') tryUnlock(); };
            
            forgotBtn.onclick = () => {
                if (note.passwordHint) {
                    hintText.textContent = note.passwordHint;
                    hintContainer.classList.remove('hidden');
                } else {
                    alert('No password hint was set for this note.');
                }
            };

            setTimeout(() => inp.focus(), 100);
            
            const widgetInput = document.getElementById('widgetNotesInput');
            if(widgetInput) widgetInput.value = "🔒 Note Locked";
            
            return;
        }

        // Standard Editor View (Rich Text)
        // MOVED TOOLBAR TO BOTTOM
        editorContainer.innerHTML = `
            <button id="closeNotes" class="btn-icon absolute-close">×</button>
            <div class="note-editor-header">
                <input type="text" id="noteTitleInput" placeholder="Untitled Note" class="note-title-input">
                <div class="note-meta" id="noteDateDisplay">Last edited: Today</div>
            </div>
            
            <div id="noteContentInput" class="note-content-area rich-editor" contenteditable="true" placeholder="Start typing..."></div>

            <div class="note-toolbar">
                <button class="toolbar-btn" data-cmd="bold" title="Bold"><b>B</b></button>
                <button class="toolbar-btn" data-cmd="italic" title="Italic"><i>I</i></button>
                <button class="toolbar-btn" data-cmd="underline" title="Underline"><u>U</u></button>
                <button class="toolbar-btn" data-cmd="strikeThrough" title="Strikethrough"><s>S</s></button>
                <div class="toolbar-sep"></div>
                <div style="position:relative; width:28px; height:28px; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.2);">
                    <input type="color" id="noteColorPicker" class="toolbar-color" title="Text Color" style="width:150%; height:150%; transform:translate(-25%, -25%); cursor:pointer;">
                </div>
                <div class="toolbar-sep"></div>
                <button class="toolbar-btn" id="noteImgBtn" title="Insert Image">🖼️</button>
                <input type="file" id="noteImgInput" accept="image/*" hidden>
            </div>
            
            <div class="note-editor-footer">
                <span id="noteWordCount">0 words</span>
                <div class="note-footer-actions">
                    <button id="toggleLockBtn" class="file-upload-btn small-btn">${note.locked ? '🔓 UNLOCK' : '🔒 LOCK'}</button>
                    <button id="insertTodoBtn" class="file-upload-btn small-btn">☑ CHECKLIST</button>
                    <button id="deleteNoteBtn" class="small-danger-btn">DELETE</button>
                </div>
            </div>
        `;

        // Re-bind Standard View Listeners
        const closeBtn = document.getElementById('closeNotes');
        if(closeBtn) closeBtn.onclick = () => document.getElementById('essentialNoteModal').classList.remove('open');
        
        const titleInput = document.getElementById('noteTitleInput');
        const contentInput = document.getElementById('noteContentInput');
        const dateDisplay = document.getElementById('noteDateDisplay');
        const wordCount = document.getElementById('noteWordCount');
        const widgetInput = document.getElementById('widgetNotesInput');

        if(titleInput) titleInput.value = note.title;
        
        // Content Loading (Handle legacy plain text)
        if(contentInput) {
            // Check if looks like HTML
            if (note.content && (note.content.includes('<div>') || note.content.includes('<p>') || note.content.includes('<br>') || note.content.includes('<b>'))) {
                contentInput.innerHTML = note.content;
            } else {
                contentInput.innerText = note.content || ''; // Fallback for pure text
            }
        }
        
        if(dateDisplay) dateDisplay.textContent = 'Last edited: ' + new Date(note.date).toLocaleString();
        
        const updateWordCount = () => {
            const text = contentInput.innerText || '';
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            if(wordCount) wordCount.textContent = words + ' words';
            
            // Sync widget (Plain text preview)
            if(widgetInput && !note.locked) widgetInput.value = text;
        };
        updateWordCount();

        // Listeners for Save
        if(titleInput) titleInput.addEventListener('input', () => { clearTimeout(noteTimer); noteTimer = setTimeout(triggerSave, 500); });
        if(contentInput) contentInput.addEventListener('input', () => { 
            updateWordCount();
            clearTimeout(noteTimer); noteTimer = setTimeout(triggerSave, 500); 
        });

        // Toolbar Logic
        document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                // @ts-ignore
                document.execCommand(btn.dataset.cmd, false, null);
                contentInput.focus();
            };
        });
        
        const colorPicker = document.getElementById('noteColorPicker');
        if(colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                // @ts-ignore
                document.execCommand('foreColor', false, e.target.value);
            });
        }
        
        // Image Upload
        const imgBtn = document.getElementById('noteImgBtn');
        const imgInput = document.getElementById('noteImgInput');
        if(imgBtn && imgInput) {
            imgBtn.onclick = () => imgInput.click();
            imgInput.addEventListener('change', (e) => {
                // @ts-ignore
                const file = e.target.files[0];
                if(file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                         document.execCommand('insertImage', false, evt.target.result);
                         triggerSave();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Paste Logic (Images)
        contentInput.addEventListener('paste', (e) => {
             // @ts-ignore
             const items = (e.clipboardData || e.originalEvent.clipboardData).items;
             for (let index in items) {
                 const item = items[index];
                 if (item.kind === 'file' && item.type.includes('image/')) {
                      e.preventDefault();
                      const blob = item.getAsFile();
                      const reader = new FileReader();
                      reader.onload = (event) => {
                          document.execCommand('insertImage', false, event.target.result);
                          triggerSave();
                      };
                      reader.readAsDataURL(blob);
                 }
             }
        });

        // Footer Buttons
        document.getElementById('insertTodoBtn').addEventListener('click', () => {
            contentInput.focus();
            document.execCommand('insertText', false, "\n☐ ");
            triggerSave();
        });

        document.getElementById('deleteNoteBtn').addEventListener('click', () => {
            if(allNotes.length <= 1) { alert("Cannot delete the last note."); return; }
            if(confirm("Delete this note permanently?")) {
                playSound('delete');
                allNotes = allNotes.filter(n => n.id !== activeNoteId);
                activeNoteId = allNotes[0].id;
                localStorage.setItem('et_notes_v2', JSON.stringify(allNotes));
                renderNoteSidebar();
                renderNoteEditor();
            }
        });

        document.getElementById('toggleLockBtn').onclick = () => {
             if (note.locked) {
                 if(confirm("Remove lock from this note?")) {
                     delete note.locked;
                     delete note.password;
                     delete note.passwordHint;
                     delete note._tempUnlocked;
                     saveActiveNote();
                     renderNoteSidebar();
                     renderNoteEditor();
                 }
             } else {
                 const p1 = prompt("Set a password for this note:");
                 if (!p1) return;
                 const p2 = prompt("Confirm password:");
                 if (p1 === p2) {
                     const hint = prompt("Set a password hint (optional):");
                     note.locked = true;
                     note.password = p1;
                     note.passwordHint = hint || "";
                     note._tempUnlocked = true;
                     saveActiveNote();
                     renderNoteSidebar();
                     renderNoteEditor();
                     alert("Note locked.");
                 } else {
                     alert("Passwords do not match.");
                 }
             }
        };
    };

    const saveActiveNote = () => {
        const titleInput = document.getElementById('noteTitleInput');
        const contentInput = document.getElementById('noteContentInput');
        const note = allNotes.find(n => n.id === activeNoteId);
        
        if(note && titleInput && contentInput) {
            // @ts-ignore
            note.title = titleInput.value;
            // @ts-ignore
            note.content = contentInput.innerHTML;
            note.date = Date.now();
            localStorage.setItem('et_notes_v2', JSON.stringify(allNotes));
            
            const dateDisplay = document.getElementById('noteDateDisplay');
            if(dateDisplay) dateDisplay.textContent = 'Last edited: Just now';
            
            // Sync widget (Plain text)
            const widgetInput = document.getElementById('widgetNotesInput');
            // @ts-ignore
            if(widgetInput) widgetInput.value = contentInput.innerText;
        }
    };

    // Debounce save timer var
    let noteTimer;

    // Add New Note
    document.getElementById('addNoteBtn').addEventListener('click', () => {
        const newNote = {
            id: 'note_' + Date.now(),
            title: '',
            content: '',
            date: Date.now()
        };
        allNotes.unshift(newNote);
        activeNoteId = newNote.id;
        localStorage.setItem('et_notes_v2', JSON.stringify(allNotes));
        renderNoteSidebar();
        renderNoteEditor();
        // Focus title
        setTimeout(() => {
             const t = document.getElementById('noteTitleInput');
             if(t) t.focus();
        }, 100);
    });

    // Home Widget Sync (Typing in widget updates active note)
    const widgetNoteInput = document.getElementById('widgetNotesInput');
    if(widgetNoteInput) {
        widgetNoteInput.addEventListener('input', (e) => {
            // Ensure we are editing the 'active' note or default
            const note = allNotes.find(n => n.id === activeNoteId) || allNotes[0];
            
            // Prevent editing via widget if locked
            if (note.locked) {
                e.target.value = "🔒 Note Locked";
                return; 
            }
            
            note.content = e.target.value;
            note.date = Date.now();
            localStorage.setItem('et_notes_v2', JSON.stringify(allNotes));
        });
        
        // Initial load
        const current = allNotes.find(n => n.id === activeNoteId);
        if(current) {
            if(current.locked) widgetNoteInput.value = "🔒 Note Locked";
            else {
                 // Strip HTML for widget preview
                 const tmp = document.createElement("DIV");
                 tmp.innerHTML = current.content;
                 widgetNoteInput.value = tmp.innerText || current.content;
            }
        }
    }

    // Init Notes UI
    renderNoteSidebar();
    renderNoteEditor();

    
    // --- Media Controller System (Robust Version) ---

    const mediaState = {
        title: 'No Audio',
        artist: 'Start media',
        art: '',
        curr: 0,
        dur: 0,
        playing: false,
        domain: '',
        shuffle: false,
        repeat: false
    };

    const resetMediaUI = () => {
        const update = (suffix) => {
            const elTitle = document.getElementById('musicTitle' + suffix);
            const elArtist = document.getElementById('musicArtist' + suffix);
            const elArt = document.getElementById('musicArt' + suffix);
            const elIcon = document.getElementById('musicIcon' + suffix);
            const elProg = document.getElementById('musicProgressFill' + suffix);
            const elPlay = document.getElementById('iconPlay' + suffix);
            const elPause = document.getElementById('iconPause' + suffix);
            const elTimeC = document.getElementById('musicTimeCurrent' + suffix);
            const elTimeT = document.getElementById('musicTimeTotal' + suffix);

            if (elTitle) elTitle.textContent = 'No Audio';
            if (elArtist) elArtist.textContent = 'Start media';
            if (elArt) elArt.src = '';
            if (elIcon) {
                elIcon.classList.remove('has-art', 'active-glow');
                elIcon.style.removeProperty('--current-art');
            }
            if (elProg) elProg.style.width = '0%';
            if (elPlay) elPlay.classList.remove('hidden');
            if (elPause) elPause.classList.add('hidden');
            if (elTimeC) elTimeC.textContent = '0:00';
            if (elTimeT) elTimeT.textContent = '0:00';
        };
        update('');
        update('_sa');
        if (config.ambientMode) document.documentElement.style.removeProperty('--art-url');
        config.currentAudioTabId = null;
    };

    // INJECTED SCRIPT
    const extractionScript = () => {
        const result = {
            title: '',
            artist: '',
            art: '',
            curr: 0,
            dur: 0,
            playing: false,
            domain: window.location.hostname,
            hasMedia: false,
            timestamp: Date.now()
        };

        try {
            // Strategy 1: MediaSession API (Gold Standard)
            if (navigator.mediaSession && navigator.mediaSession.metadata) {
                const md = navigator.mediaSession.metadata;
                result.title = md.title;
                result.artist = md.artist;
                result.hasMedia = true;
                if (md.artwork && md.artwork.length > 0) {
                    // Pick largest
                    const biggest = [...md.artwork].sort((a,b) => {
                        const wA = parseInt(a.sizes?.split('x')[0] || '0');
                        const wB = parseInt(b.sizes?.split('x')[0] || '0');
                        return wB - wA;
                    });
                    result.art = biggest[0].src;
                }
            }

            // Strategy 2: Document Title Parsing (Robust Fallback)
            if (!result.title || result.title.trim() === '') {
                const docTitle = document.title;
                if (result.domain.includes('spotify')) {
                    // "Song • Artist"
                    const parts = docTitle.split(' • ');
                    if (parts.length >= 2) {
                        result.title = parts[0];
                        result.artist = parts[1];
                        result.hasMedia = true;
                    }
                } else if (result.domain.includes('youtube')) {
                    // "(1) Title - YouTube"
                    const clean = docTitle.replace(/^(d+)s+/, '').replace(/ - YouTube$/, '');
                    result.title = clean;
                    result.hasMedia = true;
                } else if (result.domain.includes('soundcloud')) {
                    // "Artist - Song" or "Song by Artist"
                    const parts = docTitle.split(' by ');
                    if (parts.length >= 2) {
                        result.title = parts[0];
                        result.artist = parts[1];
                        result.hasMedia = true;
                    } else {
                         result.title = docTitle;
                    }
                }
            }

            // Strategy 3: DOM Scraper for Time & State
            // Generic Video/Audio
            const media = document.querySelector('video, audio');
            if (media) {
                result.curr = media.currentTime;
                result.dur = media.duration;
                result.playing = !media.paused;
                // If we found a playing video but no metadata, treat as media
                if (!media.paused && !result.hasMedia) {
                     result.hasMedia = true;
                     if(!result.title) result.title = document.title;
                }
            }

            // Spotify Specifics
            if (result.domain.includes('spotify')) {
                const playBtn = document.querySelector('[data-testid="control-button-playpause"]');
                if (playBtn) {
                    const label = playBtn.getAttribute('aria-label') || '';
                    result.playing = label.toLowerCase().includes('pause');
                    result.hasMedia = true;
                }
                
                const posEl = document.querySelector('[data-testid="playback-position"]');
                const durEl = document.querySelector('[data-testid="playback-duration"]');
                const parseT = (t) => {
                    if (!t) return 0;
                    const p = t.split(':').map(Number);
                    if (p.length === 2) return p[0]*60 + p[1];
                    if (p.length === 3) return p[0]*3600 + p[1]*60 + p[2];
                    return 0;
                };
                if(posEl) result.curr = parseT(posEl.textContent);
                if(durEl) result.dur = parseT(durEl.textContent);

                // Fallback Art
                if(!result.art) {
                    const cover = document.querySelector('img[data-testid="cover-art-image"]');
                    if(cover) result.art = cover.src;
                }
            }

            return result;
        } catch (e) {
            return null;
        }
    };

    const updateUI = (data) => {
        const updateInstance = (suffix) => {
            const elTitle = document.getElementById('musicTitle' + suffix);
            const elArtist = document.getElementById('musicArtist' + suffix);
            const elArt = document.getElementById('musicArt' + suffix);
            const elIcon = document.getElementById('musicIcon' + suffix);
            const elProg = document.getElementById('musicProgressFill' + suffix);
            const elPlay = document.getElementById('iconPlay' + suffix);
            const elPause = document.getElementById('iconPause' + suffix);
            const elTimeC = document.getElementById('musicTimeCurrent' + suffix);
            const elTimeT = document.getElementById('musicTimeTotal' + suffix);

            if (elTitle) elTitle.textContent = data.title || 'Unknown Title';
            if (elArtist) elArtist.textContent = data.artist || '';

            // Art
            if (data.art && elArt.src !== data.art) {
                elArt.src = data.art;
                if (elIcon) {
                    elIcon.classList.add('has-art');
                    elIcon.style.setProperty('--current-art', `url("${data.art}")`);
                    if (config.albumGlow) elIcon.classList.add('active-glow');
                }
                if (config.ambientMode) document.documentElement.style.setProperty('--art-url', `url("${data.art}")`);
            } else if (!data.art && data.hasMedia) {
                // Keep existing art if fleeting glitch, else clear
            }

            // Play/Pause
            if (data.playing) {
                elPlay?.classList.add('hidden');
                elPause?.classList.remove('hidden');
            } else {
                elPlay?.classList.remove('hidden');
                elPause?.classList.add('hidden');
            }

            // Time
            const fmt = (s) => {
                if (isNaN(s) || !isFinite(s)) return '0:00';
                const m = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return `${m}:${sec < 10 ? '0' : ''}${sec}`;
            };
            if (elTimeC) elTimeC.textContent = fmt(data.curr);
            if (elTimeT) elTimeT.textContent = fmt(data.dur);

            // Progress
            if (data.dur > 0 && elProg) {
                const pct = Math.min(100, (data.curr / data.dur) * 100);
                elProg.style.width = pct + '%';
            }
        };

        updateInstance('');
        updateInstance('_sa');
        
        const card = document.getElementById('widget-music');
        if (card) {
            if (data.domain.includes('spotify')) card.classList.add('spotify-mode');
            else card.classList.remove('spotify-mode');
        }
    };

    const loop = () => {
        if (!chrome.tabs || !chrome.scripting) return;

        // Priority 1: Audible Tabs
        chrome.tabs.query({ audible: true }, (tabs) => {
            const valid = tabs.filter(t => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('edge'));
            if (valid.length > 0) {
                queryTab(valid[0]);
            } else {
                // Priority 2: Known Music Domains (even if not audible/paused)
                chrome.tabs.query({
                    url: [
                        "*://*.spotify.com/*",
                        "*://*.youtube.com/*",
                        "*://*.soundcloud.com/*",
                        "*://music.apple.com/*",
                        "*://*.deezer.com/*",
                        "*://*.tidal.com/*"
                    ]
                }, (musicTabs) => {
                    if (musicTabs.length > 0) {
                        // Sort by last accessed to get the most recent one
                        musicTabs.sort((a, b) => b.lastAccessed - a.lastAccessed);
                        queryTab(musicTabs[0]);
                    } else {
                        resetMediaUI();
                    }
                });
            }
        });
    };

    const queryTab = (tab) => {
        if (!tab || !tab.id) return;
        config.currentAudioTabId = tab.id;

        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true }, // Check all frames (iframes)
            world: 'MAIN', // Required for MediaSession
            func: extractionScript
        }, (results) => {
            if (chrome.runtime.lastError) return;

            // Find the best result among frames
            // Usually the main frame (frameId 0) has the MediaSession, but iframe might have the <video>
            if (results && results.length > 0) {
                // Prioritize results that haveMedia = true
                const best = results.find(r => r.result && r.result.hasMedia);
                if (best) {
                    updateUI(best.result);
                } else if (results[0].result) {
                     // Fallback to main frame result even if empty, to clear UI if needed? 
                     // No, better to hold state if nothing found to avoid flickering
                }
            }
        });
    };

    setInterval(loop, 1000);
    setTimeout(loop, 100);

    // --- Controls ---
    const sendCommand = (action) => {
        if (!config.currentAudioTabId) return;
        chrome.scripting.executeScript({
            target: { tabId: config.currentAudioTabId },
            world: 'MAIN',
            func: (act) => {
                const isSpotify = window.location.hostname.includes('spotify');
                if (isSpotify) {
                    const map = {
                        'play': '[data-testid="control-button-playpause"]',
                        'next': '[data-testid="control-button-skip-forward"]',
                        'prev': '[data-testid="control-button-skip-back"]',
                        'shuffle': '[data-testid="control-button-shuffle"]',
                        'repeat': '[data-testid="control-button-repeat"]'
                    };
                    const btn = document.querySelector(map[act]);
                    if (btn) btn.click();
                } else {
                    const v = document.querySelector('video, audio');
                    if (v) {
                        if (act === 'play') v.paused ? v.play() : v.pause();
                        if (act === 'next') v.currentTime += 10;
                        if (act === 'prev') v.currentTime -= 10;
                    }
                }
            },
            args: [action]
        });
        setTimeout(loop, 200);
    };

    const bind = (id, act) => {
        const el = document.getElementById(id);
        if (el) el.onclick = (e) => { e.stopPropagation(); sendCommand(act); };
    };
    bind('btnPlayPause', 'play');
    bind('btnNext', 'next');
    bind('btnPrev', 'prev');
    bind('btnPlayPause_sa', 'play');
    bind('btnNext_sa', 'next');
    bind('btnPrev_sa', 'prev');
    bind('btnShuffle_sa', 'shuffle');
    bind('btnRepeat_sa', 'repeat');

    
    // --- Grid Initialization ---
    const updateHeaderIcons = () => {
        const briefBtn = document.getElementById('morningBriefBtn');
        const editBtn = document.getElementById('editToggle');
        
        // Handle Visibility based on config
        if (config.briefButtonLocation === 'homepage') {
            briefBtn.classList.remove('hidden');
        } else {
            briefBtn.classList.add('hidden');
        }
        
        if (config.emojiIcons) {
             briefBtn.innerHTML = '<span style="font-size: 20px;">☀️</span>';
             editBtn.innerHTML = '<span style="font-size: 20px;">🖋️</span>';
        } else {
             briefBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12,3V4M5.64,5.64l.7.7M3,12H4m1.64,6.36.7-.7M12,21V20m6.36-1.64-.7-.7M21,12H20M18.36,5.64l-.7.7"/><circle cx="12" cy="12" r="4"/></svg>';
             editBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
        }
    };

    const initGridWidgets = () => {
        config.layoutOrder.forEach(id => {
            const el = document.getElementById(id);
            if (el) { gridContainer.appendChild(el); el.classList.remove('hidden'); }
        });
        config.hiddenWidgets.forEach(id => {
            const el = document.getElementById(id);
            if (el) { drawerContent.appendChild(el); el.classList.remove('hidden'); }
        });
        
        if (config.sidebarWidget) {
            const el = document.getElementById(config.sidebarWidget);
            if (el) {
                sidebarContainer.insertBefore(el, sidebarPlaceholder);
                el.classList.remove('hidden');
                el.classList.add('sidebar-mode');
                sidebarPlaceholder.classList.add('hidden');
            }
        }

        if (config.searchHalfWidth) {
            const ws = document.getElementById('widget-search');
            if(ws) ws.classList.add('half-width');
        }

        updateHeaderIcons();
    };
    initGridWidgets();

    const saveLayout = () => {
        const order = Array.from(gridContainer.children).filter(c => c.classList.contains('widget')).map(c => c.id);
        const hidden = Array.from(drawerContent.children).filter(c => c.classList.contains('widget')).map(c => c.id);
        
        const sidebarW = Array.from(sidebarContainer.children).find(c => c.classList.contains('widget'));
        if (sidebarW) {
            localStorage.setItem('et_sidebar_widget', sidebarW.id);
            config.sidebarWidget = sidebarW.id;
            sidebarPlaceholder.classList.add('hidden');
        } else {
            localStorage.removeItem('et_sidebar_widget');
            config.sidebarWidget = null;
            sidebarPlaceholder.classList.remove('hidden');
        }

        localStorage.setItem('et_layout', JSON.stringify(order));
        localStorage.setItem('et_hidden', JSON.stringify(hidden));
        config.hiddenWidgets = hidden;
    };

    // --- Drag & Drop ---
    const widgets = document.querySelectorAll('.widget');
    const cleanWidgetOnDrop = (widget) => {
        widget.classList.remove('dragging', 'sidebar-mode', 'expanded');
        if(widget.id === 'widget-music') widget.classList.remove('sidebar-mode');
    };

    widgets.forEach(w => {
        w.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', w.id);
            e.dataTransfer.effectAllowed = 'move';
            w.classList.add('dragging');
            document.body.classList.add('is-dragging');
        });
        w.addEventListener('dragend', () => {
             w.classList.remove('dragging');
             document.body.classList.remove('is-dragging');
             document.querySelectorAll('.widget').forEach(el => el.classList.remove('dragging'));
        });
    });

    const checkGridLimit = () => {
        const count = Array.from(gridContainer.children).filter(c => c.classList.contains('widget')).length;
        if (count >= 5) {
            alert('Main Grid is full (Max 5). Remove a widget first.');
            return false;
        }
        return true;
    };

    const animateDrop = (draggable, e) => {
        // Simple FLIP-like animation for drop
        const finalRect = draggable.getBoundingClientRect();
        
        // Calculate offset from mouse position to new element center
        // Note: Drag event clientX/Y is where the mouse is. 
        // We assume the user was dragging the element roughly by its center or just animate from mouse.
        const x = e.clientX - (finalRect.left + finalRect.width/2);
        const y = e.clientY - (finalRect.top + finalRect.height/2);

        // Apply instant offset
        draggable.style.transition = 'none';
        draggable.style.transform = `translate(${x}px, ${y}px)`;
        
        // Force reflow
        void draggable.offsetWidth;

        // Animate to zero
        requestAnimationFrame(() => {
            draggable.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            draggable.style.transform = 'translate(0, 0)';
            
            // Cleanup
            setTimeout(() => {
                draggable.style.transition = '';
                draggable.style.transform = '';
            }, 400);
        });
    };

    const handleDrop = (e, container) => {
        e.preventDefault();
        
        if (e.dataTransfer.getData('type') === 'sticker') {
            if (container !== document.body && container !== stickerLayer) return;
            const type = e.dataTransfer.getData('stickerType');
            const src = e.dataTransfer.getData('stickerSrc');
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            config.stickers.push({
                id: 'st_' + Date.now(),
                type, src, x, y, rotation: 0
            });
            localStorage.setItem('et_stickers', JSON.stringify(config.stickers));
            renderStickers();
            return;
        }

        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        if (!draggable) return;

        cleanWidgetOnDrop(draggable);
        document.body.classList.remove('is-dragging');
        draggable.classList.remove('dragging');

        if (container === gridContainer) {
             if (draggable.parentElement !== gridContainer && !checkGridLimit()) return;
             const afterElement = getDragAfterElement(gridContainer, e.clientY);
             if (afterElement == null) gridContainer.appendChild(draggable);
             else gridContainer.insertBefore(draggable, afterElement);
        } else if (container === drawerContent) {
            drawerContent.appendChild(draggable);
        } else if (container.id === 'dropZone') {
            drawerContent.appendChild(draggable);
        }
        
        // Trigger Animation
        animateDrop(draggable, e);

        saveLayout();
    };

    [gridContainer, drawerContent, document.getElementById('dropZone')].forEach(c => {
        c.addEventListener('dragover', e => e.preventDefault());
        c.addEventListener('drop', e => handleDrop(e, c));
    });
    
    document.body.addEventListener('dragover', e => {
        if(e.dataTransfer.types.includes('type')) e.preventDefault();
    });
    document.body.addEventListener('drop', e => handleDrop(e, document.body));

    sidebarContainer.addEventListener('dragover', e => e.preventDefault());
    sidebarContainer.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        
        if (id !== 'widget-music') {
            alert('Only the Music Widget can be placed in the sidebar.');
            return;
        }
        
        cleanWidgetOnDrop(draggable);
        draggable.classList.remove('dragging');
        document.body.classList.remove('is-dragging');
        draggable.classList.add('sidebar-mode');
        sidebarContainer.insertBefore(draggable, sidebarPlaceholder);
        animateDrop(draggable, e);
        saveLayout();
    });
    
    sidebarPlaceholder.addEventListener('click', () => {
        const musicW = document.getElementById('widget-music');
        if (musicW) {
            cleanWidgetOnDrop(musicW);
            musicW.classList.add('sidebar-mode');
            sidebarContainer.insertBefore(musicW, sidebarPlaceholder);
            saveLayout();
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Edit Mode ---
    const restoreDrawerBtn = document.getElementById('restoreDrawerBtn');
    
    const toggleEditMode = () => {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode', isEditMode);
        document.querySelectorAll('.widget').forEach(w => w.setAttribute('draggable', isEditMode));
        
        if (isEditMode) {
            widgetDrawer.classList.add('open');
            restoreDrawerBtn.classList.remove('visible');
        } else {
            widgetDrawer.classList.remove('open');
            restoreDrawerBtn.classList.remove('visible');
        }
        renderStickers();
    };
    
    // Drawer Minimize/Restore Logic
    const minimizeBtn = document.getElementById('minimizeDrawer');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            playSound('click');
            widgetDrawer.classList.remove('open');
            if (isEditMode) restoreDrawerBtn.classList.add('visible');
        });
    }

    if (restoreDrawerBtn) {
        restoreDrawerBtn.addEventListener('click', () => {
            playSound('click');
            widgetDrawer.classList.add('open');
            restoreDrawerBtn.classList.remove('visible');
        });
    }
    
    // Drawer Tab Switcher Logic
    const drawerTabs = document.querySelectorAll('.tab-btn');
    drawerTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            drawerTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.tab;
            if (target === 'widgets') {
                document.getElementById('drawerContent').classList.add('active');
                document.getElementById('stickerContent').classList.remove('active');
            } else {
                document.getElementById('drawerContent').classList.remove('active');
                document.getElementById('stickerContent').classList.add('active');
            }
        });
    });
    
    closeDrawerBtn.addEventListener('click', () => { 
        playSound('click'); 
        if (isEditMode) toggleEditMode(); 
        else widgetDrawer.classList.remove('open'); 
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => { playSound('click'); e.stopPropagation(); drawerContent.appendChild(btn.closest('.widget')); saveLayout(); }));
    document.getElementById('editToggle').addEventListener('click', () => { playSound('click'); toggleEditMode(); });

    // --- Search Engine Logic ---
    const esPath = "M91.98068,59.169153l7.067065-5.021545l46.903333,78.784042c3.124999,4.023612,10.089041,3.079154,13.928083,0L199.99204,92.928103l7.799727,7.242603-28.400158,28.090279c-6.88496,6.430843-3.442558,14.251851,4.021844,16.596337h76.415046l-.804369,11.483982h-80.43689c-7.012442-.434553-13.081631,5.385832-9.652427,13.692438l38.609707,70.034521-8.848058,6.434952-43.112192-76.469473c-2.349033-4.365619-6.239713-10.1303-13.69244-4.416916L99.047745,207.577528l-7.067065-6.625374l30.918411-30.918412c6.29957-5.992659,8.509037-13.55046-5.74199-13.692438h-75.970955v-11.483982l86.129862.883383c9.04236.104468,12.219264-6.566534,7.067066-12.809055L91.98068,59.169153Z";
    
    // Standard icon (white/current color)
    const esSvgBase = `<svg viewBox="0 0 300 300" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="${esPath}"/></svg>`;
    
    // Yellow icon for active state
    const esSvgYellow = `<svg viewBox="0 0 300 300" width="20" height="20" fill="#FFD700" xmlns="http://www.w3.org/2000/svg"><path d="${esPath}"/></svg>`;

    const engines = [
        { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/s2/favicons?sz=64&domain=google.com' },
        { name: 'Essential', url: '#', icon: esSvgBase },
        { name: 'Gemini', url: 'https://gemini.google.com/app?q=', icon: 'https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com' },
        { name: 'ChatGPT', url: 'https://chat.openai.com/?q=', icon: 'https://www.google.com/s2/favicons?sz=64&domain=openai.com' },
        { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', icon: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com' },
        { name: 'Spotify', url: 'https://open.spotify.com/search/', icon: 'https://www.google.com/s2/favicons?sz=64&domain=spotify.com' }
    ];

    let currentEngine = localStorage.getItem('et_engine') || 'Google';
    
    const renderSearchOptions = () => {
        const list = document.getElementById('engineOptions');
        const currentIcon = document.getElementById('currentEngineIconContainer');
        if(!list || !currentIcon) return;
        
        list.innerHTML = '';
        const active = engines.find(e => e.name === currentEngine) || engines[0];
        
        // Render Active Icon
        if (active.name === 'Essential') {
             currentIcon.innerHTML = esSvgYellow; // Yellow in search bar
        } else {
             currentIcon.innerHTML = `<img src="${active.icon}" width="18" height="18" style="border-radius:4px;">`;
        }
        
        engines.forEach(eng => {
            const div = document.createElement('div');
            div.className = 'option-item';
            
            // Icon logic for list items
            const iconHTML = eng.name === 'Essential' 
                ? esSvgBase // Standard in list until hovered
                : `<img src="${eng.icon}" width="18" height="18" style="border-radius:4px;">`;
                
            div.innerHTML = `${iconHTML} <span>${eng.name}</span>`;
            
            // Hover Effect for Essential
            if (eng.name === 'Essential') {
                div.onmouseenter = () => { 
                    div.style.color = '#FFD700'; 
                    div.querySelector('svg').style.fill = '#FFD700';
                };
                div.onmouseleave = () => { 
                    div.style.color = ''; 
                    div.querySelector('svg').style.fill = 'currentColor';
                };
            }

            div.onclick = (e) => {
                e.stopPropagation();
                currentEngine = eng.name;
                localStorage.setItem('et_engine', eng.name);
                renderSearchOptions();
                
                const sel = document.getElementById('searchSelect');
                if (sel) sel.classList.remove('active');
                
                // Reset Z-Index
                const searchWidget = document.getElementById('widget-search');
                if(searchWidget) searchWidget.style.zIndex = '';
            };
            list.appendChild(div);
        });
    };
    
    renderSearchOptions();
    
    document.getElementById('searchSelect').addEventListener('click', (e) => {
        e.stopPropagation();
        const sel = document.getElementById('searchSelect');
        sel.classList.toggle('active');
        
        // Fix for Dock Overlap: Increase Z-Index when dropdown is open
        const searchWidget = document.getElementById('widget-search');
        if (searchWidget) {
            if (sel.classList.contains('active')) {
                searchWidget.style.zIndex = '999';
            } else {
                searchWidget.style.zIndex = '';
            }
        }
    });
    
    document.addEventListener('click', () => {
        const sel = document.getElementById('searchSelect');
        if (sel) sel.classList.remove('active');
        const searchWidget = document.getElementById('widget-search');
        if (searchWidget) searchWidget.style.zIndex = '';
    });
    
    // --- Essential Search Logic ---
    const performEssentialSearch = async (query) => {
        const overlay = document.getElementById('essentialSearchOverlay');
        const content = document.getElementById('esContent');
        const qDisplay = document.getElementById('esQueryDisplay');
        const key = config.geminiApiKey;
        const modelName = config.geminiModel === 'flash' ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
        
        if (!key) {
            alert('Please configure your Gemini API Key in Settings > Experimental > AI Configuration.');
            return;
        }
        
        // Reset UI
        overlay.classList.add('active');
        qDisplay.textContent = query;
        content.innerHTML = '<span class="typing-cursor">Thinking...</span>';
        
        try {
            // Explicit prompt for latex
            const systemContext = "You are Essential Search, a helpful AI assistant. Use LaTeX for math. Use $...$ for inline math (e.g. $E=mc^2$) and $$...$$ for block math.";
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemContext + " Answer: " + query }] }]
                })
            });
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                let text = data.candidates[0].content.parts[0].text;
                content.innerHTML = ''; // Clear loading

                // 1. Identify and Pre-render Math
                // We use a unique placeholder strategy to protect math and render it upfront.
                // This ensures math is fully formed when it appears in the typewriter animation.
                const renderedMathMap = new Map();
                let mathCounter = 0;

                // Regex: Block math ($$...$$) then Inline math ($...$)
                // Note: inline math regex avoids matching across lines to prevent false positives in normal text, unless Gemini wraps lines.
                // We assume Gemini returns valid latex.
                const mathRegex = /(\$\$[\s\S]*?\$\$)|(\$[^\n\$]*?\$)/g;
                
                text = text.replace(mathRegex, (match) => {
                    const id = `___MATH_${mathCounter++}___`;
                    let rendered = match; // fallback
                    try {
                        // Strip delimiters for KaTeX
                        let clean = match;
                        let display = false;
                        if (match.startsWith('$$')) {
                            clean = match.slice(2, -2);
                            display = true;
                        } else {
                            clean = match.slice(1, -1);
                        }
                        
                        if (window.katex) {
                            rendered = window.katex.renderToString(clean, {
                                displayMode: display,
                                throwOnError: false
                            });
                        }
                    } catch (e) { console.warn('KaTeX render error', e); }
                    
                    renderedMathMap.set(id, rendered);
                    return id;
                });

                // 2. Standard Markdown Formatting
                // We do this AFTER extracting math to ensure * in math isn't mistaken for italics
                text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                text = text.replace(/^\* /gm, '• ');
                text = text.replace(/(?<!\*)\*(?![\s\*])(.*?)(?<![\s\*])\*(?!\*)/g, '<i>$1</i>');
                text = text.replace(/\n/g, '<br>');

                // 3. Typewriter Effect
                // We split the text by math placeholders to handle them as "Atomic Blocks"
                const segments = text.split(/(___MATH_\d+___)/g);
                
                let containerBuffer = document.createElement('div');
                content.appendChild(containerBuffer);

                const typeSegment = async (segment) => {
                    if (renderedMathMap.has(segment)) {
                        // INSTANTLY append the pre-rendered math HTML
                        // This fixes the "convert after" visual glitch
                        const span = document.createElement('span');
                        span.innerHTML = renderedMathMap.get(segment);
                        containerBuffer.appendChild(span);
                        // Small pause after math for rhythm
                        await new Promise(r => setTimeout(r, 50));
                    } else {
                        // Standard Typewriter for text/html tags
                        // We tokenize by HTML tags to prevent breaking them
                        const tokens = segment.split(/(<[^>]+>)/g);
                        
                        for (let token of tokens) {
                            if (token.startsWith('<')) {
                                // Append tag instantly
                                containerBuffer.innerHTML += token;
                            } else {
                                // Type text chars
                                for (let i = 0; i < token.length; i++) {
                                    containerBuffer.innerHTML += token[i];
                                    // Scroll to bottom
                                    content.scrollTop = content.scrollHeight;
                                    await new Promise(r => setTimeout(r, 10)); // Speed
                                }
                            }
                        }
                    }
                };

                // Execute Sequence
                (async () => {
                    for (const segment of segments) {
                        if(segment) await typeSegment(segment);
                    }
                })();

            } else {
                 content.textContent = "Error: Could not retrieve a response from Gemini.";
            }
        } catch (e) {
            content.textContent = "Error: Network or API Key issue. Check console.";
            console.error(e);
        }
    };
    
    document.getElementById('closeEsBtn').addEventListener('click', () => {
        document.getElementById('essentialSearchOverlay').classList.remove('active');
    });

    const handleSearch = () => {
        const val = document.getElementById('searchInput').value.trim();
        if(val) {
            const eng = engines.find(e => e.name === currentEngine) || engines[0];
            
            if (eng.name === 'Essential') {
                performEssentialSearch(val);
            } else {
                window.location.href = eng.url + encodeURIComponent(val);
            }
        }
    };
    
    document.getElementById('searchSubmit').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSearch();
    });

    const suggestionInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('searchSuggestions');
    
    let debounceTimer;
    suggestionInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        if(query.length < 1) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        debounceTimer = setTimeout(async () => {
            try {
                // Using a proxy or direct if permissions allow
                const res = await fetch('https://suggestqueries.google.com/complete/search?client=firefox&q=' + encodeURIComponent(query));
                const data = await res.json();
                const suggestions = data[1];
                
                if(suggestions && suggestions.length > 0) {
                    suggestionsList.innerHTML = '';
                    suggestions.slice(0, 5).forEach(s => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.innerText = s;
                        div.onclick = () => {
                            suggestionInput.value = s;
                            suggestionsList.style.display = 'none';
                            handleSearch();
                        };
                        suggestionsList.appendChild(div);
                    });
                    suggestionsList.style.display = 'flex';
                } else {
                    suggestionsList.style.display = 'none';
                }
            } catch(e) { }
        }, 200);
    });
    
    document.addEventListener('click', (e) => {
        if(!suggestionInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.style.display = 'none';
        }
    });

    // --- Search Resize ---
    const searchResize = document.getElementById('searchResizeHandle');
    if (searchResize) {
        searchResize.addEventListener('click', (e) => {
            playSound('click');
            e.stopPropagation();
            const w = document.getElementById('widget-search');
            w.classList.toggle('half-width');
            localStorage.setItem('et_search_half', w.classList.contains('half-width'));
        });
    }

    // --- Context Menu ---
    const ctxMenu = document.getElementById('contextMenu');
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.widget') || e.target.closest('.dock-item')) return;
        e.preventDefault();
        ctxMenu.style.top = e.clientY + 'px';
        ctxMenu.style.left = e.clientX + 'px';
        ctxMenu.classList.add('active');
        
        ctxMenu.innerHTML = '';
        const addItem = (label, action) => {
            const div = document.createElement('div'); div.className = 'ctx-item';
            div.textContent = label; div.onclick = () => { action(); ctxMenu.classList.remove('active'); };
            ctxMenu.appendChild(div);
        };
        
        addItem('Edit Layout', toggleEditMode);
        addItem('Change Wallpaper', () => { document.getElementById('settingsModal').classList.add('open'); document.querySelector('[data-target="tab-appearance"]').click(); });
        addItem('Toggle Dock', () => {
            config.showDock = !config.showDock;
            localStorage.setItem('et_dock', config.showDock);
            document.getElementById('dockToggle').checked = config.showDock;
            // renderDock is no longer called here to prevent dependency issues, 
            // the setting in panel will handle it or reload is required if closed
            // OR we rely on the main settings panel update.
            // For now, simple reload of page or just trigger via setting panel is safer.
            // But to keep context menu functional, we can trigger the toggle in settings.
            const dt = document.getElementById('dockToggle');
            if(dt) { dt.checked = config.showDock; dt.dispatchEvent(new Event('change')); }
        });
        if (config.experimental) {
            addItem('Confetti!', startConfetti);
        }
    });
    
    document.addEventListener('click', () => ctxMenu.classList.remove('active'));

    const startConfetti = () => {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.classList.add('active');
        
        const particles = [];
        const colors = ['#d71921', '#ffffff', '#ff0000', '#222222', '#888888'];
        
        for(let i=0; i<400; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 25,
                vy: (Math.random() - 0.5) * 25,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 150,
                decay: Math.random() * 0.5 + 0.5
            });
        }
        
        const draw = () => {
            if(!canvas.classList.contains('active')) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                if(p.life > 0) {
                    active = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.4;
                    p.vx *= 0.95;
                    p.vy *= 0.95;
                    p.life -= p.decay;
                    
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    ctx.fill();
                }
            });
            if(active) requestAnimationFrame(draw);
            else {
                canvas.classList.remove('active');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        draw();
    };

    // --- Branding Easter Egg ---
    const brandLogo = document.getElementById('brandLogo');
    let clickCount = 0;
    let clickTimer;
    
    if (brandLogo) {
        brandLogo.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
            
            if (clickCount === 5) {
                document.body.classList.toggle('retro-mode');
                playSound('click');
                clickCount = 0;
            }
        });
    }

    // --- Modals ---
    const aboutModal = document.getElementById('aboutModal');
    const changelogModal = document.getElementById('changelogModal');
    
    document.getElementById('openAboutBtn').onclick = () => aboutModal.classList.add('open');
    document.getElementById('closeAbout').onclick = () => aboutModal.classList.remove('open');
    
    document.getElementById('openChangelogBtn').onclick = () => {
        const content = document.getElementById('changelogContent');
        content.innerHTML = '<div class="timeline">' + changelogs.map(log => `
            <div class="timeline-item">
                <div class="timeline-ver">v${log.version}</div>
                <div class="timeline-changes">${log.changes.map(c => '• ' + c).join('<br>')}</div>
            </div>
        `).join('') + '</div>';
        changelogModal.classList.add('open');
    };
    document.getElementById('closeChangelog').onclick = () => changelogModal.classList.remove('open');

    
    // --- Dock Logic ---
    const dock = document.getElementById('dock');
    const dockContainer = document.getElementById('dockContainer');

    const renderDock = () => {
        dock.innerHTML = '';
        if (config.showDock) dockContainer.classList.remove('hidden'); else dockContainer.classList.add('hidden');
        if (config.dockMagnification) dockContainer.classList.add('dock-magnify-active'); else dockContainer.classList.remove('dock-magnify-active');
        
        const createTooltip = (text) => {
            if(!config.dockHoverName) return '';
            return `<div class="dock-tooltip">${text}</div>`;
        };
        
        const addBtn = (svg, emoji, text, onClick) => {
            const div = document.createElement('div'); div.className = 'dock-item';
            div.innerHTML = (config.emojiIcons ? '<span style="font-size:22px;">' + emoji + '</span>' : svg) + createTooltip(text); 
            div.onclick = onClick; dock.appendChild(div);
        };
        
        if (config.briefButtonLocation === 'dock') {
            addBtn(
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12,3V4M5.64,5.64l.7.7M3,12H4m1.64,6.36.7-.7M12,21V20m6.36-1.64-.7-.7M21,12H20M18.36,5.64l-.7.7"/><circle cx="12" cy="12" r="4"/></svg>',
                '☀️', 'Brief',
                () => { playSound('click'); openBrief(); }
            );
        }

        addBtn(
            '<svg viewBox="0 0 300 300" width="24" height="24" fill="currentColor"><path d="M119.67381,25.00297h154.90224l.72048,250.05357-250.005-1.44123-.35764-154.43158l94.73992-94.18076ZM67.228464,119.18373h70.411985v-69.745528L67.228464,119.18373ZM52.324191,250.93633h195.428618v-105.617978h-195.428618v105.617978Z"/></svg>', 
            '📝', 'Notes',
            () => {
                const el = document.getElementById('essentialNoteModal');
                if(el) el.classList.toggle('open');
            }
        );
        addBtn(
            '<svg viewBox="0 0 0.72 0.72" fill="currentColor" width="24" height="24"><path d="M0.54 0.06H0.18a0.06 0.06 0 0 0 -0.06 0.06v0.51a0.03 0.03 0 0 0 0.015 0.026 0.03 0.03 0 0 0 0.03 0l0.195 -0.111 0.195 0.112a0.03 0.03 0 0 0 0.015 0.004 0.027 0.027 0 0 0 0.015 -0.004A0.03 0.03 0 0 0 0.6 0.63V0.12a0.06 0.06 0 0 0 -0.06 -0.06"/></svg>',
            '🔖', 'Library',
            () => {
                const el = document.getElementById('libraryModal');
                if(el) el.classList.toggle('open');
            }
        );

        pinnedItems.forEach((item, idx) => {
            const div = document.createElement('div'); div.className = 'dock-item';
            div.onclick = () => window.location.href = item.url;
            div.oncontextmenu = (e) => {
                e.preventDefault();
                if(confirm('Remove ' + item.title + ' from dock?')) {
                    pinnedItems.splice(idx, 1);
                    localStorage.setItem('et_pinned', JSON.stringify(pinnedItems));
                    renderDock();
                }
            };
            const img = document.createElement('img'); img.src = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + item.url;
            div.appendChild(img); 
            if(config.dockHoverName) div.innerHTML += createTooltip(item.title);
            dock.appendChild(div);
        });

        const setBtn = document.createElement('div'); setBtn.className = 'dock-item';
        setBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z"/></svg>' + createTooltip('Settings');
        setBtn.onclick = () => { 
            playSound('click'); 
            if(settingsModal.classList.contains('open')) {
                settingsModal.classList.remove('open');
                setTimeout(() => {
                    settingsModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
                    settingsModal.style.top = '50%';
                    settingsModal.style.left = '50%';
                }, 300);
            } else {
                settingsModal.classList.add('open'); 
            }
        };
        dock.appendChild(setBtn);
        
        renderDockSettings();
    };
    
    // Spring Physics Logic
    let dockRaf = null;
    let dockMouseX = null;

    const updateDockPhysics = () => {
        const items = dock.querySelectorAll('.dock-item');
        let isMoving = false;
        
        items.forEach(item => {
            // Init physics state if missing
            if(!item.physics) item.physics = { scale: 1, vel: 0, target: 1 };
            
            const p = item.physics;
            
            // Calculate Target Scale
            let target = 1;
            if (dockMouseX !== null && config.dockMagnification) {
                const rect = item.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const dist = Math.abs(dockMouseX - cx);
                const range = 150; // Influence range
                
                if (dist < range) {
                    const val = Math.cos((dist / range) * (Math.PI / 2)); 
                    target = 1 + (config.dockMagStrength * Math.pow(val, 2));
                }
            }
            p.target = target;
            
            // Spring Physics: acceleration = force * mass - velocity * damping
            const k = 0.15; // Stiffness (Acceleration)
            const d = 0.5; // Damping (Increased friction to reduce bounce)
            
            const accel = (p.target - p.scale) * k;
            p.vel += accel;
            p.vel *= d;
            p.scale += p.vel;
            
            // Resting Threshold
            if(Math.abs(p.scale - p.target) < 0.001 && Math.abs(p.vel) < 0.001) {
                p.scale = p.target;
                p.vel = 0;
            } else {
                isMoving = true;
            }
            
            // Apply Transforms
            if(Math.abs(p.scale - 1) > 0.001) {
                 item.style.transform = `scale(${p.scale}) translateY(${(p.scale - 1) * -15}px)`;
                 item.style.margin = `0 ${(p.scale - 1) * 10}px`;
            } else {
                 item.style.transform = '';
                 item.style.margin = '';
            }
        });
        
        if(isMoving || dockMouseX !== null) {
            dockRaf = requestAnimationFrame(updateDockPhysics);
        } else {
            cancelAnimationFrame(dockRaf);
            dockRaf = null;
        }
    };

    const handleDockMove = (e) => {
        if(!config.dockMagnification) return;
        if(dockMouseX === null) {
            dockMouseX = e.clientX;
            // Start Loop
            if (!dockRaf) dockRaf = requestAnimationFrame(updateDockPhysics);
        } else {
            dockMouseX = e.clientX;
        }
    };
    
    const handleDockLeave = () => {
        dockMouseX = null;
        // Loop continues until isMoving is false (settled back to 1)
    };
    
    // Attach Wave Listeners
    dock.addEventListener('mousemove', handleDockMove);
    dock.addEventListener('mouseleave', handleDockLeave);

    const renderDockSettings = () => {
        const list = document.getElementById('dockSettingsList');
        if(!list) return;
        list.innerHTML = '';
        
        // Ensure Mag Slider Visibility
        const magRow = document.getElementById('dockMagRow');
        if(magRow) {
            if(config.dockMagnification) magRow.classList.remove('hidden');
            else magRow.classList.add('hidden');
        }

        const dockTab = document.getElementById('tab-dock');
        if(dockTab && !document.getElementById('dockMagToggle')) {
            const section = dockTab.querySelector('.setting-section');
            if(section) {
                const addToggle = (id, label, checked, cb) => {
                    const row = document.createElement('div');
                    row.className = 'setting-row';
                    row.innerHTML = `<span class="setting-label">${label}</span><label class="switch"><input type="checkbox" id="${id}"><span class="slider round"></span></label>`;
                    const ref = section.querySelector('.setting-row:nth-child(2)'); // Insert after 'Show Dock'
                    if(ref) section.insertBefore(row, ref.nextSibling);
                    else section.appendChild(row);
                    
                    const el = document.getElementById(id);
                    el.checked = checked;
                    el.addEventListener('change', cb);
                };
                
                addToggle('dockMagToggle', 'MAGNIFICATION EFFECT', config.dockMagnification, (e) => {
                     playSound('click');
                     config.dockMagnification = e.target.checked;
                     localStorage.setItem('et_dock_mag', config.dockMagnification);
                     renderDock();
                     const r = document.getElementById('dockMagRow');
                     if(r) { if(config.dockMagnification) r.classList.remove('hidden'); else r.classList.add('hidden'); }
                });
                
                addToggle('dockNamesToggle', 'HOVER NAMES', config.dockHoverName, (e) => {
                     playSound('click');
                     config.dockHoverName = e.target.checked;
                     localStorage.setItem('et_dock_names', config.dockHoverName);
                     renderDock();
                });
            }
        }

        pinnedItems.forEach((item, idx) => {
            const div = document.createElement('div'); div.className = 'dock-setting-item';
            div.innerHTML = `<div class="dock-setting-info"><img src="https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}"><span>${item.title}</span></div>
            <div class="dock-setting-controls">
                <div class="dock-ctrl-btn up" title="Move Up">↑</div>
                <div class="dock-ctrl-btn down" title="Move Down">↓</div>
                <div class="dock-ctrl-btn delete" title="Delete">×</div>
            </div>`;
            
            const up = div.querySelector('.up');
            const down = div.querySelector('.down');
            const del = div.querySelector('.delete');
            
            up.onclick = () => {
                if(idx > 0) {
                    playSound('click');
                    [pinnedItems[idx], pinnedItems[idx-1]] = [pinnedItems[idx-1], pinnedItems[idx]];
                    localStorage.setItem('et_pinned', JSON.stringify(pinnedItems));
                    renderDock();
                }
            };
            down.onclick = () => {
                if(idx < pinnedItems.length - 1) {
                    playSound('click');
                    [pinnedItems[idx], pinnedItems[idx+1]] = [pinnedItems[idx+1], pinnedItems[idx]];
                    localStorage.setItem('et_pinned', JSON.stringify(pinnedItems));
                    renderDock();
                }
            };
            del.onclick = () => {
                if(confirm('Remove ' + item.title + '?')) {
                    playSound('delete');
                    pinnedItems.splice(idx, 1);
                    localStorage.setItem('et_pinned', JSON.stringify(pinnedItems));
                    renderDock();
                }
            };
            list.appendChild(div);
        });
    };

    renderDock();
    
    // Dock Listeners
    document.getElementById('addDockBtn').addEventListener('click', () => {
        playSound('click');
        const name = document.getElementById('dockTitleInput').value.trim();
        const url = document.getElementById('dockUrlInput').value.trim();
        if(name && url) {
            let validUrl = url.startsWith('http') ? url : 'https://' + url;
            pinnedItems.push({ title: name, url: validUrl });
            localStorage.setItem('et_pinned', JSON.stringify(pinnedItems));
            document.getElementById('dockTitleInput').value = '';
            document.getElementById('dockUrlInput').value = '';
            renderDock();
        }
    });

    const dockRange = document.getElementById('dockScaleRange');
    dockRange.value = config.dockScale;
    dockRange.addEventListener('input', (e) => {
        const val = e.target.value; config.dockScale = val; localStorage.setItem('et_dock_scale', val);
        document.documentElement.style.setProperty('--dock-scale', val);
    });
    
    document.getElementById('dockToggle').checked = config.showDock;
    document.getElementById('dockToggle').addEventListener('change', (e) => {
         playSound('click');
         config.showDock = e.target.checked; localStorage.setItem('et_dock', e.target.checked); renderDock();
    });
    
    document.getElementById('dockAutoHide').checked = config.dockAutoHide;
    document.getElementById('dockAutoHide').addEventListener('change', (e) => {
        playSound('click');
        config.dockAutoHide = e.target.checked;
        localStorage.setItem('et_dock_hide', e.target.checked);
        updateDockAutoHide();
    });
    
    const handleDockHover = (e) => {
        if(window.innerHeight - e.clientY < 100) dockContainer.style.opacity = '1';
        else dockContainer.style.opacity = '0';
    };
    
    const updateDockAutoHide = () => {
        if(config.dockAutoHide) {
            dockContainer.style.opacity = '0';
            dockContainer.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
            document.addEventListener('mousemove', handleDockHover);
        } else {
            dockContainer.style.opacity = '1';
            document.removeEventListener('mousemove', handleDockHover);
        }
    };
    updateDockAutoHide();
    
    // Init Dock Mag Strength (UI Logic moved here)
    const dockMagRange = document.getElementById('dockMagRange');
    if(dockMagRange) {
        dockMagRange.value = config.dockMagStrength;
        dockMagRange.addEventListener('input', (e) => {
            config.dockMagStrength = parseFloat(e.target.value);
            localStorage.setItem('et_dock_mag_str', config.dockMagStrength);
        });
    }

    
    // --- Wallpaper Playground Tabs ---
    const wpTabs = document.querySelectorAll('.wp-tab');
    const wpViews = document.querySelectorAll('.wp-view');
    wpTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playSound('click');
            wpTabs.forEach(t => t.classList.remove('active'));
            wpViews.forEach(v => v.classList.remove('active'));
            
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if(target) target.classList.add('active');
        });
    });

    // --- Wallpaper System ---
    const loadWallpaper = (src) => {
        const largePreview = document.getElementById('wpLargePreview');
        const overlay = document.getElementById('overlay');
        const bgVideo = document.getElementById('bgVideo');
        
        if (!src) {
            largePreview.innerHTML = '<span style="color:#666; font-size:10px; font-weight:bold;">NO WALLPAPER</span>';
            overlay.style.backgroundImage = '';
            overlay.style.opacity = '0';
            bgVideo.src = '';
            bgVideo.classList.remove('active');
            config.bgImage = null;
            localStorage.removeItem('et_bg');
            return;
        }
        
        config.bgImage = src;
        localStorage.setItem('et_bg', src);
        
        largePreview.innerHTML = `<div class="wp-current-label">CURRENT</div>`;

        // Update Large Preview
        if (src.startsWith('data:video') || src.endsWith('.mp4')) {
            const v = document.createElement('video');
            v.src = src; v.autoplay = true; v.loop = true; v.muted = true;
            v.style.width = '100%'; v.style.height = '100%'; v.style.objectFit = 'cover';
            largePreview.innerHTML = ''; 
            largePreview.appendChild(v); 
            const lbl = document.createElement('div'); lbl.className = 'wp-current-label'; lbl.innerText = 'CURRENT';
            largePreview.appendChild(lbl);
            
            // Video Background Logic
            bgVideo.src = src;
            bgVideo.classList.add('active');
            overlay.classList.add('video-mode');
            bgVideo.play();
            return;
        } else {
            largePreview.style.backgroundImage = 'url(' + src + ')';
        }

        // Image Handling
        const isFirstLoad = !overlay.style.backgroundImage && overlay.style.opacity !== '1';
        
        // Disable video if active
        bgVideo.classList.remove('active');
        setTimeout(() => bgVideo.pause(), 500);
        overlay.classList.remove('video-mode');

        if (isFirstLoad) {
            // Setup Initial State for Entrance Animation
            overlay.style.backgroundImage = `url(${src})`;
            
            overlay.style.transition = 'none';
            overlay.style.opacity = '0';
            overlay.style.filter = 'blur(20px)';
            overlay.style.transform = 'scale(1.1)';
            
            // Force Reflow
            void overlay.offsetWidth;

            // Trigger Animation
            overlay.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                overlay.style.filter = 'blur(0px)';
                overlay.style.transform = 'scale(1)';
            });
            return;
        }

        // DOUBLE-BUFFER TRANSITION LOGIC (For changes)
        const transitionLayer = document.createElement('div');
        transitionLayer.className = 'overlay-transition-layer';
        transitionLayer.style.backgroundImage = overlay.style.backgroundImage;
        document.body.appendChild(transitionLayer);

        overlay.style.backgroundImage = `url(${src})`;
        
        overlay.style.transition = 'none';
        overlay.style.filter = 'blur(15px)';
        overlay.style.transform = 'scale(1.05)';
        overlay.style.opacity = '1';
        
        void overlay.offsetWidth;

        overlay.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

        requestAnimationFrame(() => {
            transitionLayer.classList.add('fade-out');
            overlay.style.filter = 'blur(0px)';
            overlay.style.transform = 'scale(1)';
        });

        setTimeout(() => {
            if(transitionLayer.parentNode) transitionLayer.parentNode.removeChild(transitionLayer);
        }, 800);
    };
    
    const renderWallpaperList = () => {
        const list = document.getElementById('wallpaperList');
        if(!list) return;
        list.innerHTML = '';
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'wp-preset reset-wp';
        resetBtn.title = 'Remove Wallpaper';
        resetBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="#d71921" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        resetBtn.onclick = () => { playSound('click'); loadWallpaper(null); };
        list.appendChild(resetBtn);
        
        const PRESET_WALLPAPERS = [
            "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=3800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=3800&auto=format&fit=crop"
        ];

        PRESET_WALLPAPERS.forEach(url => {
            const btn = document.createElement('button');
            btn.className = 'wp-preset';
            btn.style.backgroundImage = `url(${url})`;
            btn.onclick = () => { playSound('click'); loadWallpaper(url); };
            list.appendChild(btn);
        });
        
        config.userWallpapers.forEach((url, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'wp-user-wrapper';
            
            const btn = document.createElement('button');
            btn.className = 'wp-preset';
            if (url.startsWith('data:video')) {
                 btn.style.backgroundColor = '#222';
                 btn.innerHTML = '<span style="font-size:8px; color:white;">VIDEO</span>';
            } else {
                 btn.style.backgroundImage = `url(${url})`;
            }
            btn.onclick = () => { playSound('click'); loadWallpaper(url); };
            
            const delBtn = document.createElement('button');
            delBtn.className = 'wp-user-delete';
            delBtn.innerHTML = '×';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                playSound('delete');
                if(confirm('Delete this wallpaper?')) {
                    config.userWallpapers.splice(idx, 1);
                    localStorage.setItem('et_user_wallpapers', JSON.stringify(config.userWallpapers));
                    if (config.bgImage === url) loadWallpaper(null);
                    renderWallpaperList();
                }
            };

            wrapper.appendChild(btn);
            wrapper.appendChild(delBtn);
            list.appendChild(wrapper);
        });
        
        const upBtn = document.createElement('button');
        upBtn.className = 'wp-preset add-wp';
        upBtn.innerHTML = '+';
        upBtn.onclick = () => { playSound('click'); document.getElementById('bgUpload').click(); };
        list.appendChild(upBtn);
    };

    const bgUpload = document.getElementById('bgUpload');
    if(bgUpload) {
        bgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { alert('File too large (Max 5MB)'); return; }
            const reader = new FileReader();
            reader.onload = (evt) => {
                const res = evt.target.result;
                config.userWallpapers.push(res);
                localStorage.setItem('et_user_wallpapers', JSON.stringify(config.userWallpapers));
                loadWallpaper(res);
                renderWallpaperList();
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Emoji Generator ---
    const emojiBtn = document.getElementById('emojiGenerateBtn');
    if(emojiBtn) {
        emojiBtn.addEventListener('click', () => {
            const str = document.getElementById('emojiInput').value || '⚡️';
            const bg = document.getElementById('emojiBgInput').value;
            const layout = document.getElementById('emojiLayoutSelect').value;
            
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            let emojis = [];
            try {
                // @ts-ignore
                const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
                // @ts-ignore
                emojis = Array.from(segmenter.segment(str)).map(s => s.segment);
            } catch (e) {
                emojis = str.split('');
            }
            
            if(!emojis.length) return;
            
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (layout.startsWith('grid')) {
                let size = 80, gap = 120;
                if (layout === 'grid-small') { size = 50; gap = 80; }
                if (layout === 'grid-large') { size = 150; gap = 240; }
                
                ctx.font = size + 'px sans-serif';
                for (let y = 0; y < canvas.height + gap; y += gap) {
                    const rowIndex = Math.floor(y/gap);
                    const offset = (rowIndex % 2) * (gap/2);
                    for (let x = -gap; x < canvas.width + gap; x += gap) {
                         const eIndex = (Math.floor(x/gap) + rowIndex) % emojis.length;
                         const safeIndex = (eIndex % emojis.length + emojis.length) % emojis.length;
                         ctx.fillText(emojis[safeIndex], x + offset, y);
                    }
                }
            } else if (layout === 'radial') {
                 ctx.font = '80px sans-serif';
                 const cx = canvas.width/2, cy = canvas.height/2;
                 let r = 0, idx = 0;
                 while(r < 1200) {
                     const circum = 2 * Math.PI * r;
                     const count = r === 0 ? 1 : Math.floor(circum / 120);
                     for(let i=0; i<count; i++) {
                         const ang = (i/count) * Math.PI * 2;
                         ctx.save();
                         ctx.translate(cx + Math.cos(ang)*r, cy + Math.sin(ang)*r);
                         ctx.rotate(ang + Math.PI/2);
                         ctx.fillText(emojis[idx % emojis.length], 0, 0);
                         ctx.restore();
                         idx++;
                     }
                     r += 120;
                 }
            }
            
            const url = canvas.toDataURL('image/png');
            config.userWallpapers.push(url);
            localStorage.setItem('et_user_wallpapers', JSON.stringify(config.userWallpapers));
            loadWallpaper(url);
            renderWallpaperList();
            playSound('click');
        });
    }

    // --- Gradient Generator ---
    const gradGenBtn = document.getElementById('gradGenerateBtn');
    if(gradGenBtn) {
        let gradColors = ['#050505', '#d71921'];

        const renderGradColors = () => {
            const list = document.getElementById('gradColorsList');
            if(!list) return;
            list.innerHTML = '';
            gradColors.forEach((c, i) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:relative; flex-shrink:0;';
                
                const inp = document.createElement('input');
                inp.type = 'color';
                inp.value = c;
                inp.className = 'emoji-color-picker';
                inp.style.width = '40px';
                inp.style.height = '40px';
                inp.oninput = (e) => { gradColors[i] = e.target.value; };
                
                wrap.appendChild(inp);

                if (gradColors.length > 2) {
                    const del = document.createElement('div');
                    del.innerHTML = '×';
                    del.style.cssText = 'position:absolute; top:-5px; right:-5px; width:16px; height:16px; background:#333; color:#fff; border-radius:50%; font-size:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid #000;';
                    del.onclick = () => {
                        playSound('delete');
                        gradColors.splice(i, 1);
                        renderGradColors();
                    };
                    wrap.appendChild(del);
                }
                list.appendChild(wrap);
            });
        };
        
        const addBtn = document.getElementById('addGradColorBtn');
        if(addBtn) addBtn.addEventListener('click', () => {
             if(gradColors.length < 5) {
                 playSound('click');
                 gradColors.push('#ffffff');
                 renderGradColors();
             }
        });

        renderGradColors();

        const angleInp = document.getElementById('gradAngleInput');
        const angleVal = document.getElementById('gradAngleVal');
        if(angleInp) angleInp.addEventListener('input', (e) => {
             angleVal.textContent = e.target.value;
        });

        const typeSel = document.getElementById('gradTypeSelect');
        const angleRow = document.getElementById('gradAngleRow');
        if(typeSel) typeSel.addEventListener('change', (e) => {
            if(e.target.value === 'radial') angleRow.classList.add('hidden');
            else angleRow.classList.remove('hidden');
        });

        gradGenBtn.addEventListener('click', () => {
            const type = typeSel.value;
            const angle = parseInt(angleInp.value);
            
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            
            let grd;
            if (type === 'linear') {
                const rad = (angle - 90) * Math.PI / 180;
                const r = Math.sqrt(canvas.width**2 + canvas.height**2) / 2;
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                
                const x1 = cx + Math.cos(rad) * r;
                const y1 = cy + Math.sin(rad) * r;
                const x0 = cx - Math.cos(rad) * r;
                const y0 = cy - Math.sin(rad) * r;
                
                grd = ctx.createLinearGradient(x0, y0, x1, y1);
            } else {
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const r = Math.max(canvas.width, canvas.height) / 2;
                grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            }
            
            gradColors.forEach((c, i) => {
                grd.addColorStop(i / (gradColors.length - 1), c);
            });
            
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Grain
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                 const noise = (Math.random() - 0.5) * 20;
                 data[i] = Math.min(255, Math.max(0, data[i] + noise));
                 data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
                 data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);

            const url = canvas.toDataURL('image/jpeg', 0.9);
            config.userWallpapers.push(url);
            localStorage.setItem('et_user_wallpapers', JSON.stringify(config.userWallpapers));
            loadWallpaper(url);
            renderWallpaperList();
            playSound('click');
            
            document.querySelector('[data-target="wp-images"]').click();
        });
    }

    
    // --- Brief Settings ---
    const briefAuto = document.getElementById('briefAutoShow');
    if(briefAuto) {
        briefAuto.checked = config.briefAutoShow;
        briefAuto.addEventListener('change', (e) => {
            config.briefAutoShow = e.target.checked;
            localStorage.setItem('et_brief_auto', config.briefAutoShow);
        });
    }
    
    const briefTopic = document.getElementById('briefNewsTopic');
    if(briefTopic) {
        briefTopic.value = config.briefNewsTopic;
        briefTopic.addEventListener('change', (e) => {
            config.briefNewsTopic = e.target.value;
            localStorage.setItem('et_brief_topic', config.briefNewsTopic);
        });
    }

    const renderBriefSettings = () => {
        const list = document.getElementById('briefOrderList');
        if(!list) return;
        list.innerHTML = '';
        config.briefOrder.forEach((item, idx) => {
            const div = document.createElement('div'); div.className = 'dock-setting-item';
            div.innerHTML = `<div class="dock-setting-info"><span>${item.toUpperCase()}</span></div>
            <div class="dock-setting-controls">
                <div class="dock-ctrl-btn up" title="Move Up">↑</div>
                <div class="dock-ctrl-btn down" title="Move Down">↓</div>
            </div>`;
            
            div.querySelector('.up').onclick = () => {
                if(idx > 0) {
                    playSound('click');
                    [config.briefOrder[idx], config.briefOrder[idx-1]] = [config.briefOrder[idx-1], config.briefOrder[idx]];
                    localStorage.setItem('et_brief_order', JSON.stringify(config.briefOrder));
                    renderBriefSettings();
                }
            };
            div.querySelector('.down').onclick = () => {
                if(idx < config.briefOrder.length - 1) {
                    playSound('click');
                    [config.briefOrder[idx], config.briefOrder[idx+1]] = [config.briefOrder[idx+1], config.briefOrder[idx]];
                    localStorage.setItem('et_brief_order', JSON.stringify(config.briefOrder));
                    renderBriefSettings();
                }
            };
            list.appendChild(div);
        });
    };
    renderBriefSettings();

    // --- Tabs Logic ---
    const tabs = document.querySelectorAll('.settings-tab');
    const panes = document.querySelectorAll('.settings-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playSound('click');
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if(target) target.classList.add('active');
            // Clear search on tab switch
            const searchEl = document.getElementById('settingsSearch');
            if(searchEl) searchEl.value = '';
            document.querySelectorAll('.setting-row, .setting-section').forEach(el => el.classList.remove('hidden'));
        });
    });

    // --- Settings Search ---
    const searchInput = document.getElementById('settingsSearch');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const activePane = document.querySelector('.settings-pane.active');
            if(!activePane) return;
            
            const rows = activePane.querySelectorAll('.setting-row');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if(text.includes(term)) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        });
    }

    // --- Draggable Windows Logic (Settings & Notes) ---
    const initDraggableWindow = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const handle = modal.querySelector('.settings-drag-handle');
        if (!handle) return;

        let isDragging = false;
        let startX, startY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = modal.getBoundingClientRect();
            
            // Calculate mouse offset relative to modal top-left
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            
            // Disable transition during drag for responsiveness
            // Also remove transform centering to switch to absolute positioning
            modal.style.transition = 'none';
            modal.style.transform = 'none'; 
            
            // Set initial absolute position to current visual position to prevent jump
            modal.style.left = rect.left + 'px';
            modal.style.top = rect.top + 'px';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            
            modal.style.left = x + 'px';
            modal.style.top = y + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Restore transitions for opacity/transform effects (like open/close)
                // We keep transform as 'none' so the new position persists
                modal.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'; 
            }
        });
    };

    // Initialize drag for both windows
    initDraggableWindow('settingsModal');
    initDraggableWindow('essentialNoteModal');

    // --- Theme & Layout ---
    const applyTheme = () => document.documentElement.setAttribute('data-theme', config.theme);
    
    const applyLayoutClasses = () => {
        document.body.classList.remove('align-left', 'align-right', 'align-center');
        document.body.classList.add('align-' + config.gridAlign);
        
        if (config.gridAlign !== 'center') {
            sidebarContainer.classList.remove('hidden');
        } else {
            sidebarContainer.classList.add('hidden');
             // If centered, move sidebar widget back to drawer if exists
             if (config.sidebarWidget) {
                 const w = document.getElementById(config.sidebarWidget);
                 if (w) { drawerContent.appendChild(w); w.classList.remove('sidebar-mode'); }
                 config.sidebarWidget = null;
                 localStorage.removeItem('et_sidebar_widget');
                 saveLayout(); // Global from interactionGrid.ts
             }
        }
    };

    // --- Init Settings Values ---
    const initSettingsUI = () => {
        applyTheme();
        // Font
        document.documentElement.style.setProperty('--font-custom', config.font);
        
        // Fix Username Display
        document.getElementById('userNameDisplay').textContent = config.userName || 'USER';

        // Initial Layout
        applyLayoutClasses();

        // Values
        document.documentElement.style.setProperty('--dock-scale', config.dockScale);
        document.documentElement.style.setProperty('--blur-strength', config.blur + 'px');
        document.documentElement.style.setProperty('--radius', config.borderRadius + 'px');
        
        const cdLabel = document.getElementById('countdownLabelInput');
        if(cdLabel) cdLabel.value = config.countdownLabel;
        const cdDate = document.getElementById('countdownDateInput');
        if(cdDate) cdDate.value = config.countdownDate;

        // Experimental
        const expToggle = document.getElementById('experimentalToggle');
        const coverSizeRow = document.getElementById('coverSizeRow');
        const coverSizeRange = document.getElementById('coverSizeRange');
        const codeRow = document.getElementById('experimentalCodeRow');
        const fontRow = document.getElementById('fontRow');
        
        const ensureElement = (id, html) => {
             if(!document.getElementById(id)) {
                 const div = document.createElement('div'); div.id = id; div.className = 'setting-row hidden';
                 div.innerHTML = html;
                 if(expToggle) expToggle.closest('.setting-row').parentNode.insertBefore(div, expToggle.closest('.setting-row').nextSibling);
             }
             return document.getElementById(id);
        }

        const ambRow = document.getElementById('ambientRow') || ensureElement('ambientRow', '<span>AMBIENT LIGHTING</span><label class="switch"><input type="checkbox" id="ambientToggle"><span class="slider round"></span></label>');
        const lenticularRow = document.getElementById('lenticularRow') || ensureElement('lenticularRow', '<span>LENTICULAR FILTER</span><label class="switch"><input type="checkbox" id="lenticularToggle"><span class="slider round"></span></label>');
        const glowRow = document.getElementById('albumGlowRow') || ensureElement('albumGlowRow', '<span>DYNAMIC ALBUM GLOW</span><label class="switch"><input type="checkbox" id="albumGlowToggle"><span class="slider round"></span></label>');
        const blurAnimRow = document.getElementById('blurAnimRow') || ensureElement('blurAnimRow', '<span>DISABLE WINDOW BLUR ANIMATIONS</span><label class="switch"><input type="checkbox" id="blurAnimToggle"><span class="slider round"></span></label>');
        const emojiRow = document.getElementById('emojiIconsRow');

        if(expToggle) expToggle.checked = config.experimental;
        
        const toggleExpUI = () => {
            const controls = document.getElementById('experimentalControls');
            const show = config.experimental;
            
            if (controls) {
                if (show) controls.classList.remove('hidden');
                else controls.classList.add('hidden');
            }

            const toggle = (el) => {
                if (el) {
                    if (show) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                }
            };
            
            toggle(coverSizeRow);
            toggle(codeRow);
            toggle(ambRow);
            toggle(lenticularRow);
            toggle(glowRow);
            toggle(blurAnimRow);
            toggle(emojiRow);
            
            // Handle Glass Theme specific rows
            const refrRow = document.getElementById('refractionRow');
            const specRow = document.getElementById('specularRow');
            
            if (show && config.theme === 'glass') {
                 if(refrRow) refrRow.classList.remove('hidden');
                 if(specRow) specRow.classList.remove('hidden');
            } else {
                 if(refrRow) refrRow.classList.add('hidden');
                 if(specRow) specRow.classList.add('hidden');
            }
        };
        toggleExpUI();
        
        if(coverSizeRange) {
            coverSizeRange.value = config.coverSize;
            coverSizeRange.addEventListener('input', (e) => {
                config.coverSize = e.target.value;
                localStorage.setItem('et_cover_size', config.coverSize);
                document.documentElement.style.setProperty('--cover-size', config.coverSize + 'px');
            });
        }
        
        if (config.experimental) document.documentElement.style.setProperty('--cover-size', config.coverSize + 'px');
        else document.documentElement.style.setProperty('--cover-size', '110px');

        if(expToggle) {
            expToggle.addEventListener('change', (e) => {
                playSound('click');
                config.experimental = e.target.checked;
                localStorage.setItem('et_experimental', config.experimental);
                toggleExpUI();
                if(config.experimental) document.documentElement.style.setProperty('--cover-size', config.coverSize + 'px');
                else document.documentElement.style.setProperty('--cover-size', '110px');
            });
        }

        const ambToggle = document.getElementById('ambientToggle');
        if (ambToggle) {
            ambToggle.checked = config.ambientMode;
            const applyAmbient = () => {
                if (config.ambientMode) document.body.classList.add('ambient-mode');
                else document.body.classList.remove('ambient-mode');
            };
            applyAmbient();
            ambToggle.addEventListener('change', (e) => {
                playSound('click');
                config.ambientMode = e.target.checked;
                localStorage.setItem('et_ambient', config.ambientMode);
                applyAmbient();
            });
        }

        const lenticularToggle = document.getElementById('lenticularToggle');
        if (lenticularToggle) {
            lenticularToggle.checked = config.lenticular;
            const applyLenticular = () => {
                if (config.lenticular) document.body.classList.add('lenticular-mode');
                else document.body.classList.remove('lenticular-mode');
            };
            applyLenticular();
            lenticularToggle.addEventListener('change', (e) => {
                playSound('click');
                config.lenticular = e.target.checked;
                localStorage.setItem('et_lenticular', config.lenticular);
                applyLenticular();
            });
        }

        const blurAnimToggle = document.getElementById('blurAnimToggle');
        if (blurAnimToggle) {
            blurAnimToggle.checked = config.disableBlurAnim;
            const applyBlurAnim = () => {
                if (config.disableBlurAnim) document.body.classList.add('no-blur-anim');
                else document.body.classList.remove('no-blur-anim');
            };
            applyBlurAnim();
            blurAnimToggle.addEventListener('change', (e) => {
                playSound('click');
                config.disableBlurAnim = e.target.checked;
                localStorage.setItem('et_disable_blur_anim', config.disableBlurAnim);
                applyBlurAnim();
            });
        }

        const glowToggle = document.getElementById('albumGlowToggle');
        if (glowToggle) {
            glowToggle.checked = config.albumGlow;
            glowToggle.addEventListener('change', (e) => {
                playSound('click');
                config.albumGlow = e.target.checked;
                localStorage.setItem('et_album_glow', config.albumGlow);
                const artContainer = document.querySelector('.album-art-container');
                if (artContainer) {
                    if (config.albumGlow) artContainer.classList.add('active-glow');
                    else artContainer.classList.remove('active-glow');
                }
            });
        }
        
        const emojiToggle = document.getElementById('emojiIconsToggle');
        if(emojiToggle) {
            emojiToggle.checked = config.emojiIcons;
            emojiToggle.addEventListener('change', (e) => {
                playSound('click');
                config.emojiIcons = e.target.checked;
                localStorage.setItem('et_emoji_icons', config.emojiIcons);
                if(typeof updateHeaderIcons === 'function') updateHeaderIcons(); 
                if(typeof renderDock === 'function') renderDock();
            });
        }
        
        // Gemini API Key Input
        const geminiInput = document.getElementById('geminiKeyInput');
        if (geminiInput) {
            geminiInput.value = config.geminiApiKey;
            geminiInput.addEventListener('input', (e) => {
                config.geminiApiKey = e.target.value;
                localStorage.setItem('et_gemini_key', config.geminiApiKey);
            });
        }

        const codeInput = document.getElementById('experimentalCodeInput');
        const radiusRow = document.getElementById('borderRadiusRow');
        const radiusRange = document.getElementById('borderRadiusRange');
        const radiusVal = document.getElementById('borderRadiusVal');

        if(codeInput) {
            codeInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                if (val === 'font' && fontRow) fontRow.classList.remove('hidden');
                
                // --- Easter Eggs ---
                if (val === 'zen') document.body.classList.toggle('minimal-mode');
                if (val === 'retro') document.body.classList.toggle('retro-mode');
                
                // New Additions
                if (val === 'noir') document.body.classList.toggle('noir-mode');
                if (val === 'rgb') document.body.classList.toggle('rgb-mode');
                if (val === 'vaporwave') document.body.classList.toggle('vaporwave-mode');
                if (val === 'shake') document.body.classList.toggle('glitch-mode');
                if (val === 'stranger things') {
                    document.body.style.transition = 'transform 1s ease, filter 1s ease';
                    if (document.body.style.transform === 'rotate(180deg)') {
                        document.body.style.transform = '';
                        document.body.style.filter = '';
                    } else {
                        document.body.style.transform = 'rotate(180deg)';
                        document.body.style.filter = 'sepia(1) hue-rotate(-50deg) saturate(3)';
                    }
                }

                if (val === 'party') { if(typeof startConfetti === 'function') startConfetti(); }
                if (val === 'do a barrel roll') {
                    document.body.style.transition = 'transform 1s ease';
                    document.body.style.transform = 'rotate(360deg)';
                    setTimeout(() => { document.body.style.transform = ''; }, 1000);
                }
                
                if (val === 'bye beta') {
                    if(typeof startConfetti === 'function') startConfetti();
                    alert("Welcome to the official release!");
                }
                if (val === 'rebrand') {
                    alert("👀 Keep your eyes peeled...");
                }

                // Dev Console Logic
                if (val === 'dev console') {
                    if(!document.getElementById('devConsoleModal')) {
                        const div = document.createElement('div');
                        div.id = 'devConsoleModal';
                        div.style.cssText = "position:fixed; top:20%; left:50%; transform:translate(-50%, 0); background:var(--modal-bg); border:1px solid var(--accent); padding:20px; z-index:99999; border-radius:12px; box-shadow:0 0 50px rgba(0,0,0,0.8); width: 300px; backdrop-filter:blur(20px); animation: fadeIn 0.3s ease;";
                        div.innerHTML = `
                            <div style="font-family:var(--font-display); color:var(--accent); font-weight:bold; margin-bottom:15px; letter-spacing:1px; text-align:center;">DEVELOPER CONSOLE</div>
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                <button id="devBtnIntro" class="file-upload-btn" style="text-align:center;">PLAY INTRO SEQUENCE</button>
                                <button id="devBtnSearch" class="file-upload-btn" style="text-align:center;">OPEN ESSENTIAL SEARCH</button>
                                <button id="devBtnClose" class="danger-btn" style="margin-top:10px;">CLOSE</button>
                            </div>
                        `;
                        document.body.appendChild(div);

                        document.getElementById('devBtnIntro').onclick = () => {
                            localStorage.removeItem('et_version_intro');
                            window.location.reload();
                        };

                        document.getElementById('devBtnSearch').onclick = () => {
                            const es = document.getElementById('essentialSearchOverlay');
                            if(es) es.classList.add('active');
                        };

                        document.getElementById('devBtnClose').onclick = () => div.remove();
                    }
                }
            });
        }

        if(radiusRange) {
            radiusRange.value = config.borderRadius;
            radiusVal.textContent = config.borderRadius;
            radiusRange.addEventListener('input', (e) => {
                config.borderRadius = e.target.value;
                localStorage.setItem('et_radius', config.borderRadius);
                document.documentElement.style.setProperty('--radius', config.borderRadius + 'px');
                radiusVal.textContent = config.borderRadius;
            });
        }

        // Init Wallpaper
        if (config.bgImage) {
            // Check if loadWallpaper exists (it should from interactionWallpaper.ts)
            if (typeof loadWallpaper === 'function') {
                loadWallpaper(config.bgImage);
            }
        } else {
            const preview = document.getElementById('wpLargePreview');
            if(preview) preview.innerHTML = '<span style="color:#666; font-size:10px; font-weight:bold;">NO WALLPAPER ACTIVE</span>';
        }
        
        if (typeof renderWallpaperList === 'function') {
            renderWallpaperList();
        }
    };
    initSettingsUI();

    document.getElementById('resetAllBtn').addEventListener('click', () => {
        if(confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    });

    document.getElementById('resetWidgetsBtn').addEventListener('click', () => {
        if(confirm('Reset widget layout to default positions?')) {
            localStorage.removeItem('et_layout');
            localStorage.removeItem('et_hidden');
            localStorage.removeItem('et_sidebar_widget');
            localStorage.removeItem('et_search_half');
            window.location.reload();
        }
    });
    
    document.getElementById('removeAllStickersBtn').addEventListener('click', () => {
        if(confirm('Remove ALL stickers from the home screen?')) {
            config.stickers = [];
            localStorage.setItem('et_stickers', JSON.stringify(config.stickers));
            if(typeof renderStickers === 'function') renderStickers();
        }
    });

    // Feedback Links
    const btnFeedback = document.getElementById('btnFeedback');
    if(btnFeedback) btnFeedback.addEventListener('click', () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSfM6aDNtFepUSR0Gh5OjPWG_rUgUWMLkkcEFa6c0pLOS369Vw/viewform?usp=publish-editor', '_blank');
    });

    const btnBugReport = document.getElementById('btnBugReport');
    if(btnBugReport) btnBugReport.addEventListener('click', () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSe9wxelMOGi83_Hoa8gGGsIN8WXiBsf97jbQQKdqDtaGv2kyw/viewform?usp=publish-editor', '_blank');
    });

    document.getElementById('closeSettings').addEventListener('click', () => {
        playSound('click');
        settingsModal.classList.remove('open');
        setTimeout(() => {
            settingsModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            settingsModal.style.top = '50%';
            settingsModal.style.left = '50%';
        }, 300);
    });

    // Replace old closeSticky with new closeNotes
    const closeNotes = document.getElementById('closeNotes');
    if(closeNotes) {
        closeNotes.addEventListener('click', () => {
            document.getElementById('essentialNoteModal').classList.remove('open');
        });
    }
    
    const closeLibrary = document.getElementById('closeLibrary');
    if(closeLibrary) closeLibrary.addEventListener('click', () => document.getElementById('libraryModal').classList.remove('open'));
    
    // --- User ID Card Logic ---
    const card = document.getElementById('userIdCard');
    const cardWrapper = document.querySelector('.user-id-card-wrapper');
    const cardName = document.getElementById('cardNameDisplay');
    const cardId = document.getElementById('cardIdDisplay');
    const cardAvatar = document.getElementById('cardAvatar');

    // Init Values
    if (card) {
        // Fix for name saving
        if(config.userCard && config.userCard.name) {
             cardName.textContent = config.userCard.name;
        }
        
        cardId.innerText = config.userCard.id;
        card.style.setProperty('--card-color', config.userCard.color);
        card.style.setProperty('--card-font', config.userCard.font);

        if (config.userCard.image) {
            cardAvatar.innerHTML = `<img src="${config.userCard.image}">`;
        } else {
            // Ensure default stick man is present if no image
            if (!cardAvatar.querySelector('.default-avatar-icon')) {
                cardAvatar.innerHTML = `
                <div class="default-avatar-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>`;
            }
        }

        // Tilt Effect
        cardWrapper.addEventListener('mousemove', (e) => {
            const rect = cardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 10; // Max rotation deg
            const rotateY = (x - centerX) / 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        cardWrapper.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });

        cardName.addEventListener('input', (e) => {
            if(!config.userCard) config.userCard = {};
            config.userCard.name = (e.target).textContent;
            localStorage.setItem('et_user_card', JSON.stringify(config.userCard));
        });
    }

    // --- Pill Switches ---
    const setupPill = (id, count, callback) => {
        const container = document.getElementById(id);
        if(!container) return () => {};
        
        const slider = container.querySelector('.pill-slider');
        const btns = container.querySelectorAll('.pill-btn');
        slider.style.width = `calc((100% - 8px) / ${count})`;

        btns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                playSound('click');
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                slider.style.transform = `translateX(${idx * 100}%)`;
                callback(btn.dataset.value);
            });
        });

        return (val) => {
            let activeIdx = 0;
            btns.forEach((btn, idx) => {
                if(btn.dataset.value === val) {
                    btn.classList.add('active');
                    activeIdx = idx;
                } else btn.classList.remove('active');
            });
            slider.style.transform = `translateX(${activeIdx * 100}%)`;
        };
    };

    const updateThemePill = setupPill('themePill', 3, (val) => {
        config.theme = val;
        localStorage.setItem('et_theme', config.theme);
        
        if (config.theme === 'glass') {
            config.blur = 50;
            localStorage.setItem('et_blur', 50);
            document.documentElement.style.setProperty('--blur-strength', '50px');
            const br = document.getElementById('blurRange');
            if (br) br.value = 50;
        }

        applyTheme();
    });
    updateThemePill(config.theme);

    const updateFontPill = setupPill('fontPill', 4, (val) => {
        config.font = val;
        localStorage.setItem('et_font', config.font);
        document.documentElement.style.setProperty('--font-custom', config.font);
    });
    updateFontPill(config.font);

    const updateLayoutPill = setupPill('layoutPill', 3, (val) => {
        config.gridAlign = val;
        localStorage.setItem('et_grid_align', config.gridAlign);
        applyLayoutClasses();
    });
    updateLayoutPill(config.gridAlign);
    
    const updateBriefLocationPill = setupPill('briefLocationPill', 3, (val) => {
        config.briefButtonLocation = val;
        localStorage.setItem('et_brief_btn_loc', config.briefButtonLocation);
        if(typeof updateHeaderIcons === 'function') updateHeaderIcons();
        if(typeof renderDock === 'function') renderDock();
    });
    updateBriefLocationPill(config.briefButtonLocation);

    const updateAiModelPill = setupPill('aiModelPill', 2, (val) => {
        config.geminiModel = val;
        localStorage.setItem('et_gemini_model', config.geminiModel);
    });
    updateAiModelPill(config.geminiModel);
    
    // Bookmark Sort Pill
    const updateBookmarkPill = setupPill('bookmarkOrderPill', 2, (val) => {
        config.bookmarkOrder = val;
        localStorage.setItem('et_bookmark_order', config.bookmarkOrder);
        if(typeof renderBookmarks === 'function') renderBookmarks();
    });
    updateBookmarkPill(config.bookmarkOrder);

    // --- Inputs Listeners ---
    document.getElementById('blurRange').value = config.blur;
    document.getElementById('blurRange').addEventListener('input', (e) => {
        const val = e.target.value; config.blur = val; localStorage.setItem('et_blur', val);
        document.documentElement.style.setProperty('--blur-strength', val + 'px');
    });
    
    document.getElementById('userNameInput').value = config.userName;
    document.getElementById('userNameInput').addEventListener('input', (e) => {
        config.userName = e.target.value; localStorage.setItem('et_name', e.target.value);
        document.getElementById('userNameDisplay').textContent = e.target.value || 'USER';
    });
    
    document.getElementById('format24h').checked = config.use24h;
    document.getElementById('format24h').addEventListener('change', (e) => { 
        playSound('click'); 
        config.use24h = e.target.checked; localStorage.setItem('et_24h', e.target.checked); updateTime(); 
    });
    
    document.getElementById('showSeconds').checked = config.showSeconds;
    document.getElementById('showSeconds').addEventListener('change', (e) => { 
        playSound('click');
        config.showSeconds = e.target.checked; localStorage.setItem('et_seconds', e.target.checked); updateTime(); 
    });
    
    const wdToggle = document.getElementById('weatherDateToggle');
    if (wdToggle) {
        wdToggle.checked = config.weatherDate;
        const updateWd = () => {
            const el = document.getElementById('weatherDate');
            if(el) {
                if(config.weatherDate) el.classList.remove('hidden');
                else el.classList.add('hidden');
            }
        };
        updateWd();
        wdToggle.addEventListener('change', (e) => {
            playSound('click');
            config.weatherDate = e.target.checked;
            localStorage.setItem('et_weather_date', config.weatherDate);
            updateWd();
        });
    }
    
    // --- Version Label ---
    document.getElementById('versionLabel').onclick = () => {
        if(config.experimental && typeof startConfetti === 'function') startConfetti(); // Global from interactionGrid.ts
    };

    // Range Slider Background Logic
    const updateAllRangeSliders = () => {
        document.querySelectorAll('.range-slider').forEach(el => {
            const min = parseFloat(el.min) || 0;
            const max = parseFloat(el.max) || 100;
            const val = parseFloat(el.value) || 0;
            const pct = ((val - min) / (max - min)) * 100;
            // Use backgroundImage to avoid overwriting background-size/position from CSS
            el.style.backgroundImage = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, #333 ${pct}%, #333 100%)`;
        });
    };
    
    // Attach listener
    document.addEventListener('input', (e) => {
        if(e.target.matches('.range-slider')) {
            const el = e.target;
            const min = parseFloat(el.min) || 0;
            const max = parseFloat(el.max) || 100;
            const val = parseFloat(el.value) || 0;
            const pct = ((val - min) / (max - min)) * 100;
            el.style.backgroundImage = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, #333 ${pct}%, #333 100%)`;
        }
    });

    // Call once on init
    setTimeout(updateAllRangeSliders, 100);

    // --- Data Backup & Import ---
    const backupBtn = document.getElementById('backupDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importInput = document.getElementById('importDataInput');

    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `essential-tab-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            playSound('click');
        });
    }

    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => {
            playSound('click');
            importInput.click();
        });

        importInput.addEventListener('change', (e) => {
            // @ts-ignore
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    // @ts-ignore
                    const data = JSON.parse(evt.target.result);
                    if (confirm('This will overwrite your current settings and layout. Continue?')) {
                        localStorage.clear();
                        
                        Object.keys(data).forEach(key => {
                            localStorage.setItem(key, data[key]);
                        });
                        
                        alert('Import successful. Reloading...');
                        window.location.reload();
                    }
                } catch (err) {
                    alert('Invalid backup file.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
            // @ts-ignore
            importInput.value = ''; 
        });
    }

    // --- Notes Backup Logic ---
    const backupNotesBtn = document.getElementById('backupNotesBtn');
    const importNotesBtn = document.getElementById('importNotesBtn');
    const importNotesInput = document.getElementById('importNotesInput');
    const resetNotesBtn = document.getElementById('resetNotesBtn');

    // Simple XOR Cipher for Basic Backup Security
    const noteCipher = (salt) => {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
        return text => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
    };

    const noteDecipher = (salt) => {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
        return encoded => encoded.match(/.{1,2}/g).map(hex => parseInt(hex, 16)).map(applySaltToChar).map(charCode => String.fromCharCode(charCode)).join('');
    };

    const NOTE_KEY = "et_notes_secure_v1";

    if (backupNotesBtn) {
        backupNotesBtn.addEventListener('click', () => {
            const notesRaw = localStorage.getItem('et_notes_v2');
            if (!notesRaw || notesRaw === '[]') { alert('No notes to backup.'); return; }
            
            try {
                const notes = JSON.parse(notesRaw);
                const encrypt = noteCipher(NOTE_KEY);
                
                const exportData = notes.map(n => {
                    const copy = { ...n };
                    // If note has a password, encrypt it for export
                    if (copy.password) {
                        copy.password = encrypt(copy.password);
                        copy.isSecured = true;
                    }
                    return copy;
                });
                
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `essential-notes-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                playSound('click');
            } catch(e) {
                console.error(e);
                alert('Error creating backup.');
            }
        });
    }

    if (importNotesBtn && importNotesInput) {
        importNotesBtn.addEventListener('click', () => {
            playSound('click');
            importNotesInput.click();
        });

        importNotesInput.addEventListener('change', (e) => {
            // @ts-ignore
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    // @ts-ignore
                    const imported = JSON.parse(evt.target.result);
                    if (!Array.isArray(imported)) throw new Error("Invalid Format");
                    
                    const decrypt = noteDecipher(NOTE_KEY);
                    let importedCount = 0;
                    
                    const current = JSON.parse(localStorage.getItem('et_notes_v2') || '[]');
                    
                    imported.forEach(n => {
                        // Check if duplicate ID
                        if (!current.find(curr => curr.id === n.id)) {
                            // Decrypt if needed
                            if (n.isSecured && n.password) {
                                n.password = decrypt(n.password);
                                delete n.isSecured;
                            }
                            current.unshift(n);
                            importedCount++;
                        }
                    });
                    
                    localStorage.setItem('et_notes_v2', JSON.stringify(current));
                    
                    // Trigger UI Refresh if function exists (Global scope check)
                    if (typeof renderNoteSidebar === 'function') {
                        renderNoteSidebar();
                    }
                    
                    alert(`Imported ${importedCount} notes successfully.`);
                } catch (err) {
                    alert('Failed to import notes. Invalid file.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
            // @ts-ignore
            importNotesInput.value = '';
        });
    }

    if (resetNotesBtn) {
        resetNotesBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to DELETE ALL NOTES? This cannot be undone unless you have a backup.')) {
                // Clear storage
                localStorage.removeItem('et_notes_v2');
                // Reload to re-initialize defaults
                window.location.reload();
            }
        });
    }

});