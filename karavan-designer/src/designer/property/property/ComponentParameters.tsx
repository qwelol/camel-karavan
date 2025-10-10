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
import { useComponentPropertyFilter } from './hooks/useComponentPropertyFilter';
import { useComponentPropertyGroups } from './hooks/useComponentPropertyGroups';
import { ComponentPropertySections, ExpandableComponentPropertySections } from './ComponentPropertySections';

interface Props {
    element?: CamelElement;
}

export function ComponentParameters({ element }: Props) {
    const { filteredProperties, getComponentPropertyValue } = useComponentPropertyFilter(element);
    const { propertiesMain, propertiesAdvanced, propertiesScheduler, propertiesSecurity } =
        useComponentPropertyGroups(filteredProperties);

    return (
        <>
            <ComponentPropertySections
                element={element}
                properties={propertiesMain}
                getComponentPropertyValue={getComponentPropertyValue}
            />
            {element && propertiesScheduler.length > 0 && (
                <ExpandableComponentPropertySections
                    element={element}
                    properties={propertiesScheduler}
                    getComponentPropertyValue={getComponentPropertyValue}
                    label='Component scheduler properties'
                />
            )}
            {element && propertiesSecurity.length > 0 && (
                <ExpandableComponentPropertySections
                    element={element}
                    properties={propertiesSecurity}
                    getComponentPropertyValue={getComponentPropertyValue}
                    label='Component security properties'
                />
            )}
            {element && propertiesAdvanced.length > 0 && (
                <ExpandableComponentPropertySections
                    element={element}
                    properties={propertiesAdvanced}
                    getComponentPropertyValue={getComponentPropertyValue}
                    label='Component advanced properties'
                />
            )}
        </>
    );
}
