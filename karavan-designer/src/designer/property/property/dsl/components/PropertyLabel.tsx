import React from 'react';
import { Text, Tooltip } from '@patternfly/react-core';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { PropertyUtil } from '../../PropertyUtil';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';
import { CamelMetadataApi } from 'karavan-core/lib/model/CamelMetadata';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import DeleteIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

interface PropertyLabelProps {
    property: PropertyMeta;
    value: any;
    isKamelet: boolean;
    isParameter: boolean;
    isMultiValueField: boolean;
    onPropertyChange?: (fieldId: string, value: any) => void;
}

export const PropertyLabel: React.FC<PropertyLabelProps> = ({
    property,
    value,
    isKamelet,
    isParameter,
    isMultiValueField,
    onPropertyChange,
}) => {
    const labelClassName = PropertyUtil.hasDslPropertyValueChanged(property, value) ? 'value-changed' : '';

    if (
        !isMultiValueField &&
        property.isObject &&
        !property.isArray &&
        !['ExpressionDefinition'].includes(property.type)
    ) {
        const tooltip = value ? 'Delete ' + property.name : 'Add ' + property.name;
        const className = value ? 'change-button delete-button' : 'change-button add-button';
        const x = value ? undefined : CamelDefinitionApi.createStep(property.type, {});
        const meta = CamelMetadataApi.getCamelModelMetadataByClassName(property.type);
        const title = meta?.title || property.displayName;
        const icon = value ? <DeleteIcon /> : <AddIcon />;

        return (
            <div style={{ display: 'flex' }}>
                <Text className={labelClassName}>{title}</Text>
                <Tooltip position={'top'} content={<div>{tooltip}</div>}>
                    <button
                        className={className}
                        onClick={() => onPropertyChange?.(property.name, x)}
                        aria-label='Add element'
                    >
                        {icon}
                    </button>
                </Tooltip>
            </div>
        );
    }

    if (isParameter) {
        return isKamelet ? 'Kamelet properties:' : 'Component properties:';
    }

    if (!['ExpressionDefinition'].includes(property.type)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3px' }}>
                <Text className={labelClassName}>{CamelUtil.capitalizeName(property.displayName)}</Text>
            </div>
        );
    }

    return null;
};
