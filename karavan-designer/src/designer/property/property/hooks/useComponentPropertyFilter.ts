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
import { useMemo } from 'react';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { PropertyValueUtil } from '../PropertyValueUtil';
import { usePropertiesStore } from '../../PropertyStore';
import { shallow } from 'zustand/shallow';

export function useComponentPropertyFilter(element?: CamelElement) {
    const [propertyFilter, requiredOnly, changedOnly] = usePropertiesStore(
        (s) => [s.propertyFilter, s.requiredOnly, s.changedOnly],
        shallow,
    );

    const getComponentPropertyValue = (kp: ComponentProperty) => {
        return CamelDefinitionApiExt.getParametersValue(element, kp.name, kp.kind === 'path');
    };

    const filteredProperties = useMemo((): ComponentProperty[] => {
        let componentProperties = CamelUtil.getComponentProperties(element);
        const filter = propertyFilter.toLocaleLowerCase();

        componentProperties = componentProperties.filter(
            (p) =>
                p.name?.toLocaleLowerCase().includes(filter) ||
                p.label.toLocaleLowerCase().includes(filter) ||
                p.displayName.toLocaleLowerCase().includes(filter),
        );

        if (requiredOnly) {
            componentProperties = componentProperties.filter((p) => p.required);
        }

        if (changedOnly) {
            componentProperties = componentProperties.filter((p) =>
                PropertyValueUtil.hasComponentPropertyValueChanged(p, getComponentPropertyValue(p)),
            );
        }

        return componentProperties;
    }, [element, propertyFilter, requiredOnly, changedOnly]);

    return {
        filteredProperties,
        getComponentPropertyValue,
    };
}
