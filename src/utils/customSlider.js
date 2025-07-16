export function initCustomSlider(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Slider container ${containerId} not found`);
        return null;
    }

    const wrapper = container.querySelector('.swiper-wrapper');
    const slides = container.querySelectorAll('.swiper-slide');
    const prevButton = container.querySelector('.swiper-button-prev');
    const nextButton = container.querySelector('.swiper-button-next');
    const paginationCurrent = container.querySelector('.swiper-pagination-current');
    const paginationTotal = container.querySelector('.swiper-pagination-total');

    if (!wrapper || slides.length === 0) {
        console.warn('Slider wrapper or slides not found');
        return null;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;

    // CSS 스타일 설정
    container.style.overflow = 'hidden';
    wrapper.style.display = 'flex';
    wrapper.style.transition = 'transform 0.3s ease';
    wrapper.style.transform = 'translateX(0px)';

    slides.forEach((slide, index) => {
        slide.style.flex = '0 0 100%';
        slide.style.width = '100%';
        if (index === 0) {
            slide.classList.add('swiper-slide-active');
        }
    });

    // 페이지네이션 업데이트
    function updatePagination() {
        if (paginationCurrent) {
            paginationCurrent.textContent = currentIndex + 1;
        }
        if (paginationTotal) {
            paginationTotal.textContent = totalSlides;
        }
    }

    // 슬라이드 이동
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentIndex = index;
        const translateX = -currentIndex * 100;
        wrapper.style.transform = `translateX(${translateX}%)`;
        
        // 활성 슬라이드 클래스 업데이트
        slides.forEach((slide, i) => {
            slide.classList.toggle('swiper-slide-active', i === currentIndex);
            slide.classList.toggle('swiper-slide-prev', i === currentIndex - 1);
            slide.classList.toggle('swiper-slide-next', i === currentIndex + 1);
        });
        
        updatePagination();
    }

    // 다음 슬라이드
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    // 이전 슬라이드
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    // 이벤트 리스너 추가
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    // 초기 페이지네이션 설정
    updatePagination();

    // 키보드 지원
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 터치 지원 (모바일)
    let startX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // 최소 50px 이동 시에만 반응
            if (diffX > 0) {
                nextSlide(); // 왼쪽으로 스와이프 = 다음
            } else {
                prevSlide(); // 오른쪽으로 스와이프 = 이전
            }
        }
        
        isDragging = false;
    });

    // 마우스 드래그 지원 (데스크톱)
    let mouseStartX = 0;
    let isMouseDragging = false;

    container.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
        e.preventDefault();
    });

    document.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        
        const endX = e.clientX;
        const diffX = mouseStartX - endX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isMouseDragging = false;
        container.style.cursor = 'grab';
    });

    // 슬라이더 객체 반환
    return {
        container,
        currentIndex,
        totalSlides,
        goToSlide,
        nextSlide,
        prevSlide,
        destroy: () => {
            if (nextButton) nextButton.removeEventListener('click', nextSlide);
            if (prevButton) prevButton.removeEventListener('click', prevSlide);
        }
    };
}
