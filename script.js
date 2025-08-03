// Demo data for groups
const groups = [
    { id: 1, name: "Tech Innovators", members: 45, chainLength: 156, status: "active", trend: "up" },
    { id: 2, name: "Community Heroes", members: 38, chainLength: 142, status: "active", trend: "up" },
    { id: 3, name: "Green Warriors", members: 52, chainLength: 128, status: "active", trend: "down" },
    { id: 4, name: "Education First", members: 41, chainLength: 115, status: "active", trend: "up" },
    { id: 5, name: "Health Champions", members: 33, chainLength: 98, status: "active", trend: "stable" },
    { id: 6, name: "Art Collective", members: 29, chainLength: 87, status: "active", trend: "up" },
    { id: 7, name: "Youth United", members: 36, chainLength: 76, status: "active", trend: "down" },
    { id: 8, name: "Senior Support", members: 27, chainLength: 65, status: "active", trend: "up" }
];

// State management
let userHelpCount = 0;
let selectedGroup = null;
let animationInterval = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeLeaderboard();
    populateGroupSelect();
    setupEventListeners();
    startAnimations();
    updateTournamentCountdown();
});

// Initialize leaderboard
function initializeLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';
    
    // Sort groups by chain length
    const sortedGroups = [...groups].sort((a, b) => b.chainLength - a.chainLength);
    
    sortedGroups.forEach((group, index) => {
        const rank = index + 1;
        const leaderboardItem = createLeaderboardItem(group, rank);
        leaderboardElement.appendChild(leaderboardItem);
    });
}

// Create leaderboard item
function createLeaderboardItem(group, rank) {
    const item = document.createElement('div');
    item.className = `leaderboard-item ${rank <= 3 ? `rank-${rank}` : ''}`;
    
    const trendIcon = group.trend === 'up' ? '📈' : group.trend === 'down' ? '📉' : '➡️';
    const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    
    item.innerHTML = `
        <div class="leaderboard-rank">${rankEmoji} #${rank}</div>
        <div class="leaderboard-info">
            <div class="leaderboard-name">${group.name}</div>
            <div class="leaderboard-members">${group.members} members</div>
        </div>
        <div class="leaderboard-chain">
            <div class="chain-count">${group.chainLength}</div>
            <div class="chain-label">chain length</div>
            <div class="chain-status">
                <span>${trendIcon}</span>
                <span>Active</span>
            </div>
        </div>
    `;
    
    return item;
}

// Populate group select dropdown
function populateGroupSelect() {
    const groupSelect = document.getElementById('groupSelect');
    
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = `${group.name} (${group.chainLength} chain)`;
        groupSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Start helping button
    const startHelpingBtn = document.getElementById('startHelpingBtn');
    startHelpingBtn.addEventListener('click', () => {
        const participationSection = document.getElementById('participationSection');
        participationSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Help form submission
    const helpForm = document.getElementById('helpForm');
    helpForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const groupId = parseInt(document.getElementById('groupSelect').value);
    const helpMessage = document.getElementById('helpMessage').value;
    
    if (!userName || !groupId) return;
    
    // Find selected group
    selectedGroup = groups.find(g => g.id === groupId);
    if (!selectedGroup) return;
    
    // Simulate chain update
    updateChainForGroup(selectedGroup);
    
    // Update stats
    updateStats();
    
    // Show success modal
    showSuccessModal(userName, selectedGroup.name);
    
    // Reset form
    e.target.reset();
    
    // Refresh leaderboard with animation
    setTimeout(() => {
        initializeLeaderboard();
        animateChainUpdate(selectedGroup.id);
    }, 500);
}

// Update chain for selected group
function updateChainForGroup(group) {
    // Increase chain length
    group.chainLength += Math.floor(Math.random() * 3) + 1;
    group.members += 1;
    group.trend = 'up';
    
    // Update user help count
    userHelpCount++;
    
    // Check for achievement unlock
    checkAchievements();
}

// Update global stats
function updateStats() {
    // Animate stat updates
    animateValue('totalChains', 247, 248, 500);
    animateValue('totalHelpers', 1842, 1843, 500);
    
    // Check if new longest chain
    const maxChain = Math.max(...groups.map(g => g.chainLength));
    const currentLongest = parseInt(document.getElementById('longestChain').textContent);
    if (maxChain > currentLongest) {
        animateValue('longestChain', currentLongest, maxChain, 1000);
    }
}

// Animate value changes
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + range * progress);
        element.textContent = current.toLocaleString();
        
        if (progress >= 1) {
            clearInterval(timer);
        }
    }, 16);
}

// Show success modal
function showSuccessModal(userName, groupName) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = `Thank you ${userName}! You've successfully added to ${groupName}'s chain. Keep the kindness flowing!`;
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// Animate chain update effect
function animateChainUpdate(groupId) {
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    leaderboardItems.forEach((item, index) => {
        const itemGroup = groups.find(g => g.name === item.querySelector('.leaderboard-name').textContent);
        if (itemGroup && itemGroup.id === groupId) {
            item.style.transition = 'all 0.5s ease';
            item.style.transform = 'scale(1.05)';
            item.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)';
            
            setTimeout(() => {
                item.style.transform = 'scale(1)';
                item.style.boxShadow = 'none';
            }, 1000);
        }
    });
}

// Check and unlock achievements
function checkAchievements() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    // Unlock achievements based on help count
    if (userHelpCount >= 1 && achievementCards.length > 0) {
        achievementCards[0].classList.add('unlocked');
    }
    if (userHelpCount >= 5 && achievementCards.length > 1) {
        achievementCards[1].classList.add('unlocked');
    }
    if (userHelpCount >= 10 && achievementCards.length > 2) {
        achievementCards[2].classList.add('unlocked');
    }
}

// Start background animations
function startAnimations() {
    // Simulate random chain updates
    animationInterval = setInterval(() => {
        const randomGroup = groups[Math.floor(Math.random() * groups.length)];
        randomGroup.chainLength += Math.floor(Math.random() * 2);
        
        // Randomly update trends
        const trends = ['up', 'down', 'stable'];
        randomGroup.trend = trends[Math.floor(Math.random() * trends.length)];
        
        // Refresh leaderboard occasionally
        if (Math.random() > 0.7) {
            initializeLeaderboard();
        }
    }, 5000);
}

// Update tournament countdown
function updateTournamentCountdown() {
    const countdownElement = document.getElementById('tournamentCountdown');
    const tournamentTimeElement = document.getElementById('tournamentTime');
    
    // Set initial time (2 days 14 hours in milliseconds)
    let timeRemaining = 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;
    
    setInterval(() => {
        timeRemaining -= 1000;
        
        const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        
        const timeString = `${days}d ${hours}h ${minutes}m`;
        countdownElement.textContent = timeString;
        tournamentTimeElement.textContent = `${days}d ${hours}h`;
    }, 1000);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add hover effects for interactive elements
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.stat-card, .achievement-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
});