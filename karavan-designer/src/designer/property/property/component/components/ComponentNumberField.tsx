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
import { DebouncedTextInput } from '../../../../utils/components';
import { ComponentRendererProps } from '../types';
import { ComponentPropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown/ComponentPropertyPlaceholderDropdown';

export const ComponentNumberField: React.FC<ComponentRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    required,
}) => {
    // Обертка для onParametersChange
    const handleParametersChange = (_parameter: string, value: any, pathParameter?: boolean, newRoute?: any) => {
        onChange(value, pathParameter, newRoute);
    };

    return (
        <InputGroup>
            <InputGroupItem isFill>
                <DebouncedTextInput
                    className='text-field'
                    isRequired={required}
                    type={property.secret ? 'password' : 'text'}
                    autoComplete='off'
                    id={fieldId}
                    name={property.name}
                    value={value !== undefined ? value : property.defaultValue}
                    onChange={(_, v) => {
                        onChange(v, property.kind === 'path');
                    }}
                    customIcon={<Text component={TextVariants.p}>{property.type}</Text>}
                    debounceDelay={700}
                />
            </InputGroupItem>
            <InputGroupItem>
                <ComponentPropertyPlaceholderDropdown
                    property={property}
                    value={value}
                    onComponentPropertyChange={handleParametersChange}
                />
            </InputGroupItem>
        </InputGroup>
    );
};
