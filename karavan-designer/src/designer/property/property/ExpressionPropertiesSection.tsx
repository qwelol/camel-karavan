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
import { ExpandableSectionWrapper } from '../../utils/components';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { DslPropertyField } from './DslPropertyField';
import { CamelUi } from '../../utils/CamelUi';
import { PropertyUtil } from './PropertyUtil';
import { usePropertiesStore, usePropertySelectorChanged } from '../PropertyStore';
import { shallow } from 'zustand/shallow';
import { useExpressionClassName } from './useExpressionHelpers';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';

interface Props {
    expressionDefinition: CamelElement;
    expressionValue?: CamelElement;
    dslLanguage?: [string, string, string];
    onPropertyChange: (fieldId: string, value: string | number | boolean | any) => void;
}

export function ExpressionPropertiesSection({
    expressionDefinition,
    expressionValue,
    dslLanguage,
    onPropertyChange,
}: Props) {
    const [propertyFilter, changedOnly, requiredOnly] = usePropertiesStore(
        (s) => [s.propertyFilter, s.changedOnly, s.requiredOnly],
        shallow,
    );
    const propertySelectorChanged = usePropertiesStore(usePropertySelectorChanged, shallow);

    const className = useExpressionClassName(expressionDefinition);

    const filteredProperties = useMemo(() => {
        const filter = propertyFilter.toLocaleLowerCase();
        let propertyMetas = CamelDefinitionApiExt.getElementProperties(className)
            .filter((p) => p.name !== 'id')
            .filter((p) => p.name !== 'expression')
            .filter(
                (p) =>
                    !p.isObject ||
                    (p.isObject && !CamelUi.dslHasSteps(p.type)) ||
                    (className === 'CatchDefinition' && p.name === 'onWhen'),
            )
            .filter(
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
                (p) =>
                    p.name === 'parameters' ||
                    PropertyUtil.hasDslPropertyValueChanged(
                        p,
                        expressionValue ? (expressionValue as any)[p.name] : undefined,
                    ),
            );
        }

        return propertyMetas;
    }, [className, propertyFilter, requiredOnly, changedOnly, expressionValue]);

    if (!expressionValue) {
        return null;
    }

    return (
        <ExpandableSectionWrapper toggleText={'Expression properties'} strictExpanded={propertySelectorChanged}>
            {filteredProperties.map((property: PropertyMeta) => (
                <DslPropertyField
                    key={property.name + expressionDefinition.uuid}
                    property={property}
                    value={(expressionValue as any)[property.name]}
                    dslLanguage={dslLanguage}
                    onExpressionChange={(_exp) => {}}
                    onPropertyChange={onPropertyChange}
                />
            ))}
        </ExpandableSectionWrapper>
    );
}
