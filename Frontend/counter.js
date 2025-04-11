document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('visitCount');
    
    // Check if element exists
    if (!counterElement) {
        console.error('visitCount element not found');
        return;
    }

    async function updateCounter() {
        try {
            const response = await fetch('http://localhost:7071/api/counterTrigger');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.text();
            console.log('Raw response:', result); // Debug log
            
            // Extract number (handles different response formats)
            const countMatch = result.match(/\d+/);
            const count = countMatch ? countMatch[0] : '0';
            
            counterElement.textContent = count;
            console.log('Counter updated:', count); // Debug log
            
        } catch (error) {
            console.error('Counter fetch failed:', error);
            counterElement.textContent = '0';
        }
    }

    updateCounter();
});