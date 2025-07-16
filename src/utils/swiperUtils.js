let swiperLoaded = false;

export function loadSwiperCDN() {
    return new Promise((resolve, reject) => {
        if (swiperLoaded) {
            resolve();
            return;
        }

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        script.onload = () => {
            swiperLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('Swiper CDN 로드 실패'));
        document.head.appendChild(script);
    });
}

export function initSwiper(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        return null;
    }

    if (!window.Swiper) {
        loadSwiperCDN().then(() => {
            setTimeout(() => {
                createSwiper(containerId);
            }, 100);
        });
    } else {
        return createSwiper(containerId);
    }
}

function createSwiper(containerId) {
    try {
        const swiper = new window.Swiper(`#${containerId}`, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            navigation: {
                nextEl: `#${containerId} .swiper-button-next`,
                prevEl: `#${containerId} .swiper-button-prev`,
            },
            pagination: {
                el: `#${containerId} .swiper-pagination`,
                type: 'custom',
                renderCustom: function (swiper, current, total) {
                    return `<span class="swiper-pagination-current">${current}</span> / <span class="swiper-pagination-total">${total}</span>`;
                }
            }
        });
        
        return swiper;
    } catch (error) {
        return initCustomSlider(containerId);
    }
}

export function initCustomSlider(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        return null;
    }

    const wrapper = container.querySelector('.swiper-wrapper');
    const slides = container.querySelectorAll('.swiper-slide');
    const prevButton = container.querySelector('.swiper-button-prev');
    const nextButton = container.querySelector('.swiper-button-next');
    const paginationCurrent = container.querySelector('.swiper-pagination-current');
    const paginationTotal = container.querySelector('.swiper-pagination-total');

    if (!wrapper || slides.length === 0) {
        return null;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;

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

    function updatePagination() {
        if (paginationCurrent) {
            paginationCurrent.textContent = currentIndex + 1;
        }
        if (paginationTotal) {
            paginationTotal.textContent = totalSlides;
        }
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentIndex = index;
        const translateX = -currentIndex * 100;
        wrapper.style.transform = `translateX(${translateX}%)`;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('swiper-slide-active', i === currentIndex);
        });
        
        updatePagination();
    }

    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    updatePagination();

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