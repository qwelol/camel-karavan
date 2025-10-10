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
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { ComponentPropertyField } from './ComponentPropertyField';
import { ExpandableSectionWrapper } from '../../utils/components';
import { usePropertiesStore } from '../PropertyStore';
import { usePropertySelectorChanged } from '../PropertyStore';
import { shallow } from 'zustand/shallow';

interface Props {
    element?: CamelElement;
    properties: ComponentProperty[];
    getComponentPropertyValue: (kp: ComponentProperty) => any;
}

export function ComponentPropertySections({ element, properties, getComponentPropertyValue }: Props) {
    return (
        <div className='parameters'>
            {properties.map((kp) => (
                <ComponentPropertyField
                    key={kp.name}
                    property={kp}
                    value={getComponentPropertyValue(kp)}
                    element={element}
                />
            ))}
        </div>
    );
}

interface ExpandableProps extends Props {
    label: string;
}

export function ExpandableComponentPropertySections({
    element,
    properties,
    getComponentPropertyValue,
    label,
}: ExpandableProps) {
    const propertySelectorChanged = usePropertiesStore(usePropertySelectorChanged, shallow);

    return (
        <ExpandableSectionWrapper toggleText={label} strictExpanded={propertySelectorChanged}>
            <ComponentPropertySections
                element={element}
                properties={properties}
                getComponentPropertyValue={getComponentPropertyValue}
            />
        </ExpandableSectionWrapper>
    );
}
