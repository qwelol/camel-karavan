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
import { InputGroupItem, Switch, TextInputGroup } from '@patternfly/react-core';
import { DebouncedTextInput } from '../../../../utils/components';
import { ComponentRendererProps } from '../types';
import { ComponentPropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown/ComponentPropertyPlaceholderDropdown';

export const ComponentBooleanField: React.FC<ComponentRendererProps> = ({ property, value, fieldId, onChange }) => {
    const isValueBoolean = value?.toString() === 'true' || value?.toString() === 'false';
    const isDisabled = value?.toString().includes('{') || value?.toString().includes('}');
    const isChecked =
        value !== undefined
            ? Boolean(value)
            : property.defaultValue !== undefined && ['true', true].includes(property.defaultValue);

    return (
        <TextInputGroup className='input-group'>
            <InputGroupItem>
                <Switch
                    id={fieldId}
                    name={property.name}
                    isDisabled={isDisabled}
                    className='switch-placeholder'
                    aria-label={property.name}
                    isChecked={isChecked}
                    value={value?.toString()}
                    onChange={(_, v) => {
                        onChange(v);
                    }}
                />
            </InputGroupItem>
            <InputGroupItem isFill>
                <DebouncedTextInput
                    id={property.name + '-placeholder'}
                    name={property.name + '-placeholder'}
                    type='text'
                    aria-label='placeholder'
                    value={!isValueBoolean ? value?.toString() : undefined}
                    onChange={(_, v) => {
                        onChange(v);
                    }}
                    debounceDelay={700}
                />
            </InputGroupItem>
            <InputGroupItem>
                <ComponentPropertyPlaceholderDropdown
                    property={property}
                    value={value}
                    onComponentPropertyChange={(v) => onChange(v)}
                />
            </InputGroupItem>
        </TextInputGroup>
    );
};
