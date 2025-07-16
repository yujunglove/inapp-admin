import { Swiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function initSwiper(containerId, autoplay = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Swiper container ${containerId} not found`);
        return null;
    }

    // 이미 초기화된 Swiper가 있는지 확인
    if (container.swiper) {
        container.swiper.destroy(true, true);
    }

    try {
        const swiperConfig = {
            // 기본 설정
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            
            // 네비게이션
            navigation: {
                nextEl: `#${containerId} .swiper-button-next`,
                prevEl: `#${containerId} .swiper-button-prev`,
            },
            
            // 페이지네이션 - 커스텀 형태로 변경
            pagination: {
                el: `#${containerId} .swiper-pagination`,
                type: 'custom',
                renderCustom: function (swiper, current, total) {
                    return `<span class="swiper-pagination-current">${current}</span> / <span class="swiper-pagination-total">${total}</span>`;
                }
            },
            
            // 터치/드래그 설정
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            
            // 이벤트
            on: {
                init: function() {
                    console.log('✅ Swiper initialized successfully');
                    // 네비게이션 버튼 상태 업데이트
                    this.emit('navigationUpdate');
                },
                slideChange: function() {
                    console.log(`현재 슬라이드: ${this.activeIndex + 1}/${this.slides.length}`);
                },
                reachBeginning: function() {
                    const prevBtn = container.querySelector('.swiper-button-prev');
                    if (prevBtn) prevBtn.style.opacity = '0.3';
                },
                reachEnd: function() {
                    const nextBtn = container.querySelector('.swiper-button-next');
                    if (nextBtn) nextBtn.style.opacity = '0.3';
                },
                fromEdge: function() {
                    const prevBtn = container.querySelector('.swiper-button-prev');
                    const nextBtn = container.querySelector('.swiper-button-next');
                    if (prevBtn) prevBtn.style.opacity = '1';
                    if (nextBtn) nextBtn.style.opacity = '1';
                }
            }
        };

        // autoplay 옵션이 true면 자동 슬라이드 추가
        if (autoplay) {
            swiperConfig.autoplay = {
                delay: 3000, // 3초마다 다음 슬라이드로
                disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
                pauseOnMouseEnter: true // 마우스 호버 시 일시정지
            };
        }

        const swiper = new Swiper(container, swiperConfig);

        return swiper;
    } catch (error) {
        console.error('Swiper initialization failed:', error);
        return null;
    }
}

// DOM이 로드된 후 자동으로 Swiper 찾아서 초기화
export function autoInitSwipers() {
    document.addEventListener('DOMContentLoaded', () => {
        const swiperContainers = document.querySelectorAll('.swiper');
        swiperContainers.forEach((container, index) => {
            if (!container.id) {
                container.id = `swiper-${index}`;
            }
            initSwiper(container.id);
        });
    });
}
