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
import { PasswordInfrastructureDebouncedTextInput } from '../../utils/components';
import { useShowInfrastructureButton } from './shared/hooks/useShowInfrastructureButton';
import { SensitiveKeys } from 'karavan-core/lib/model/CamelMetadata';
import DeleteIcon from '@patternfly/react-icons/dist/js/icons/times-icon';

interface PropertyFieldProps {
    keyValue: string;
    value: string;
    onKeyChange: (oldKey: string, newKey: string, value: string) => void;
    onValueChange: (key: string, value: string) => void;
    onDelete: (key: string) => void;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
    keyValue,
    value,
    onKeyChange,
    onValueChange,
    onDelete,
}) => {
    const showInfraSelectorButton = useShowInfrastructureButton(keyValue);
    const isSecret = keyValue !== undefined && SensitiveKeys.includes(keyValue.toLowerCase());
    const keyId = useId();
    const valueId = useId();

    return (
        <div className='bean-property'>
            <TextInput
                placeholder='Bean Field Name'
                className='text-field'
                isRequired
                type='text'
                id={keyId}
                name={keyId}
                value={keyValue}
                onChange={(_, beanFieldName) => {
                    onKeyChange(keyValue, beanFieldName, value);
                }}
            />
            <PasswordInfrastructureDebouncedTextInput
                placeholder='Bean Field Value'
                autoComplete='off'
                className='text-field'
                isRequired
                isSecret={isSecret}
                id={valueId}
                name={valueId}
                value={value}
                onChange={(_, newValue) => {
                    onValueChange(keyValue, newValue);
                }}
                debounceDelay={700}
                showInfrastructureButton={showInfraSelectorButton}
                currentValue={value}
                onInfrastructureSelect={(val: string) => {
                    onValueChange(keyValue, val);
                }}
            />
            <Button variant='link' className='delete-button' onClick={() => onDelete(keyValue)}>
                <DeleteIcon />
            </Button>
        </div>
    );
};
