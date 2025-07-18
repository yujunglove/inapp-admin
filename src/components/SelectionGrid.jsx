import React from 'react';
import {
    SelectionGrid,
    SelectionItem,
    ItemImage,
    ItemText
} from '../styles/StyledComponents';

/**
 * 선택 그리드 컴포넌트 (2단계 구조)
 */
const SelectionGridComponent = ({
                                    items,
                                    currentStep,
                                    selections,
                                    onItemSelect
                                }) => {
    return (
        <SelectionGrid itemCount={items.length}>
            {items.map(item => (
                <SelectionItem
                    key={item.id}
                    itemType={item.id}
                    active={currentStep === 1 && (selections.displayType === item.id || (!selections.displayType && item.id === 'BAR'))}
                    onClick={() => onItemSelect(item.id)}
                >
                    <ItemImage className={`${item.id}-type`}>
                        <img src={item.image} alt={item.name} />
                    </ItemImage>
                    <ItemText
                        active={currentStep === 1 && (selections.displayType === item.id || (!selections.displayType && item.id === 'BAR'))}
                    >
                        {item.name}
                    </ItemText>
                </SelectionItem>
            ))}
        </SelectionGrid>
    );
};

export default SelectionGridComponent;