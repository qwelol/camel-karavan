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
import { useShowInfrastructureButton } from '../hooks/useShowInfrastructureButton';
import { isNumeric } from '../../../../utils/commonUtils';
import { PropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown';
import { EditorButton, PasswordInfrastructureDebouncedTextInput } from '../../../../utils/components';
import { KameletRendererProps } from '../types';

export const KameletStringField: React.FC<KameletRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    required,
}) => {
    const showInfrastructureButton = useShowInfrastructureButton(property);
    const showEditorButton = property.type === 'string' && property.format !== 'password';

    return (
        <InputGroup>
            <PasswordInfrastructureDebouncedTextInput
                className='text-field'
                isRequired={required}
                isSecret={property.format === 'password'}
                autoComplete='off'
                id={fieldId}
                name={fieldId}
                value={value}
                onChange={(_, v) => {
                    if (isNumeric(v)) {
                        onChange(Number(v));
                    } else {
                        onChange(v);
                    }
                }}
                customIcon={
                    property.type !== 'string' ? <Text component={TextVariants.p}>{property.type}</Text> : undefined
                }
                debounceDelay={700}
                showInfrastructureButton={showInfrastructureButton}
                currentValue={value}
                onInfrastructureSelect={onChange}
            />

            {showEditorButton && (
                <EditorButton propertyId={property.id} value={value} title={property.title} onValueChange={onChange} />
            )}

            <InputGroupItem>
                <PropertyPlaceholderDropdown
                    property={property}
                    value={value}
                    onDslPropertyChange={(_, v) => {
                        onChange(v);
                    }}
                />
            </InputGroupItem>
        </InputGroup>
    );
};
