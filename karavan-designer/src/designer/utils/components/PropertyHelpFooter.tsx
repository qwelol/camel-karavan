import React from 'react';

interface PropertyHelpFooterProps {
    default?: any;
    example?: string;
    footer?: string;
}

export const PropertyHelpFooter: React.FC<PropertyHelpFooterProps> = ({ default: defaultValue, example, footer }) => (
    <div>
        {defaultValue !== undefined && <div>Default: {defaultValue.toString()}</div>}
        {example !== undefined && <div>Example: {example}</div>}
        {footer !== undefined && <div>{footer}</div>}
    </div>
);
