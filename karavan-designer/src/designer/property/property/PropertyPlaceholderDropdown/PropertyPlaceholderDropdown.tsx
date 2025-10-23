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
import '../../../karavan.css';
import '../PropertyPlaceholderDropdown.css';
import '@patternfly/patternfly/patternfly.css';
import { useDesignerStore } from '../../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { InfrastructureAPI } from '../../../utils/InfrastructureAPI';
import { AddPlaceholderToggle } from './AddPlaceholderToggle';
import { PlaceholderDropdown } from './PlaceholderDropdown';

interface Props {
    value: any;
    onValueChange: (value: string) => void;
}

export function PropertyPlaceholderDropdown(props: Props) {
    const [propertyPlaceholders, setPropertyPlaceholders] = useDesignerStore(
        (s) => [s.propertyPlaceholders, s.setPropertyPlaceholders],
        shallow,
    );

    const { value, onValueChange } = props;
    const valueIsPlaceholder: boolean = value && value.toString().startsWith('{{') && value.toString().endsWith('}}');
    const placeholderValue = valueIsPlaceholder ? value.toString().replace('{{', '').replace('}}', '') : undefined;

    const showAddButton = valueIsPlaceholder && !propertyPlaceholders.includes(placeholderValue);

    function handleSelect(value: string) {
        onValueChange(`{{${value}}}`);
    }

    function saveProperty(placeholderValue: string, propValue: string) {
        InfrastructureAPI.onSavePropertyPlaceholder(placeholderValue, propValue);
        const p = [...propertyPlaceholders];
        p.push(placeholderValue);
        setPropertyPlaceholders(p);
    }

    if (showAddButton) {
        return <AddPlaceholderToggle placeholderValue={placeholderValue} onSave={saveProperty} />;
    }

    return <PlaceholderDropdown propertyPlaceholders={propertyPlaceholders} onSelect={handleSelect} />;
}
