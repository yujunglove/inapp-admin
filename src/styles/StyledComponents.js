// StyledComponents.jsx
import styled from 'styled-components';

export const ModuleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
    min-height: 900px;
    background: #ffffff;
`;

export const ContentSection = styled.div.attrs({
    className: 'content-section'
})`
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 100%;
    border-right: 1px solid #e9e9e9;
    background: #ffffff;
    overflow: hidden;  /* 자식 요소의 스크롤바가 밖으로 나오지 않도록 */
`;

export const ContentArea = styled.div.attrs({
    className: 'content-area'
})`
    padding: 24px;
    flex: 1;
    overflow-y: auto;
    scrollbar-gutter: stable;
    min-height: 0;
    
    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.8);
    }
`;

export const NavigationArea = styled.div.attrs({
    className: 'navigation-area'
})`
    padding: 10px;
    border-top: 1px solid #e9e9e9;
    background: #f9fafb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;  /* 절대 줄어들지 않음 */
    height: 60px;    /* 고정 높이 */
`;

export const Header = styled.div.attrs({
    className: 'step-header'
})`
    padding: 10px 14px;
    border-bottom: 1px solid #e9e9e9;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;  /* 절대 줄어들지 않음 */
    height: 80px;    /* 고정 높이 */
`;

export const HeaderIcon = styled.div.attrs({
    className: 'header-icon'
})`
    width: 40px;
    height: 40px;
    background: linear-gradient(120deg, #169DAF 65%, #3fd2f2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 2px 8px 0 rgba(22, 157, 175, 0.13);

    svg {
        width: 22px;
        height: 22px;
    }
`;


export const StepTitle = styled.h2.attrs({
    className: 'step-title'
})`
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
`;

export const StepNumber = styled.span.attrs({
    className: 'step-number'
})`
    background: #169DAF;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    margin-left: auto;
`;

// itemCount prop을 DOM에 전달하지 않도록 수정
export const SelectionGrid = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'itemCount',
})`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    ${props => props.itemCount > 6 ? `
    max-height: 400px;
    overflow-y: auto;
  ` : `
    height: auto;
  `}
`;

export const SelectionItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active', 'itemType'].includes(prop),
}).attrs(props => ({
    className: `selection-item ${props.itemType || ''} ${props.active ? 'active' : 'inactive'}`
}))`
    text-align: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding-bottom: 12px;
    border-radius: 12px;
    border: 2px solid ${props => props.active ? 'rgba(22,157,175,0.65)' : '#e5e7eb'};
    background: ${props => props.active ? '#f8fafc' : '#f9fafb'};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(22, 157, 175, 0.1), transparent);
        transition: left 0.6s ease;
    }

    &:hover {
        border-color: rgba(248, 248, 248, 0.8);
        color: rgba(215, 240, 243, 0.8);
        background: linear-gradient(135deg, #f8fafc 0%, #fafafa 100%);
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 10px 10px rgba(201, 224, 236, 0.76);
    }

    &:hover:before {
        left: 100%;
    }

    &:active {
        transform: translateY(-4px) scale(1.01);
    }

    ${props => props.active && `
        &:hover {
            transform: translateY(-6px) scale(1.03);
            box-shadow: 0 15px 20px rgba(22, 157, 175, 0.3);
        }
    `}
`;

export const ItemImage = styled.div.attrs({
    className: 'item-image'
})`
    width: 100%;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 8px;
    background: #e1e1e1;

    img {
        width: 125%;
        height: 125%;
        object-fit: contain;
    }

    /* 각 타입별 특별한 스타일 */
    &.slide-type img {
        margin-top: 15px;
        width: 125% !important;
        height: 115% !important;
    }

    &.star-type img {
        width: 85% !important;
        height: 85% !important;
    }

    &.bar-type img {
        width: 110% !important;
        height: 110% !important;
    }

    &.box-type img {
        width: 125% !important;
        height: 125% !important;
    }

`;
// ItemText 수정 - 여백 조정
export const ItemText = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'active',
}).attrs({
    className: 'item-text'
})`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.active ? '#169DAF' : '#374151'};
    padding: 0 15px; /* 좌우 여백 추가 */
`;

export const BackButton = styled.button.attrs({
    className: 'back-button',
    type: 'button'  // 명시적으로 button 타입 지정
})`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #6b7280;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    outline: none !important;
    color: #ffffff;

    &:hover {
        background: #4b5563;
    }

    &:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
    }

    svg {
        width: 17px;
        height: 17px;
        stroke: white;
        stroke-width: 2.5;
    }
`;

export const NextButton = styled.button.attrs({
    className: 'next-button',
    type: 'button'  // 명시적으로 button 타입 지정
})`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none !important;
    color: #ffffff;

    &:hover {
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
    }

    svg {
        width: 17px;
        height: 17px;
        stroke: white;
        stroke-width: 2.5;
    }
`;

export const PreviewSection = styled.div.attrs({
    className: 'preview-section'
})`
    width: 60%;
    height: 100%;
    min-height: 900px;
    background: #fafafa;
    padding: 14px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
`;

export const PreviewControlsArea = styled.div.attrs({
    className: 'preview-controls-area'
})`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 12px;
    flex-shrink: 0;
`;

export const PreviewControlButton = styled.button.attrs({
    className: 'preview-control-button',
    type: 'button'  // 명시적으로 button 타입 지정
})`
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &.today-check {
        background: ${props => props.active ? '#10b981' : '#f3f4f6'};
        color: ${props => props.active ? 'white' : '#374151'};
        border: 1px solid ${props => props.active ? '#10b981' : '#d1d5db'};
        
        &:hover {
            background: ${props => props.active ? '#059669' : '#e5e7eb'};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
    }
    
    &.json-view {
        background: #fcad27;
        color: white;
        
        &:hover {
            background: #e09820;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(252, 173, 39, 0.3);
        }
    }
    
    &.location-btn {
        background: #169DAF;
        color: white;
        position: relative;
        
        &:hover {
            background: #127a8a;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(22, 157, 175, 0.3);
        }
        
        svg {
            width: 14px;
            height: 14px;
        }
    }
`;

export const LocationDropdown = styled.div.attrs({
    className: 'location-dropdown'
})`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    overflow: hidden;
    z-index: 1000;
    min-width: 120px;
    
    button {
        width: 100%;
        padding: 8px 12px;
        border: none;
        background: transparent;
        font-size: 12px;
        cursor: pointer;
        text-align: left;
        transition: all 0.15s ease;
        color: #374151;
        
        &.active {
            background: #3b82f6;
            color: white;
        }
        
        &:hover:not(.active) {
            background: #f3f4f6;
        }
    }
`;

export const PreviewIframeContainer = styled.div.attrs({
    className: 'preview-iframe-container'
})`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fafafa;
    border-radius: 8px;
`;