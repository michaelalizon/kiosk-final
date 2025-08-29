// Initialize the kiosk when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kiosk system initialized');
    updateClock();
    setInterval(updateClock, 1000); // Update clock every second
    
    // Add touch feedback for better kiosk experience
    addTouchFeedback();
});

// Update the current time display
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Handle service selection
function selectService(serviceType) {
    console.log(`Service selected: ${serviceType}`);
    
    // Add visual feedback
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => card.style.transform = 'scale(1)');
    
    // Find the clicked card and animate it
    const clickedCard = event.currentTarget;
    clickedCard.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        clickedCard.style.transform = 'scale(1)';
        handleServiceNavigation(serviceType);
    }, 150);
}

// Handle navigation to different services
function handleServiceNavigation(serviceType) {
    switch(serviceType) {
        case 'info':
            showServiceModal('Information Center', 'Welcome to our information center. Here you can find general information, FAQs, and helpful resources.');
            break;
        case 'directory':
            showServiceModal('Directory', 'Building directory and navigation system. Find locations, departments, and get directions.');
            break;
        case 'services':
            showServiceModal('Services', 'Available services include customer support, technical assistance, and general inquiries.');
            break;
        case 'contact':
            showServiceModal('Contact Information', 'Phone: (555) 123-4567<br>Email: info@example.com<br>Hours: Mon-Fri 9AM-5PM');
            break;
        default:
            console.log('Unknown service type');
    }
}

// Show a modal with service information
function showServiceModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>${content}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Back to Home</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 2px solid #ecf0f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #2c3e50;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #7f8c8d;
            padding: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .close-btn:hover {
            background: #ecf0f1;
            color: #e74c3c;
        }
        
        .modal-body {
            padding: 20px;
            color: #7f8c8d;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
        }
        
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: scale(0.8) translateY(-50px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
    `;
    
    // Add styles to head if not already present
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal function
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add touch feedback for better kiosk experience
function addTouchFeedback() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Add fade out animation to modal
const additionalStyles = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);