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
import { MenuToggle, Popover, Button, Flex, FlexItem } from '@patternfly/react-core';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-icon';
import { AddPlaceholderForm } from './AddPlaceholderForm';

interface AddPlaceholderToggleProps {
    placeholderValue: string;
    onSave: (placeholderValue: string, propValue: string) => void;
}

export function AddPlaceholderToggle({ placeholderValue, onSave }: AddPlaceholderToggleProps) {
    const [propValue, setPropValue] = useState('');

    return (
        <Popover
            aria-label='Add property'
            headerContent='Add property'
            bodyContent={
                <AddPlaceholderForm
                    placeholderValue={placeholderValue}
                    propValue={propValue}
                    onPropValueChange={setPropValue}
                />
            }
            footerContent={
                <Flex>
                    <FlexItem align={{ default: 'alignRight' }}>
                        <Button onClick={() => onSave(placeholderValue, propValue)}>Save</Button>
                    </FlexItem>
                </Flex>
            }
        >
            <MenuToggle className='property-placeholder-toggle' aria-label='add placeholder' variant='default'>
                <AddIcon />
            </MenuToggle>
        </Popover>
    );
}
