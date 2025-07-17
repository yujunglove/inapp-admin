// DB_MAPPING import 제거 - 더 이상 필요없음

function preserveAllStyles(html) {
    if (!html) return '';
    
    if (typeof document === 'undefined') {
        return html;
    }
    
    let result = html;
    result = result.replace(/<p([^>]*)>/gi, '');
    result = result.replace(/<\/p>/gi, '');
    result = result.replace(/<div([^>]*)>/gi, '');
    result = result.replace(/<\/div>/gi, '');
    result = result.replace(/<(h[1-6]|blockquote|pre)([^>]*)>/gi, '<span$2>');
    result = result.replace(/<\/(h[1-6]|blockquote|pre)>/gi, '</span>');
    
    return result;
}

const ICONS = {
    closeWhite: 'https://quadmax.co.kr/qdx/images/qdx_close.svg',
    barCloseWhite: 'https://quadmax.co.kr/qdx/images/qdx_bar_close.svg',
    arrowLeft: 'https://quadmax.co.kr/qdx/images/qdx_arrow_left.svg',
    arrowRight: 'https://quadmax.co.kr/qdx/images/qdx_arrow_right.svg'
};

export function generatePopupHTML(messageId, data) {
    const displayType = data.display.toLowerCase();
    const templateClass = data.code ? `qdx_tmpl_${data.code.toLowerCase()}` : '';
    
    let html = '';
    
    // BAR 타입일 경우 다른 HTML 구조 사용
    if (displayType === 'bar') {
        html = `<div id="qdx_popup_wrap" class="qdx_popup_${messageId}" data-key="${messageId}" data-msg-id="${messageId}">
            <div id="qdx_type_bar" class="${templateClass} qdx_popup_box qdx_pst_${data.location.toLowerCase()}"><span class="qdx_close"><img src="${ICONS.barCloseWhite}" alt=""></span><div class="qdx_cont">`;
        
        // BAR 타입 컨텐츠 생성
        html += generateBarContent(data, messageId);
        
        html += `</div></div>
        </div>`;
    } else {
        // 기존 다른 타입들의 HTML 구조
        html = `<div id="qdx_popup_wrap" class="qdx_popup_${messageId}" data-key="${messageId}" data-msg-id="${messageId}">
            <div id="qdx_type_${displayType}" class="${templateClass} qdx_popup_box qdx_pst_${data.location.toLowerCase()}">`;
        
        if (data.today === 'Y') {
            html += `<div class="qdx_close_box" style="height:auto; padding:0; display:flex; justify-content:space-between; align-items:center;"><label class="qdx_close_today"><input type="checkbox" class="qdx_checkbox">오늘 하루 보지 않기</label><span class="qdx_close"><img src="${ICONS.closeWhite}" alt=""></span></div>`;
        } else {
            html += `<div class="qdx_close_box" style="height:auto; padding:0; display:flex; justify-content:flex-end; align-items:center;"><span class="qdx_close"><img src="${ICONS.closeWhite}" alt=""></span></div>`;
        }
        
        html += `<div class="qdx_cont">`;
        
        if (displayType === 'slide') {
            html += generateSlideContent(data, messageId);
        } else if (displayType === 'star') {
            html += generateStarContent(data, messageId);
        } else {
            html += generateRegularContent(data, messageId);
        }
        
        html += `</div></div>
        </div>`;
    }

    if (displayType === 'slide') {
        // Swiper는 iframe 내부에서 초기화됨
    }

    return html;
}

function generateBarContent(data, messageId) {
    let html = '';
    const showArray = data.show || [];
    
    if (showArray.includes('images') && data.images && data.images.length > 0) {
        html += '<div class="qdx_img">';
        const img = data.images[0];
        if (img.action === 'L' && img.linkUrl) {
            const target = img.linkOpt === 'B' ? '_blank' : '_self';
            // URL 검증 추가
            let finalUrl = img.linkUrl;
            if (!finalUrl || finalUrl === '#' || finalUrl.startsWith('#')) {
                finalUrl = 'javascript:void(0)';
            }
            html += `<a href="${finalUrl}" target="${target}" onclick="return handleImageClick(event, '${img.linkUrl}', '${target}')"><img src="${img.url}" alt=""></a>`;
        } else {
            html += `<img src="${img.url}" alt="">`;
        }
        html += '</div>';
    }
    
    if (showArray.includes('msg') && data.msg) {
        html += '<div class="qdx_text">';
        if (data.msg.title) {
            const preservedTitle = preserveAllStyles(data.msg.title);
            html += `<h2>${preservedTitle}</h2>`;
        }
        if (data.msg.text) {
            const preservedText = preserveAllStyles(data.msg.text);
            html += `<p>${preservedText}</p>`;
        }
        html += '</div>';
    }
    
    return html;
}

function generateStarContent(data, messageId) {
    let html = '';

    html += '<div id="qdx_survey" class="qdx_cont">';

    html += `<div class="qdx_score">
        <span class="qdx_startImg" data-score="1" onclick="selectStar(1)"></span>
        <span class="qdx_startImg" data-score="2" onclick="selectStar(2)"></span>
        <span class="qdx_startImg" data-score="3" onclick="selectStar(3)"></span>
        <span class="qdx_startImg" data-score="4" onclick="selectStar(4)"></span>
        <span class="qdx_startImg" data-score="5" onclick="selectStar(5)"></span>
    </div>`;

    const showArray = data.show || [];
    if (showArray.includes('msg') && data.msg) {
        html += '<div class="qdx_text">';
        if (data.msg.title) {
            const preservedTitle = preserveAllStyles(data.msg.title);
            html += `<h2>${preservedTitle}</h2>`;
        }
        if (data.msg.text) {
            const preservedText = preserveAllStyles(data.msg.text);
            html += `<p>${preservedText}</p>`;
        }
        html += '</div>';
    }

    html += '</div>';

    return html;
}

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
                // URL 검증 추가
                let finalUrl = img.linkUrl;
                if (!finalUrl || finalUrl === '#' || finalUrl.startsWith('#')) {
                    finalUrl = 'javascript:void(0)';
                }
                html += `<a href="${finalUrl}" target="${target}" onclick="return handleImageClick(event, '${img.linkUrl}', '${target}')"><img src="${img.url}" alt=""></a>`;
            } else {
                html += `<img src="${img.url}" alt="">`;
            }
            html += `</div>`;
        });

        html += `</div><div class="qdx_arrow swiper-button-prev"><img src="${ICONS.arrowLeft}" alt=""></div><div class="qdx_arrow swiper-button-next"><img src="${ICONS.arrowRight}" alt=""></div><div class="swiper-pagination"><span class="swiper-pagination-current">1</span> / <span class="swiper-pagination-total">${data.images.length}</span></div></div>`;
    }

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

function generateRegularContent(data, messageId) {
    let html = '';
    const showArray = data.show || [];

    if (showArray.includes('images') && data.images && data.images.length > 0) {
        html += '<div class="qdx_img">';
        const img = data.images[0];
        if (img.action === 'L' && img.linkUrl) {
            const target = img.linkOpt === 'B' ? '_blank' : '_self';
            // URL 검증 추가
            let finalUrl = img.linkUrl;
            if (!finalUrl || finalUrl === '#' || finalUrl.startsWith('#')) {
                finalUrl = 'javascript:void(0)';
            }
            html += `<a href="${finalUrl}" target="${target}" onclick="return handleImageClick(event, '${img.linkUrl}', '${target}')"><img src="${img.url}" alt=""></a>`;
        } else {
            html += `<img src="${img.url}" alt="">`;
        }
        html += '</div>';
    }

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

function generateTextContent(data) {
    const showArray = data.show || [];
    
    if (!showArray.includes('msg')) {
        return '';
    }
    
    if (!data.msg) {
        return '';
    }
    
    if (!data.msg.title && !data.msg.text) {
        return '';
    }

    let html = '<div class="qdx_text">';
    
    if (data.msg.title) {
        const preservedTitle = preserveAllStyles(data.msg.title);
        html += `<h2>${preservedTitle}</h2>`;
    }
    
    if (data.msg.text) {
        const preservedText = preserveAllStyles(data.msg.text);
        html += `<p>${preservedText}</p>`;
    }
    
    html += '</div>';
    return html;
}

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

    const isButtons2 = showArray.includes('buttons2');
    const btnBoxClass = isButtons2 ? 'qdx_btn_box qdx_btn2' : 'qdx_btn_box';
    
    let html = `<div class="${btnBoxClass}">`;

    validButtons.forEach((btn, index) => {
        const target = btn.linkOpt === 'B' ? '_blank' : '_self';
        // URL이 #으로 시작하거나 javascript:void(0) 같은 경우 처리
        let finalUrl = btn.linkUrl;
        if (!finalUrl || finalUrl === '#' || finalUrl.startsWith('#')) {
            finalUrl = 'javascript:void(0)';
        }
        
        html += `<div class="qdx_view_btn"><a id="qdx_btn_${messageId}_${index + 1}" class="qdx_link" href="${finalUrl}" target="${target}" onclick="return handleButtonClick(event, '${btn.linkUrl}', '${target}')">${btn.text}</a></div>`;
    });

    html += '</div>';
    return html;
}