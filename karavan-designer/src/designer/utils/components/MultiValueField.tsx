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
import React, { useState } from 'react';
import {
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities,
    ChipGroup,
    Chip,
    Button,
} from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';

interface MultiValueFieldProps {
    value: string[];
    onChange: (newValue: string[]) => void;
}

export const MultiValueField: React.FC<MultiValueFieldProps> = ({ value, onChange }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSave = () => {
        if (inputValue.trim().length > 0) {
            const newArray = value ? [...value, inputValue.trim()] : [inputValue.trim()];
            onChange(newArray);
            setInputValue('');
        }
    };

    const handleDelete = (elementToDelete: string) => {
        const newArray = value.filter((item) => item !== elementToDelete);
        onChange(newArray);
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div>
            <TextInputGroup className='input-group'>
                <TextInputGroupMain value={inputValue} onChange={(e, v) => setInputValue(v)} onKeyUp={handleKeyUp}>
                    <ChipGroup>
                        {value.map((v, index) => (
                            <Chip key={'chip-' + index} className='chip' onClick={() => handleDelete(v)}>
                                {v.toString()}
                            </Chip>
                        ))}
                    </ChipGroup>
                </TextInputGroupMain>
                <TextInputGroupUtilities>
                    <Button variant='plain' onClick={handleSave} aria-label='Add element'>
                        <PlusIcon />
                    </Button>
                </TextInputGroupUtilities>
            </TextInputGroup>
        </div>
    );
};
