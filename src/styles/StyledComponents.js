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
    background: #169DAF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;  /* 👈 이렇게 하면 currentColor가 흰색이 됨 */

    svg {
        width: 20px;
        height: 20px;
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

// active prop을 올바르게 처리하도록 수정
export const SelectionItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active', 'itemType'].includes(prop),
}).attrs(props => ({
    className: `selection-item ${props.itemType || ''} ${props.active ? 'active' : 'inactive'}`
}))`
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid ${props => props.active ? 'rgba(22,157,175,0.65)' : '#e5e7eb'};
    background: ${props => props.active ? '#f8fafc' : '#f9fafb'};

    &:hover {
        border-color: rgba(22,157,175,0.65);
        background: #f8fafc;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
    }
`;

export const ItemImage = styled.div.attrs({
    className: 'item-image'
})`
    width: 100%;
    height: 100px;
    margin-bottom: 16px;
    border-radius: 8px;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;

export const ItemText = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'active',
}).attrs({
    className: 'item-text'
})`
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.active ? '#169DAF' : '#374151'};
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