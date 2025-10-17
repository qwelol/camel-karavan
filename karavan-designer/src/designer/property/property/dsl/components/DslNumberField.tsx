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
import { PropertyPlaceholderDropdown } from '../../PropertyPlaceholderDropdown';
import { DslRendererProps } from '../types';
import { isNumeric } from '../../../../utils/commonUtils';

export const DslNumberField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange, required }) => {
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
                    value={value}
                    customIcon={
                        property.type !== 'string' ? <Text component={TextVariants.p}>{property.type}</Text> : undefined
                    }
                    onChange={(_, v) => {
                        if (isNumeric(v)) {
                            onChange(Number(v));
                        } else {
                            onChange(v);
                        }
                    }}
                />
            </InputGroupItem>
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
