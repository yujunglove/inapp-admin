import { DB_MAPPING } from '../config/dbMapping.js';
import { initSwiper } from '../utils/swiperUtils.js';

// HTML에서 스타일 정보를 완전히 보존하는 함수
function preserveAllStyles(html) {
    if (!html) return '';
    
    console.log('🎨 원본 HTML:', html);
    
    // 브라우저 환경에서만 DOM 사용
    if (typeof document === 'undefined') {
        return html; // 서버 환경에서는 그대로 반환
    }
    
    // 단순히 <p> 태그만 제거하고 나머지 모든 태그와 스타일 보존
    let result = html;
    
    // <p> 태그는 제거하되 내용과 스타일은 보존
    result = result.replace(/<p([^>]*)>/gi, '');
    result = result.replace(/<\/p>/gi, '');
    
    // 불필요한 div 태그 제거
    result = result.replace(/<div([^>]*)>/gi, '');
    result = result.replace(/<\/div>/gi, '');
    
    // 기타 블록 요소들은 span으로 변환
    result = result.replace(/<(h[1-6]|blockquote|pre)([^>]*)>/gi, '<span$2>');
    result = result.replace(/<\/(h[1-6]|blockquote|pre)>/gi, '</span>');
    
    console.log('🎨 처리된 HTML:', result);
    return result;
}

const ICONS = {
    closeWhite: 'https://quadmax.co.kr/qdx/images/qdx_close.svg',
    arrowLeft:'https://quadmax.co.kr/qdx/images/qdx_arrow_left.svg',
    arrowRight: 'https://quadmax.co.kr/qdx/images/qdx_arrow_right.svg'
};

export function generatePopupHTML(messageId, data) {
    console.log('🏗️ 팝업 HTML 생성 시작:', { messageId, data });
    
    const displayType = data.display.toLowerCase();
    
    // 🔥 code에서 템플릿 클래스 생성 (M1 → qdx_tmpl_m1)
    const templateClass = data.code ? `qdx_tmpl_${data.code.toLowerCase()}` : '';
    
    console.log('🎨 팝업 생성:', {
        displayType,
        code: data.code,
        templateClass,
        theme: data.theme,
        cssClass: data.cssClass,
        show: data.show,
        msg: data.msg
    });

    let html = `<div id="qdx_popup_wrap" class="qdx_popup_${messageId}" data-key="${messageId}" data-msg-id="${messageId}">
        <div id="qdx_type_${displayType}" class="${templateClass} qdx_popup_box qdx_pst_${data.location.toLowerCase()}">`;

    // 🔥 오늘하루 보지않기 옵션 - today가 'Y'일 때만 표시
    if (data.today === 'Y') {
        html += `<div class="qdx_close_box">
            <label class="qdx_close_today">
                <input type="checkbox" name="today" value="Y">
                오늘 하루 보지 않기
            </label>
            <span class="qdx_close">
                <img src="${ICONS.closeWhite}" alt="">
            </span>
        </div>`;
    } else {
        // today가 'N'이면 일반 닫기 버튼만
        html += `<span class="qdx_close">
            <img src="${ICONS.closeWhite}" alt="">
        </span>`;
    }

    // 콘텐츠 시작
    html += `<div class="qdx_cont">`;

    // 타입별 콘텐츠 생성
    if (displayType === 'slide') {
        html += generateSlideContent(data, messageId);
    } else if (displayType === 'star') {
        html += generateStarContent(data, messageId);
    } else {
        html += generateRegularContent(data, messageId);
    }

    html += `</div></div></div>`; // qdx_cont, qdx_popup_box, qdx_popup_wrap 닫기

    // DOM에 추가 후 슬라이더 초기화
    if (displayType === 'slide') {
        // HTML이 DOM에 추가된 후 슬라이더 초기화
        setTimeout(() => {
            const sliderId = `qdx_slide`;
            initSwiper(sliderId);
        }, 100);
    }

    return html;
}

// STAR 타입 전용 콘텐츠 생성 함수
function generateStarContent(data, messageId) {
    let html = '';

    // qdx_survey wrapper 추가
    html += '<div id="qdx_survey" class="qdx_cont">';

    // 별점 영역
    html += `<div class="qdx_score">
        <span class="qdx_startImg" data-score="1" onclick="selectStar(1)"></span>
        <span class="qdx_startImg" data-score="2" onclick="selectStar(2)"></span>
        <span class="qdx_startImg" data-score="3" onclick="selectStar(3)"></span>
        <span class="qdx_startImg" data-score="4" onclick="selectStar(4)"></span>
        <span class="qdx_startImg" data-score="5" onclick="selectStar(5)"></span>
    </div>`;

    // 텍스트 영역
    const showArray = data.show || [];
    if (showArray.includes('msg') && data.msg) {
        html += '<div class="qdx_text">';
        if (data.msg.title) {
            // 모든 스타일 정보 보존
            const preservedTitle = preserveAllStyles(data.msg.title);
            html += `<h2>${preservedTitle}</h2>`;
        }
        if (data.msg.text) {
            // 모든 스타일 정보 보존
            const preservedText = preserveAllStyles(data.msg.text);
            html += `<p>${preservedText}</p>`;
        }
        html += '</div>';
    }

    html += '</div>'; // qdx_survey 닫기

    return html;
}

// SLIDE 타입 전용 콘텐츠 생성 함수
function generateSlideContent(data, messageId) {
    let html = '';
    const showArray = data.show || [];

    if (showArray.includes('images') && data.images && data.images.length > 0) {
        html += `<div id="qdx_slide" class="swiper qdxSwiper">
            <div class="swiper-wrapper">`;

        data.images.forEach((img, index) => {
            html += `<div class="swiper-slide" data-swiper-slide-index="${index}">`;
            if (img.action === 'L' && img.linkUrl) {
                const target = img.linkOpt === 'B' ? '_blank' : '_self';
                html += `<a href="${img.linkUrl}" target="${target}"><img src="${img.url}" alt=""></a>`;
            } else {
                html += `<img src="${img.url}" alt="">`;
            }
            html += `</div>`;
        });

        html += `</div>
            <div class="qdx_arrow swiper-button-prev"><img src="${ICONS.arrowLeft}" alt=""></div>
            <div class="qdx_arrow swiper-button-next"><img src="${ICONS.arrowRight}" alt=""></div>
            <div class="swiper-pagination">
                <span class="swiper-pagination-current">1</span> / <span class="swiper-pagination-total">${data.images.length}</span>
            </div>
        </div>`;
    }

    // 텍스트와 버튼 (info 래퍼 필요한 경우)
    const hasButtons = showArray.includes('buttons') || showArray.includes('buttons2');
    const hasText = showArray.includes('msg');
    
    if (hasText && hasButtons) {
        html += '<div class="qdx_info">';
    }

    html += generateTextContent(data);
    html += generateButtonContent(data, messageId);

    if (hasText && hasButtons) {
        html += '</div>';
    }

    return html;
}

// 정규 타입 전용 콘텐츠 생성 함수
function generateRegularContent(data, messageId) {
    let html = '';
    const showArray = data.show || [];

    // 이미지 (BOX, BAR 타입)
    if (showArray.includes('images') && data.images && data.images.length > 0) {
        html += '<div class="qdx_img">';
        const img = data.images[0]; // 첫 번째 이미지만 사용
        if (img.action === 'L' && img.linkUrl) {
            const target = img.linkOpt === 'B' ? '_blank' : '_self';
            html += `<a href="${img.linkUrl}" target="${target}"><img src="${img.url}" alt=""></a>`;
        } else {
            html += `<img src="${img.url}" alt="">`;
        }
        html += '</div>';
    }

    // 텍스트와 버튼 (info 래퍼 필요한 경우)
    const hasButtons = showArray.includes('buttons') || showArray.includes('buttons2');
    const hasText = showArray.includes('msg');
    
    if (hasText && hasButtons) {
        html += '<div class="qdx_info">';
    }

    html += generateTextContent(data);
    html += generateButtonContent(data, messageId);

    if (hasText && hasButtons) {
        html += '</div>';
    }

    return html;
}

// 텍스트 콘텐츠 생성 함수
function generateTextContent(data) {
    console.log('📝 텍스트 콘텐츠 생성:', data);
    
    const showArray = data.show || [];
    console.log('📋 show 배열:', showArray);
    
    if (!showArray.includes('msg')) {
        console.log('❌ show 배열에 msg가 없음');
        return '';
    }
    
    if (!data.msg) {
        console.log('❌ data.msg가 없음');
        return '';
    }
    
    if (!data.msg.title && !data.msg.text) {
        console.log('❌ title과 text 모두 없음');
        return '';
    }

    console.log('✅ 텍스트 콘텐츠 생성 시작');
    let html = '<div class="qdx_text">';
    
    if (data.msg.title) {
        console.log('📖 제목 처리:', data.msg.title);
        // 모든 스타일 정보 보존
        const preservedTitle = preserveAllStyles(data.msg.title);
        console.log('📖 처리된 제목:', preservedTitle);
        html += `<h2>${preservedTitle}</h2>`;
    }
    
    if (data.msg.text) {
        console.log('📄 내용 처리:', data.msg.text);
        // 모든 스타일 정보 보존
        const preservedText = preserveAllStyles(data.msg.text);
        console.log('📄 처리된 내용:', preservedText);
        html += `<p>${preservedText}</p>`;
    }
    
    html += '</div>';
    console.log('✅ 최종 텍스트 HTML:', html);
    return html;
}

// 버튼 콘텐츠 생성 함수
function generateButtonContent(data, messageId) {
    const showArray = data.show || [];
    const hasButtons = showArray.includes('buttons') || showArray.includes('buttons2');
    if (!hasButtons || !data.buttons || data.buttons.length === 0) {
        return '';
    }

    const validButtons = data.buttons.filter(btn => btn.text && btn.linkUrl);
    if (validButtons.length === 0) {
        return '';
    }

    // buttons2면 2개 버튼 레이아웃
    const isButtons2 = showArray.includes('buttons2');
    const btnBoxClass = isButtons2 ? 'qdx_btn_box qdx_btn2' : 'qdx_btn_box';
    
    let html = `<div class="${btnBoxClass}">`;

    validButtons.forEach((btn, index) => {
        const target = btn.linkOpt === 'B' ? '_blank' : '_self';
        html += `<div class="qdx_view_btn">
            <a id="qdx_btn_${messageId}_${index + 1}" class="qdx_link" href="${btn.linkUrl}" target="${target}">${btn.text}</a>
        </div>`;
    });

    html += '</div>';
    return html;
}