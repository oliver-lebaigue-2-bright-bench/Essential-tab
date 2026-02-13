// QR Code Widget Logic - Nothing Design
(function() {
    'use strict';

    const overlay = document.getElementById('qrOverlay');
    const qrTextInput = document.getElementById('qrTextInput');
    const qrGenerateBtn = document.getElementById('qrGenerateBtn');
    const qrResult = document.getElementById('qrResult');
    const qrCurrentUrl = document.getElementById('qrCurrentUrl');
    const qrTextSection = document.getElementById('qrTextSection');
    const qrUrlSection = document.getElementById('qrUrlSection');
    const closeBtn = document.getElementById('qrClose');
    const tabs = document.querySelectorAll('.qr-tab');

    let currentMode = 'text';

    function init() {
        loadCurrentTab();
        setupEventListeners();
    }

    function loadCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                qrCurrentUrl.textContent = tabs[0].url || 'No URL';
            }
        });
    }

    function generateQRCode(text) {
        if (!text || text.trim().length === 0) {
            qrResult.innerHTML = '<div class="qr-empty">Please enter some text</div>';
            return;
        }

        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        const qr = createQRMatrix(text, 4);
        const moduleSize = size / qr.length;

        ctx.fillStyle = '#000000';

        for (let row = 0; row < qr.length; row++) {
            for (let col = 0; col < qr.length; col++) {
                if (qr[row][col]) {
                    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        qrResult.innerHTML = `
            <div class="qr-canvas">
                <canvas id="qrCanvas"></canvas>
            </div>
            <div class="qr-actions-row">
                <button class="qr-save-btn" id="qrDownloadBtn">DOWNLOAD</button>
                <button class="qr-save-btn" id="qrCopyBtn">COPY IMAGE</button>
            </div>
        `;

        const finalCanvas = document.getElementById('qrCanvas');
        finalCanvas.width = size;
        finalCanvas.height = size;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.fillStyle = '#ffffff';
        finalCtx.fillRect(0, 0, size, size);
        finalCtx.fillStyle = '#000000';

        for (let row = 0; row < qr.length; row++) {
            for (let col = 0; col < qr.length; col++) {
                if (qr[row][col]) {
                    finalCtx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        document.getElementById('qrDownloadBtn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'essential-qr.png';
            link.href = finalCanvas.toDataURL('image/png');
            link.click();
            showNotification('Downloaded');
        });

        document.getElementById('qrCopyBtn').addEventListener('click', async () => {
            try {
                finalCanvas.toBlob(async (blob) => {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    showNotification('Copied');
                });
            } catch (err) {
                showNotification('Copy failed');
            }
        });
    }

    function createQRMatrix(text, errorLevel) {
        const version = Math.ceil(Math.sqrt(text.length / 14)) + 1;
        const size = version * 4 + 17;
        const matrix = Array(size).fill(null).map(() => Array(size).fill(false));

        addFinderPattern(matrix, 0, 0);
        addFinderPattern(matrix, size - 7, 0);
        addFinderPattern(matrix, 0, size - 7);

        for (let i = 8; i < size - 8; i++) {
            matrix[6][i] = i % 2 === 0;
            matrix[i][6] = i % 2 === 0;
        }

        const data = simpleEncode(text);
        let dataIndex = 0;

        for (let col = size - 1; col > 0; col -= 2) {
            if (col === 6) col = 5;
            for (let row = size - 1; row >= 0; row--) {
                for (let c = 0; c < 2; c++) {
                    const x = col - c;
                    if (!isReserved(matrix, row, x)) {
                        if (dataIndex < data.length) {
                            matrix[row][x] = data[dataIndex] === '1';
                            dataIndex++;
                        }
                    }
                }
            }
        }

        return matrix;
    }

    function addFinderPattern(matrix, startRow, startCol) {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                if ((row === 0 || row === 6 || col === 0 || col === 6) ||
                    (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
                    matrix[startRow + row][startCol + col] = true;
                }
            }
        }
    }

    function isReserved(matrix, row, col) {
        const size = matrix.length;
        if (row < 9 && col < 9) return true;
        if (row < 9 && col >= size - 8) return true;
        if (row >= size - 8 && col < 9) return true;
        if (row === 6 || col === 6) return true;
        return false;
    }

    function simpleEncode(text) {
        let binary = '';
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            binary += code.toString(2).padStart(8, '0');
        }
        let result = '';
        for (let i = 0; i < binary.length; i++) {
            const bit = parseInt(binary[i]) ^ (i % 2);
            result += bit;
        }
        let final = result;
        while (final.length < 200) {
            final += result;
        }
        return final;
    }

    function showNotification(message) {
        const existing = document.querySelector('.qr-notification');
        if (existing) existing.remove();
        const notif = document.createElement('div');
        notif.className = 'qr-notification';
        notif.textContent = message;
        notif.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:12px 24px;border-radius:8px;font-size:13px;z-index:2147483647;font-family:SF Mono,monospace;border:1px solid #333;';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 1800);
    }

    function setupEventListeners() {
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentMode = tab.dataset.tab;
                if (currentMode === 'text') {
                    qrTextSection.style.display = 'block';
                    qrUrlSection.style.display = 'none';
                } else {
                    qrTextSection.style.display = 'none';
                    qrUrlSection.style.display = 'block';
                    loadCurrentTab();
                }
            });
        });

        qrGenerateBtn.addEventListener('click', () => {
            if (currentMode === 'text') {
                generateQRCode(qrTextInput.value);
            } else {
                generateQRCode(qrCurrentUrl.textContent);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal() {
        overlay.classList.add('active');
        qrTextInput.value = '';
        qrResult.innerHTML = '<div class="qr-empty">Enter text and tap Generate</div>';
        if (currentMode === 'url') loadCurrentTab();
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'openQRCode') {
            openModal();
            sendResponse({ success: true });
        }
    });

    window.QRWidget = { open: openModal, close: closeModal };
    init();
})();
