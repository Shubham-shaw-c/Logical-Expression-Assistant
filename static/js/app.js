// User Management
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || [];

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials!');
    }
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful!');
    showLogin();
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Main Application Logic
const conditionActions = {
    'sleeping': {
        message: 'Since you are going to sleep:',
        actions: [
            'lights are turned off',
            'windows are closed',
            'the alarm is set for 5 o\'clock',
            'air conditioner is turned on (if room temperature is above 28°C)'
        ]
    },
    'cooking': {
        message: 'Since you are cooking:',
        actions: [
            'Spotify shifts from lo-fi to energetic beats',
            'kitchen lights are adjusted to optimal brightness',
            'exhaust fan is turned on'
        ]
    },
    'fridge': {
        message: 'Fridge Inventory Update:',
        actions: [
            () => getRandomFoodItem() + ' expires tomorrow',
            'suggesting recipes based on available ingredients',
            'displaying current temperature: 4°C'
        ]
    },
    'morning': {
        message: 'Good Morning! Here\'s your morning routine:',
        actions: [
            'curtains are opened',
            'coffee machine is turned on',
            'morning playlist is started',
            'weather forecast is displayed'
        ]
    },
    'evening': {
        message: 'Evening Routine Activated:',
        actions: [
            'lights are dimmed',
            'relaxing music is played',
            'temperature is adjusted to 24°C',
            'dinner recipes are suggested'
        ]
    },
    'party': {
        message: 'Party Mode Activated:',
        actions: [
            'disco lights are turned on',
            'party playlist is started',
            'temperature is set to 22°C',
            'snack suggestions are displayed'
        ]
    },
    'study': {
        message: 'Study Mode Activated:',
        actions: [
            'focus lighting is turned on',
            'white noise is played',
            'phone notifications are silenced',
            'study timer is set for 45 minutes'
        ]
    },
    'workout': {
        message: 'Workout Mode Activated:',
        actions: [
            'energetic workout playlist is started',
            'lights are set to full brightness',
            'temperature is set to 20°C',
            'workout timer is started'
        ]
    }
};

const foodItems = [
    'oat milk', 'bread', 'butter', 'yogurt', 'cheese',
    'eggs', 'vegetables', 'fruits', 'meat', 'fish'
];

function getRandomFoodItem() {
    return foodItems[Math.floor(Math.random() * foodItems.length)];
}

function addMessage(content, isUser = false, condition = null) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (!isUser) {
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        messageContent.appendChild(icon);
    }
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    if (!isUser && condition) {
        messageText.setAttribute('data-condition', condition);
    }
    
    messageText.innerHTML = content;
    messageContent.appendChild(messageText);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processInput() {
    const userInput = document.getElementById('userInput');
    if (!userInput) return;
    
    const input = userInput.value.toLowerCase().trim();
    if (!input) return;

    addMessage(input, true);
    userInput.value = '';

    if (conditionActions[input]) {
        const condition = conditionActions[input];
        
        let response = `<strong>${condition.message}</strong><br>`;
        condition.actions.forEach(action => {
            const actionText = typeof action === 'function' ? action() : action;
            response += `• ${actionText}<br>`;
        });

        addMessage(response, false, input);
        playAudio();
    } else {
        addMessage('Invalid condition. Please try one of the examples above.');
    }
}

// Audio Controls
let audioEnabled = true;
const audio = document.getElementById('actionAudio');

function toggleAudio() {
    if (!audio) return;
    
    audioEnabled = !audioEnabled;
    const button = document.querySelector('.audio-controls button');
    if (button) {
        button.innerHTML = `<i class="fas fa-volume-${audioEnabled ? 'up' : 'mute'}"></i> Toggle Audio`;
    }
}

function playAudio() {
    if (audioEnabled && audio) {
        try {
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
        } catch (error) {
            console.error('Audio error:', error);
        }
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for Enter key in chat input
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                processInput();
            }
        });
    }

    // Add event listeners for login/register form inputs
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    if (loginUsername && loginPassword) {
        loginUsername.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }

    if (registerUsername && registerPassword && confirmPassword) {
        registerUsername.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                register();
            }
        });
        registerPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                register();
            }
        });
        confirmPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                register();
            }
        });
    }
}); 