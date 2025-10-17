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
import { InputGroup, InputGroupItem } from '@patternfly/react-core';
import { DebouncedTextArea, EditorButton } from '../../../../utils/components';
import { DslRendererProps } from '../types';

export const DslTextAreaField: React.FC<DslRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    required,
    dslLanguage,
}) => {
    return (
        <InputGroup>
            <InputGroupItem isFill>
                <DebouncedTextArea
                    className='text-field'
                    isRequired={required}
                    type='text'
                    id={fieldId}
                    name={fieldId}
                    height='100px'
                    value={value}
                    onChange={(_, v) => {
                        onChange(v);
                    }}
                />
            </InputGroupItem>
            <EditorButton
                propertyId={property.name}
                value={value}
                title={`Expression (${dslLanguage?.[0]})`}
                onValueChange={(_, value) => onChange(value)}
                dslLanguage={dslLanguage}
            />
        </InputGroup>
    );
};
