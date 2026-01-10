class VisitCounter {
    constructor() {
        // For local testing
        //this.AZURE_FUNCTION_URL = 'http://localhost:7071/api/counter';
        this.AZURE_FUNCTION_URL = 'https://resume-counter.azurewebsites.net/api/counter';
        
        // For production (update with your actual Azure Function URL)
        // this.AZURE_FUNCTION_URL = 'https://your-function-app.azurewebsites.net/api/counter';
        
        this.counterElements = document.querySelectorAll('#visitCount');
        this.lastUpdatedElement = document.querySelector('#lastUpdated');

        //Initialize
        this.init();
    }


init() {
        if (this.counterElements.length === 0) {
            console.log('No counter elements found on this page');
            return;
        }

        // Show loading state
        this.counterElements.forEach(el => {
            el.textContent = '...';
            el.classList.add('loading');
        });

        // Always update counter on page load
        this.updateCounter();
    }

    async updateCounter() {
        try {
            console.log('Updating visit counter...');
            
            // Call Azure Function
            const response = await fetch(this.AZURE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent.substring(0, 100),
                    referrer: document.referrer || 'direct'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Counter response:', data);

            if (data.success) {
                // Store data locally for fallback display
                localStorage.setItem('lastCounterData', JSON.stringify({
                    count: data.count,
                    lastUpdated: data.lastUpdated,
                    timestamp: Date.now()
                }));
                
                // Update display
                this.updateDisplay(data);
                
                // Check for milestone celebration (every 100 views)
                if (data.count % 10 === 0) {
                    this.celebrateMilestone(data.count);
                }
            } else {
                console.error('Function returned success: false', data);
                this.displayCachedData();
            }

        } catch (error) {
            console.error('Error updating counter:', error);
            this.displayCachedData();
        }
    }

    updateDisplay(data) {
        // Remove loading state
        this.counterElements.forEach(el => {
            el.classList.remove('loading');
        });

        // Update all counter elements on the page
        this.counterElements.forEach(element => {
            element.textContent = data.count.toLocaleString();
            
            // Add animation effect
            element.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        });

        // Update last updated time with new format
        if (this.lastUpdatedElement && data.lastUpdated) {
            const date = new Date(data.lastUpdated);
            // Format: 1/8/2026, 8:40:38 PM
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
            
            this.lastUpdatedElement.textContent = `Visit count was last updated: ${formattedDate}, ${formattedTime}`;
            this.lastUpdatedElement.style.display = 'block';
        }
    }

    displayCachedData() {
        try {
            // Try to get cached data from localStorage
            const cached = localStorage.getItem('lastCounterData');
            if (cached) {
                const data = JSON.parse(cached);
                
                // Remove loading state
                this.counterElements.forEach(el => {
                    el.classList.remove('loading');
                });
                
                // Display cached count
                this.counterElements.forEach(element => {
                    element.textContent = data.count.toLocaleString();
                    element.style.opacity = '0.8';
                });
                
                // Show cached time
                if (this.lastUpdatedElement && data.lastUpdated) {
                    const date = new Date(data.lastUpdated);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const formattedTime = date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    
                    this.lastUpdatedElement.textContent = `Last known update: ${formattedDate}, ${formattedTime}`;
                    this.lastUpdatedElement.style.display = 'block';
                }
            } else {
                // No cached data available
                this.displayFallback();
            }
        } catch (error) {
            console.error('Error reading cache:', error);
            this.displayFallback();
        }
    }

    displayFallback() {
        // Simple fallback
        this.counterElements.forEach(element => {
            element.classList.remove('loading');
            element.textContent = '1';
            element.style.opacity = '0.7';
        });
    }

    celebrateMilestone(count) {
        console.log(`Milestone reached: ${count} views!`);
        
        // Add emoji celebration to all counter elements
        this.counterElements.forEach(element => {
            // Create celebration emoji element
            const emoji = document.createElement('span');
            emoji.textContent = ' 🎉';
            emoji.className = 'celebration-emoji';
            emoji.style.fontSize = '1.2em';
            emoji.style.marginLeft = '5px';
            emoji.style.opacity = '0';
            emoji.style.animation = 'emojiCelebrate 2s ease-in-out';
            
            // Append emoji to counter
            element.appendChild(emoji);
            
            // Also add celebration animation to the number
            element.classList.add('celebrating');
            
            // Remove emoji after animation
            setTimeout(() => {
                if (emoji.parentNode === element) {
                    element.removeChild(emoji);
                }
                element.classList.remove('celebrating');
            }, 2000);
        });

        // Show a toast notification for milestone
        this.showMilestoneToast(count);
    }

    showMilestoneToast(count) {
        // Create a temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'milestone-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span style="font-size: 1.5em; margin-right: 10px;">🎉</span>
                <div>
                    <strong>Milestone Achieved!</strong><br>
                    ${count.toLocaleString()} views reached!
                </div>
            </div>
        `;
        
        // Style the toast
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '15px 20px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        toast.style.zIndex = '1000';
        toast.style.animation = 'slideIn 0.3s ease-out';
        
        document.body.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize counter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new VisitCounter();
});