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

import React, { useMemo } from 'react';
import { InputGroup, InputGroupItem, Text, TextVariants, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { DebouncedTextInput } from '../../../../utils/components';
import { VariablesDropdown } from '../../VariablesDropdown';
import { DslRendererProps } from '../types';
import { GLOBAL, ROUTE } from 'karavan-core/lib/api/VariableUtil';

export const DslVariableField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange, required }) => {
    const variableValue = value?.toString().replace(GLOBAL, '').replace(ROUTE, '') || '';

    const variableType = useMemo((): 'global:' | 'route:' | '' => {
        if (value) {
            if (value.toString().startsWith(GLOBAL)) {
                return GLOBAL;
            } else if (value.toString().startsWith(ROUTE)) {
                return ROUTE;
            }
        }
        return '';
    }, [value]);

    return (
        <InputGroup>
            <InputGroupItem>
                <ToggleGroup aria-label='Variable type'>
                    <ToggleGroupItem
                        text='global:'
                        key='global'
                        buttonId={'global-variable-' + fieldId}
                        isSelected={variableType === GLOBAL}
                        onChange={(_, selected) => {
                            if (selected) {
                                onChange(GLOBAL.concat(variableValue));
                            } else {
                                onChange(variableValue);
                            }
                        }}
                    />
                    <ToggleGroupItem
                        text='route:'
                        key='route'
                        buttonId={'route-variable-' + fieldId}
                        className='route-variable'
                        isSelected={variableType === ROUTE}
                        onChange={(_, selected) => {
                            if (selected) {
                                onChange(ROUTE.concat(variableValue));
                            } else {
                                onChange(variableValue);
                            }
                        }}
                    />
                </ToggleGroup>
            </InputGroupItem>
            <InputGroupItem isFill>
                <DebouncedTextInput
                    className='text-field route-variable'
                    isRequired={required}
                    type='text'
                    id={fieldId}
                    name={fieldId}
                    value={variableValue}
                    customIcon={
                        property.type !== 'string' ? <Text component={TextVariants.p}>{property.type}</Text> : undefined
                    }
                    onChange={(_, v) => {
                        onChange(variableType.concat(v));
                    }}
                />
            </InputGroupItem>
            <InputGroupItem>
                <VariablesDropdown
                    onVariableChange={(name) => {
                        onChange(name);
                    }}
                />
            </InputGroupItem>
        </InputGroup>
    );
};
