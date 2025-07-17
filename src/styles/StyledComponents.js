// StyledComponents.jsx
import styled from 'styled-components';

export const ModuleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background: #ffffff;
`;

export const ContentSection = styled.div.attrs({
    className: 'content-section'
})`
    display: flex;
    flex-direction: column;
    width: 37%;
    border-right: 1px solid #e9e9e9;
    background: #ffffff;
`;

export const ContentArea = styled.div.attrs({
    className: 'content-area'
})`
    padding: 24px;
    flex: 1;  /* 남은 공간 모두 차지 */
    overflow-y: auto;
    min-height: 0;  /* flex에서 overflow가 제대로 작동하도록 */
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
    font-size: 18px;
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

    /* 슬라이드형 이미지에 대한 특별한 스타일 */

    img[src*="slide-removebg-preview.png"] {
        margin-top: 15px;
        width: 125% !important;
        height: 115% !important;
    }

    img[src*="star-removebg-preview.png"] {
        width: 85% !important;
        height: 85% !important;
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
    className: 'back-button'
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
    className: 'next-button'
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none !important;
    color: #ffffff;
    position: relative;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }

    &:hover {
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
        transform: translateX(3px) scale(1.15) rotate(5deg);
        box-shadow: 0 12px 30px rgba(107, 114, 128, 0.5);
    }

    &:hover:before {
        width: 80px;
        height: 80px;
    }

    &:active {
        transform: translateX(2px) scale(1.1) rotate(3deg);
    }

    &:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    &:disabled:before {
        display: none;
    }

    svg {
        width: 17px;
        height: 17px;
        stroke: white;
        stroke-width: 2.5;
        transition: all 0.3s ease;
        z-index: 1;
    }

    &:hover svg {
        transform: translateX(2px) scale(1.1);
    }
`;

export const PreviewSection = styled.div.attrs({
    className: 'preview-section'
})`
    width: 63%;
    background: #fafafa; /* 다시 흰색으로 */
    padding: 14px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;