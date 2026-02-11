// ========================================
// VS Code Portfolio — index.js
// ========================================

// Tab data mapping
const tabFileMap = {
    'about':       { file: 'about.html',      icon: 'html-icon', type: 'HTML' },
    'projects':    { file: 'projects.js',      icon: 'js-icon',   type: 'JavaScript' },
    'skills':      { file: 'skills.json',      icon: 'json-icon', type: 'JSON' },
    'experience':  { file: 'experience.ts',    icon: 'ts-icon',   type: 'TypeScript' },
    'contact':     { file: 'contact.css',      icon: 'css-icon',  type: 'CSS' },
    'ml-projects': { file: 'ml_projects.py',   icon: 'py-icon',   type: 'Python' },
    'fullstack':   { file: 'fullstack.jsx',    icon: 'jsx-icon',  type: 'React JSX' }
};

// Track open tabs
let openTabs = new Set(['about']);
let activeTab = 'about';

// Open a tab
function openTab(tabId, fileElement) {
    // Add to open tabs
    openTabs.add(tabId);

    // Deactivate all tabs and content
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));

    // Show tab content
    const content = document.getElementById('tab-' + tabId);
    if (content) content.classList.add('active');

    // Activate file in sidebar
    if (fileElement) {
        fileElement.classList.add('active');
    } else {
        const sidebarFile = document.querySelector(`.file-item[data-tab="${tabId}"]`);
        if (sidebarFile) sidebarFile.classList.add('active');
    }

    // Create tab if doesn't exist in tab bar
    const tabBar = document.getElementById('tabBar');
    let existingTab = tabBar.querySelector(`.tab[data-tab="${tabId}"]`);
    
    if (!existingTab) {
        const info = tabFileMap[tabId];
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tab = tabId;
        tab.onclick = () => openTab(tabId);
        tab.innerHTML = `
            <i class="fas fa-file-code file-icon ${info.icon}"></i>
            <span>${info.file}</span>
            <span class="tab-close" onclick="event.stopPropagation(); closeTab('${tabId}', this.parentElement)">&times;</span>
        `;
        tabBar.appendChild(tab);
        existingTab = tab;
    }

    // Activate the tab
    existingTab.classList.add('active');
    activeTab = tabId;

    // Update breadcrumbs
    const info = tabFileMap[tabId];
    document.getElementById('breadcrumb-file').textContent = info.file;

    // Update status bar file type
    document.getElementById('statusFileType').textContent = info.type;

    // Scroll editor to top
    document.getElementById('editorContent').scrollTop = 0;
}

// Close a tab
function closeTab(tabId, tabElement) {
    openTabs.delete(tabId);
    
    if (tabElement) {
        tabElement.remove();
    }

    // Hide content
    const content = document.getElementById('tab-' + tabId);
    if (content) content.classList.remove('active');

    // If we closed the active tab, switch to last open tab
    if (activeTab === tabId) {
        const remaining = Array.from(openTabs);
        if (remaining.length > 0) {
            openTab(remaining[remaining.length - 1]);
        }
    }

    // Deactivate sidebar file
    const sidebarFile = document.querySelector(`.file-item[data-tab="${tabId}"]`);
    if (sidebarFile) sidebarFile.classList.remove('active');
}

// Toggle sidebar sections
function toggleSidebarSection(titleEl) {
    const filesEl = titleEl.nextElementSibling;
    const chevron = titleEl.querySelector('i');

    if (filesEl.classList.contains('active')) {
        filesEl.classList.remove('active');
        chevron.className = 'fas fa-chevron-right';
    } else {
        filesEl.classList.add('active');
        chevron.className = 'fas fa-chevron-down';
    }
}

// Toggle terminal
function toggleTerminal() {
    const panel = document.getElementById('terminalPanel');
    const icon = panel.querySelector('.terminal-toggle i');
    
    if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        icon.className = 'fas fa-chevron-down';
    } else {
        panel.classList.add('collapsed');
        icon.className = 'fas fa-chevron-up';
    }
}

// ========================================
// Typing Effects
// ========================================

// Hero subtitle typing
const heroTexts = [
    'Developer.',
    'Student.',
    'Tech-Enthusiast.',
    'Problem Solver.',
    'Full Stack Dev.'
];

let heroTextIndex = 0;
let heroCharIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeHero() {
    const current = heroTexts[heroTextIndex];
    
    if (!isDeleting) {
        typingEl.textContent = '> ' + current.substring(0, heroCharIndex + 1);
        heroCharIndex++;

        if (heroCharIndex === current.length) {
            setTimeout(() => { isDeleting = true; typeHero(); }, 2000);
            return;
        }
        setTimeout(typeHero, 80);
    } else {
        typingEl.textContent = '> ' + current.substring(0, heroCharIndex);
        heroCharIndex--;

        if (heroCharIndex < 0) {
            isDeleting = false;
            heroTextIndex = (heroTextIndex + 1) % heroTexts.length;
            heroCharIndex = 0;
            setTimeout(typeHero, 400);
            return;
        }
        setTimeout(typeHero, 40);
    }
}

// Terminal typing effect
const terminalCommands = [
    'cat welcome.txt',
    'echo "Welcome to my portfolio!"',
    'node server.js --port 3000',
    'npm run build && npm run deploy',
    'git push origin main'
];

let termCmdIndex = 0;
let termCharIndex = 0;
const termTypingEl = document.getElementById('terminalTyping');

function typeTerminal() {
    const cmd = terminalCommands[termCmdIndex];

    if (termCharIndex <= cmd.length) {
        termTypingEl.textContent = cmd.substring(0, termCharIndex);
        termCharIndex++;
        setTimeout(typeTerminal, 60);
    } else {
        setTimeout(() => {
            termCharIndex = 0;
            termCmdIndex = (termCmdIndex + 1) % terminalCommands.length;
            termTypingEl.textContent = '';
            setTimeout(typeTerminal, 500);
        }, 3000);
    }
}

// ========================================
// Activity Bar Interaction
// ========================================

document.querySelectorAll('.activity-icon[data-section]').forEach(icon => {
    icon.addEventListener('click', () => {
        const section = icon.dataset.section;

        document.querySelectorAll('.activity-icon[data-section]').forEach(i => i.classList.remove('active'));
        icon.classList.add('active');

        const sidebar = document.getElementById('sidebar');
        if (section === 'explorer') {
            sidebar.style.display = 'block';
        } else {
            // Toggle sidebar for non-explorer sections
            if (sidebar.style.display === 'none') {
                sidebar.style.display = 'block';
            } else {
                sidebar.style.display = 'none';
            }
        }
    });
});

// ========================================
// Initialize
// ========================================

window.addEventListener('load', () => {
    // Start typing effects
    setTimeout(typeHero, 600);
    setTimeout(typeTerminal, 1200);
});

// Console easter egg
console.log('%c✨ Shubham Khalkho — Portfolio', 'font-size: 18px; font-weight: bold; color: #007acc;');
console.log('%cBuilt to look like VS Code. Pretty cool, right?', 'font-size: 13px; color: #858585;');
console.log('%cFeel free to reach out if you want to collaborate!', 'font-size: 13px; color: #4ec9b0;');