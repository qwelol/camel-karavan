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
import { Form, FormGroup, TextInput, TextInputProps } from '@patternfly/react-core';

interface Props extends Omit<TextInputProps, 'onChange'> {
    value?: string;
    onChange: (value: string) => void;
}

export function SearchInput({ value, onChange, ...rest }: Props) {
    return (
        <Form isHorizontal className='search' autoComplete='off'>
            <FormGroup fieldId='search'>
                <TextInput
                    className='text-field'
                    type='text'
                    id='search'
                    name='search'
                    value={value}
                    onChange={(_, value) => onChange(value)}
                    {...rest}
                />
            </FormGroup>
        </Form>
    );
}
