import React from 'react';
import { Text } from '@patternfly/react-core';

interface PropertyLabelProps {
    text: string;
    hasValueChanged?: boolean;
    className?: string;
}

export const PropertyLabel: React.FC<PropertyLabelProps> = ({ text, hasValueChanged = false, className }) => {
    const labelClassName = hasValueChanged ? 'value-changed' : className || 'transparent';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '3px',
            }}
        >
            <Text className={labelClassName}>{text}</Text>
        </div>
    );
};
