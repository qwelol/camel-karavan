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
import React, { useCallback, useState, forwardRef } from 'react';
import { TextInput, TextInputProps } from '@patternfly/react-core';
import { useDebounce } from '../hooks/useDebounce';

interface DebouncedTextInputProps extends Omit<TextInputProps, 'onChange'> {
    debounceDelay?: number;
    onChange?: (event: React.FormEvent<HTMLInputElement>, value: string) => void;
}

export const DebouncedTextInput = forwardRef<HTMLInputElement, DebouncedTextInputProps>(
    ({ debounceDelay = 700, onChange, value, ...props }, ref) => {
        const stringValue = value?.toString() || '';
        const [localValue, setLocalValue] = useState<string>(stringValue);

        const debouncedOnChange = useDebounce(
            useCallback(
                (event: React.FormEvent<HTMLInputElement>, value: string) => {
                    onChange?.(event, value);
                },
                [onChange],
            ),
            debounceDelay,
        );

        const handleChange = useCallback(
            (event: React.FormEvent<HTMLInputElement>, value: string) => {
                setLocalValue(value);
                debouncedOnChange(event, value);
            },
            [debouncedOnChange],
        );

        React.useEffect(() => {
            if (stringValue !== localValue) {
                setLocalValue(stringValue);
            }
        }, [stringValue, localValue]);

        return <TextInput {...props} ref={ref} value={localValue} onChange={handleChange} />;
    },
);

DebouncedTextInput.displayName = 'DebouncedTextInput';
