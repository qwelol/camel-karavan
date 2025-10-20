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
import { TextInputGroup, InputGroupItem, Switch } from '@patternfly/react-core';
import { DebouncedTextInput } from '../../../../utils/components';
import { PropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown';
import { DslRendererProps } from '../types';

export const DslBooleanField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange }) => {
    const isValueBoolean = value?.toString() === 'true' || value?.toString() === 'false';
    const isDisabled = value?.toString().includes('{') || value?.toString().includes('}');
    let isChecked = false;

    if (value !== undefined && isValueBoolean) {
        isChecked = Boolean(value);
    } else if ((value === undefined || value.toString().length > 0) && property.defaultValue !== undefined) {
        isChecked = property.defaultValue === 'true';
    }

    return (
        <TextInputGroup className='input-group'>
            <InputGroupItem>
                <Switch
                    isDisabled={isDisabled}
                    id={fieldId + '-switch'}
                    name={fieldId + '-switch'}
                    className='switch-placeholder'
                    value={value?.toString()}
                    aria-label={property.name}
                    isChecked={isChecked}
                    onChange={(_, v) => {
                        onChange(v);
                    }}
                />
            </InputGroupItem>
            <InputGroupItem isFill>
                <DebouncedTextInput
                    id={fieldId + '-placeholder'}
                    name={fieldId + '-placeholder'}
                    type='text'
                    aria-label='placeholder'
                    value={!isValueBoolean ? value?.toString() : undefined}
                    onChange={(_, v) => {
                        onChange(v);
                    }}
                />
            </InputGroupItem>
            <InputGroupItem>
                <PropertyPlaceholderDropdown
                    property={property}
                    value={value}
                    onDslPropertyChange={(v, newRoute) => {
                        onChange(v, false, newRoute);
                    }}
                />
            </InputGroupItem>
        </TextInputGroup>
    );
};
