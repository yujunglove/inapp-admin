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
                    active={currentStep === 1 && selections.displayType === item.id}
                    onClick={() => onItemSelect(item.id)}
                >
                    <ItemImage>
                        <img src={item.image} alt={item.name} />
                    </ItemImage>
                    <ItemText
                        active={currentStep === 1 && selections.displayType === item.id}
                    >
                        {item.name}
                    </ItemText>
                </SelectionItem>
            ))}
        </SelectionGrid>
    );
};

export default SelectionGridComponent;