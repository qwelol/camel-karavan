/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { InputGroup, InputGroupItem, Text, TextVariants } from '@patternfly/react-core';
import { InfrastructureDebouncedTextInput, EditorButton } from '../../../../utils/components';
import { PropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown';
import { DslRendererProps } from '../types';
import { useShowInfrastructureButton } from '../../shared/hooks/useShowInfrastructureButton';
import { isNumeric } from '../../../../utils/commonUtils';
import { PropertyUtil } from '../../PropertyUtil';

export const DslStringField: React.FC<DslRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    required,
    element,
}) => {
    const showInfraSelectorButton = useShowInfrastructureButton(property.name);

    const isNumber = ['integer', 'number', 'duration'].includes(property.type);
    const uriReadOnly = PropertyUtil.isUriReadOnly(property, element?.dslName);
    const showEditorButton =
        !uriReadOnly && !isNumber && !property.secret && !['id', 'description'].includes(property.name);

    return (
        <InputGroup>
            <InfrastructureDebouncedTextInput
                className='text-field'
                isRequired={required}
                type={property.secret ? 'password' : 'text'}
                autoComplete='off'
                id={fieldId}
                name={property.name}
                value={value}
                customIcon={
                    property.type !== 'string' ? <Text component={TextVariants.p}>{property.type}</Text> : undefined
                }
                onChange={(_, v) => {
                    if (isNumber && isNumeric(v)) {
                        onChange(Number(v));
                    } else if (!isNumber) {
                        onChange(v);
                    }
                }}
                readOnlyVariant={uriReadOnly ? 'default' : undefined}
                showInfrastructureButton={showInfraSelectorButton}
                currentValue={value}
                onInfrastructureSelect={(val) => {
                    onChange(val);
                }}
            />

            {showEditorButton && (
                <EditorButton
                    propertyId={property.name}
                    value={value}
                    title={property.displayName}
                    onValueChange={onChange}
                />
            )}

            <InputGroupItem>
                <PropertyPlaceholderDropdown
                    property={property}
                    value={value}
                    onDslPropertyChange={(v) => onChange(v)}
                />
            </InputGroupItem>
        </InputGroup>
    );
};
