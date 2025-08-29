// Slideshow variables
let slides = [];
let currentSlideIndex = 0;
let isAutoPlaying = true;
let autoPlayInterval;
let progressInterval;
let config = {
    autoAdvanceTime: 5000, // 5 seconds per slide
    showControls: true,
    enableTransitions: true,
    transitionDuration: 1000 // 1 second transition
};

// Initialize the kiosk when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kiosk system initialized');
    updateClock();
    setInterval(updateClock, 1000); // Update clock every second
    
    // Load slideshow data immediately
    loadSlideshowData();
    
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

// Load slideshow data from Google Sheets
function loadSlideshowData() {
    console.log('Loading slideshow data...');
    
    // Call Google Apps Script function
    google.script.run
        .withSuccessHandler(onDataLoaded)
        .withFailureHandler(onDataError)
        .getSlideshowData();
}

// Handle successful data loading
function onDataLoaded(data) {
    console.log('Slideshow data loaded:', data);
    
    if (!data || data.length === 0) {
        showError('No slideshow data found in the spreadsheet.');
        return;
    }
    
    slides = data;
    initializeSlideshow();
}

// Handle data loading error
function onDataError(error) {
    console.error('Error loading slideshow data:', error);
    showError('Failed to load slideshow data. Please check your internet connection and try again.');
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Initialize the slideshow
function initializeSlideshow() {
    const loadingScreen = document.getElementById('loadingScreen');
    const slideshowContainer = document.getElementById('slideshowContainer');
    const slidesContainer = document.getElementById('slidesContainer');
    const totalSlidesSpan = document.getElementById('totalSlides');
    
    // Hide loading screen
    loadingScreen.style.display = 'none';
    slideshowContainer.style.display = 'block';
    
    // Update total slides counter
    totalSlidesSpan.textContent = slides.length;
    
    // Generate slide HTML
    slidesContainer.innerHTML = slides.map((slide, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
            <div class="slide-image">
                <img src="${slide.imageUrl}" alt="${slide.title}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+'; this.onerror=null;">
            </div>
            <div class="slide-content">
                <h2 class="slide-title">${slide.title}</h2>
                <p class="slide-description">${slide.description}</p>
            </div>
        </div>
    `).join('');
    
    // Start auto-play
    startAutoPlay();
    updateSlideCounter();
}

// Navigate to next slide
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    
    slides[currentSlideIndex].classList.add('active');
    updateSlideCounter();
    resetProgress();
}

// Navigate to previous slide
function previousSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    
    slides[currentSlideIndex].classList.add('active');
    updateSlideCounter();
    resetProgress();
}

// Toggle auto-play
function toggleAutoPlay() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (isAutoPlaying) {
        stopAutoPlay();
        playPauseBtn.textContent = '▶️ Play';
    } else {
        startAutoPlay();
        playPauseBtn.textContent = '⏸️ Pause';
    }
    
    isAutoPlaying = !isAutoPlaying;
}

// Start auto-play
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    if (progressInterval) clearInterval(progressInterval);
    
    autoPlayInterval = setInterval(nextSlide, config.autoAdvanceTime);
    startProgress();
}

// Stop auto-play
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    resetProgress();
}

// Start progress bar animation
function startProgress() {
    const progressBar = document.getElementById('progressBar');
    let progress = 0;
    const increment = 100 / (config.autoAdvanceTime / 100);
    
    progressBar.style.width = '0%';
    
    progressInterval = setInterval(() => {
        progress += increment;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            progress = 0;
        }
    }, 100);
}

// Reset progress bar
function resetProgress() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    
    if (isAutoPlaying) {
        startProgress();
    }
}

// Update slide counter
function updateSlideCounter() {
    const currentSlideSpan = document.getElementById('currentSlide');
    currentSlideSpan.textContent = currentSlideIndex + 1;
}

// Toggle services menu
function toggleServicesMenu() {
    const overlay = document.getElementById('servicesOverlay');
    
    if (overlay.style.display === 'none' || overlay.style.display === '') {
        overlay.style.display = 'flex';
        overlay.style.animation = 'fadeIn 0.3s ease';
        // Pause slideshow when menu is open
        if (isAutoPlaying) {
            stopAutoPlay();
        }
    } else {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.style.display = 'none';
            // Resume slideshow when menu is closed
            if (!isAutoPlaying) {
                isAutoPlaying = true;
                startAutoPlay();
                document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
            }
        }, 300);
    }
}

// Handle service selection
function selectService(serviceType) {
    console.log(`Service selected: ${serviceType}`);
    
    // Close services menu first
    toggleServicesMenu();
    
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
    // Will add touch feedback for service cards when they are loaded
    setTimeout(() => {
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
    }, 1000);
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            previousSlide();
            break;
        case 'ArrowRight':
        case ' ':
            nextSlide();
            break;
        case 'Escape':
            // Close services menu if open
            const overlay = document.getElementById('servicesOverlay');
            if (overlay.style.display === 'flex') {
                toggleServicesMenu();
            }
            break;
        case 'p':
        case 'P':
            toggleAutoPlay();
            break;
        case 'm':
        case 'M':
            toggleServicesMenu();
            break;
    }
});

// Touch/swipe support for slideshow
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', function(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    if (!startX || !startY) return;
    
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Minimum swipe distance
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextSlide(); // Swipe left = next slide
        } else {
            previousSlide(); // Swipe right = previous slide
        }
    }
    
    startX = 0;
    startY = 0;
});