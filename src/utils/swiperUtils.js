// 통합 Swiper 유틸리티
export function initSwiper(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('❌ Swiper container not found:', containerId);
        return null;
    }

    // CDN에서 Swiper 로드
    if (!window.Swiper) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        script.onload = () => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
            document.head.appendChild(css);
            
            setTimeout(() => {
                createSwiper(containerId);
            }, 100);
        };
        document.head.appendChild(script);
    } else {
        return createSwiper(containerId);
    }
}

// Swiper 생성 함수 (3초마다 자동 슬라이드)
function createSwiper(containerId) {
    try {
        const swiper = new window.Swiper(`#${containerId}`, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            // 3초마다 자동 슬라이드
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
            },
            on: {
                init: function() {
                    console.log('✅ Swiper 초기화 성공:', containerId);
                },
                slideChange: function() {
                    console.log(`📍 슬라이드 변경: ${this.activeIndex + 1}/${this.slides.length}`);
                }
            }
        });
        
        console.log('🎯 Swiper 객체 생성됨:', swiper);
        return swiper;
    } catch (error) {
        console.error('❌ Swiper 생성 실패:', error);
        return null;
    }
}
