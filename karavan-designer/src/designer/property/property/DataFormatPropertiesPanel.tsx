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
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';
import { PropertyFieldsRenderer } from './PropertyFieldsRenderer';
import { AdvancedPropertiesSection } from './AdvancedPropertiesSection';
import { usePropertiesStore, usePropertySelectorChanged } from '../PropertyStore';
import { shallow } from 'zustand/shallow';
import { PropertyUtil } from './PropertyUtil';

interface Props {
    dataFormat: string;
    value: CamelElement;
    onPropertyChange: (fieldId: string, value: string | number | boolean | any) => void;
}

export function DataFormatPropertiesPanel({ dataFormat, value, onPropertyChange }: Props) {
    const [propertyFilter, changedOnly, requiredOnly] = usePropertiesStore(
        (s) => [s.propertyFilter, s.changedOnly, s.requiredOnly],
        shallow,
    );
    const propertySelectorChanged = usePropertiesStore(usePropertySelectorChanged, shallow);

    function getDataFormatValue(): CamelElement {
        return (value as any)[dataFormat]
            ? (value as any)[dataFormat]
            : CamelDefinitionApi.createDataFormat(dataFormat, (value as any)[dataFormat]);
    }

    function getPropertyValue(property: PropertyMeta) {
        const dataFormatValue = getDataFormatValue();
        return dataFormatValue ? (dataFormatValue as any)[property.name] : undefined;
    }

    function getFilteredProperties(): PropertyMeta[] {
        let propertyMetas = CamelDefinitionApiExt.getElementPropertiesByName(dataFormat).sort((a, _b) =>
            a.name === 'library' ? -1 : 1,
        );
        const filter = propertyFilter.toLocaleLowerCase();
        propertyMetas = propertyMetas.filter(
            (p) =>
                p.name === 'parameters' ||
                p.name.toLocaleLowerCase().includes(filter) ||
                p.label.toLocaleLowerCase().includes(filter) ||
                p.displayName.toLocaleLowerCase().includes(filter),
        );
        if (requiredOnly) {
            propertyMetas = propertyMetas.filter((p) => p.name === 'parameters' || p.required);
        }
        if (changedOnly) {
            propertyMetas = propertyMetas.filter(
                (p) => p.name === 'parameters' || PropertyUtil.hasDslPropertyValueChanged(p, getPropertyValue(p)),
            );
        }
        return propertyMetas;
    }

    const dataFormatValue = useMemo(() => getDataFormatValue(), [dataFormat, value]);
    const properties = useMemo(() => getFilteredProperties(), [dataFormat, propertyFilter, changedOnly, requiredOnly]);
    const propertiesMain = useMemo(() => properties.filter((p) => !p.label.includes('advanced')), [properties]);
    const propertiesAdvanced = useMemo(() => properties.filter((p) => p.label.includes('advanced')), [properties]);

    return (
        <div className='object'>
            <div>
                <PropertyFieldsRenderer
                    properties={propertiesMain}
                    value={dataFormatValue}
                    onPropertyChange={onPropertyChange}
                />
                <AdvancedPropertiesSection
                    properties={propertiesAdvanced}
                    value={dataFormatValue}
                    onPropertyChange={onPropertyChange}
                    isExpanded={propertySelectorChanged}
                />
            </div>
        </div>
    );
}
