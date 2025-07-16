let swiperLoaded = false;

export function loadSwiperCDN() {
    return new Promise((resolve, reject) => {
        if (swiperLoaded) {
            resolve();
            return;
        }

        // CSS 로드
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(css);

        // JS 로드
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

export async function initSwiperFromCDN(containerId) {
    try {
        await loadSwiperCDN();
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Swiper container ${containerId} not found`);
            return null;
        }

        // 이미 초기화된 Swiper가 있는지 확인
        if (container.swiper) {
            container.swiper.destroy(true, true);
        }

        const swiper = new window.Swiper(container, {
            // 기본 설정
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            
            // 네비게이션
            navigation: {
                nextEl: `#${containerId} .swiper-button-next`,
                prevEl: `#${containerId} .swiper-button-prev`,
            },
            
            // 페이지네이션
            pagination: {
                el: `#${containerId} .swiper-pagination`,
                type: 'fraction',
                formatFractionCurrent: function (number) {
                    return number;
                },
                formatFractionTotal: function (number) {
                    return number;
                }
            },
            
            // 이벤트
            on: {
                init: function() {
                    console.log('Swiper initialized successfully via CDN');
                },
                slideChange: function() {
                    // 페이지네이션 업데이트
                    const currentEl = container.querySelector('.swiper-pagination-current');
                    const totalEl = container.querySelector('.swiper-pagination-total');
                    
                    if (currentEl) currentEl.textContent = this.activeIndex + 1;
                    if (totalEl) totalEl.textContent = this.slides.length;
                }
            }
        });

        return swiper;
    } catch (error) {
        console.error('Swiper CDN initialization failed:', error);
        return null;
    }
}
