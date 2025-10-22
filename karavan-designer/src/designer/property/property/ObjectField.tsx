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
import React, { useCallback, useMemo } from 'react';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import { DslPropertyField } from './DslPropertyField';
import { ExpressionDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';

interface Props {
    property: PropertyMeta;
    onPropertyUpdate: (fieldId: string, value: CamelElement) => void;
    hideLabel?: boolean;
    value?: CamelElement;
}

export function ObjectField(props: Props) {
    const { property, onPropertyUpdate, hideLabel, value } = props;

    const propertyChanged = useCallback(
        (fieldId: string, newValue: string | number | boolean | any) => {
            if (value) {
                const clone = CamelUtil.cloneStep(value);
                (clone as any)[fieldId] = newValue;
                onPropertyUpdate(property.name, clone);
            }
        },
        [value, onPropertyUpdate, property.name],
    );

    const expressionChanged = useCallback(
        (propertyName: string, newValue: ExpressionDefinition) => {
            if (value) {
                const clone = CamelUtil.cloneStep(value);
                (clone as any)[propertyName] = newValue;
                onPropertyUpdate(property.name, clone);
            }
        },
        [value, onPropertyUpdate, property.name],
    );

    const elementProperties = useMemo(() => {
        if (!value?.dslName) {
            return [];
        }

        return CamelDefinitionApiExt.getElementProperties(value.dslName);
    }, [value?.dslName]);

    return (
        <div className='object-field'>
            {elementProperties.map((propertyMeta: PropertyMeta) => (
                <DslPropertyField
                    key={propertyMeta.name}
                    property={propertyMeta}
                    element={value}
                    onExpressionChange={expressionChanged}
                    onPropertyChange={(_fieldId, newValue) => propertyChanged(propertyMeta.name, newValue)}
                    value={value ? (value as any)[propertyMeta.name] : undefined}
                    hideLabel={hideLabel}
                />
            ))}
        </div>
    );
}
