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
import { Dropdown, DropdownList, DropdownItem, DropdownGroup, Divider, MenuToggle } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';

const SYNTAX_EXAMPLES = [
    {
        key: 'property:',
        value: 'group.property',
        description: 'Application property',
    },
    {
        key: 'env:',
        value: 'env:ENV_NAME',
        description: 'OS environment variable',
    },
    {
        key: 'sys:',
        value: 'sys:JvmPropertyName',
        description: 'JVM system property',
    },
    { key: 'bean:', value: 'bean:beanName.method', description: 'Bean’s method' },
];

interface PlaceholderDropdownProps {
    propertyPlaceholders: string[];
    onSelect: (value: string) => void;
}

export function PlaceholderDropdown({ propertyPlaceholders, onSelect }: PlaceholderDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasPlaceholders = propertyPlaceholders && propertyPlaceholders.length > 0;

    return (
        <Dropdown
            popperProps={{ position: 'end' }}
            isOpen={isOpen}
            onSelect={(_, value) => {
                onSelect(value as string);
                setIsOpen(false);
            }}
            onOpenChange={setIsOpen}
            toggle={(toggleRef: React.Ref<any>) => (
                <MenuToggle
                    ref={toggleRef}
                    className='property-placeholder-toggle'
                    aria-label='placeholder menu'
                    variant='default'
                    onClick={() => setIsOpen(!isOpen)}
                    isExpanded={isOpen}
                >
                    <EllipsisVIcon />
                </MenuToggle>
            )}
            shouldFocusToggleOnSelect
        >
            <DropdownList>
                {hasPlaceholders && (
                    <DropdownGroup label='Application Properties'>
                        {propertyPlaceholders.map((pp, index) => (
                            <DropdownItem value={pp} key={index}>
                                {pp}
                            </DropdownItem>
                        ))}
                    </DropdownGroup>
                )}
                {hasPlaceholders && <Divider component='li' />}
                <DropdownGroup label='Syntax examples'>
                    {SYNTAX_EXAMPLES.map((se) => (
                        <DropdownItem value={se.value} key={se.key} description={se.description}>
                            {se.value}
                        </DropdownItem>
                    ))}
                </DropdownGroup>
            </DropdownList>
        </Dropdown>
    );
}
