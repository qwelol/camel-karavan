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
import React, { useId } from 'react';
import { TextInput, Button } from '@patternfly/react-core';
import { PasswordTextInput } from '../../utils/components';
import DeleteIcon from '@patternfly/react-icons/dist/js/icons/times-icon';

interface ConstructorFieldProps {
    keyValue: number;
    value: string;
    onKeyChange: (oldKey: number, newKey: number, value: string) => void;
    onValueChange: (key: number, value: string) => void;
    onDelete: (key: number) => void;
}

export const ConstructorField: React.FC<ConstructorFieldProps> = ({
    keyValue,
    value,
    onKeyChange,
    onValueChange,
    onDelete,
}) => {
    const isSecret = false; // Конструкторы не являются секретными
    const keyId = useId();
    const valueId = useId();

    return (
        <div className='bean-property'>
            <TextInput
                placeholder='Argument Index'
                className='text-field'
                isRequired
                type='text'
                id={keyId}
                name={keyId}
                value={keyValue.toString()}
                onChange={(_, newKeyValue) => {
                    onKeyChange(keyValue, parseInt(newKeyValue), value);
                }}
            />
            <PasswordTextInput
                placeholder='Argument Value'
                isSecret={isSecret}
                autoComplete='off'
                className='text-field'
                isRequired
                id={valueId}
                name={valueId}
                value={value}
                onChange={(_, newValue) => {
                    onValueChange(keyValue, newValue);
                }}
            />
            <Button variant='link' className='delete-button' onClick={() => onDelete(keyValue)}>
                <DeleteIcon />
            </Button>
        </div>
    );
};
