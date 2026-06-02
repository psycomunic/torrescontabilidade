document.addEventListener('DOMContentLoaded', () => {
    const slidesWrapper = document.getElementById('slidesWrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressFill = document.getElementById('progressFill');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlide() {
        // Move the wrapper to show current slide
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;
        
        // Update progress bar
        const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // Update button states
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        prevBtn.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
        
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
        nextBtn.style.cursor = currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer';
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }

    // Button clicks
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Touch/Swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const minSwipeDistance = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance < -minSwipeDistance) {
            // Swiped left -> next slide
            nextSlide();
        } else if (swipeDistance > minSwipeDistance) {
            // Swiped right -> prev slide
            prevSlide();
        }
    }

    // Initialize
    updateSlide();
});
