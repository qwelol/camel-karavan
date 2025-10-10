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
import React, { useMemo } from 'react';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { Property } from 'karavan-core/lib/model/KameletModels';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { PropertyValueUtil } from './PropertyValueUtil';
import { KameletPropertyField } from './KameletPropertyField';
import { usePropertiesStore } from '../PropertyStore';
import { shallow } from 'zustand/shallow';

interface Props {
    element?: CamelElement;
}

export function KameletParameters({ element }: Props) {
    const [propertyFilter, requiredOnly, changedOnly] = usePropertiesStore(
        (s) => [s.propertyFilter, s.requiredOnly, s.changedOnly],
        shallow,
    );
    const getKameletPropertyValue = (property: Property) =>
        CamelDefinitionApiExt.getParametersValue(element, property.id);

    const requiredParameters = useMemo(() => CamelUtil.getKameletRequiredParameters(element), [element]);

    const filteredKameletProperties = useMemo((): Property[] => {
        let properties = CamelUtil.getKameletProperties(element);
        const filter = propertyFilter.toLocaleLowerCase();
        properties = properties.filter(
            (p) => p.title?.toLocaleLowerCase().includes(filter) || p.id?.toLocaleLowerCase().includes(filter),
        );

        if (requiredOnly) {
            properties = properties.filter((p) => requiredParameters.includes(p.id));
        }

        if (changedOnly) {
            properties = properties.filter((p) =>
                PropertyValueUtil.hasKameletPropertyValueChanged(p, getKameletPropertyValue(p)),
            );
        }

        return properties;
    }, [element, requiredParameters, propertyFilter, requiredOnly, changedOnly]);

    return (
        <div className='parameters'>
            {filteredKameletProperties.map((property) => (
                <KameletPropertyField
                    key={property.id}
                    property={property}
                    value={getKameletPropertyValue(property)}
                    required={requiredParameters?.includes(property.id)}
                />
            ))}
        </div>
    );
}
