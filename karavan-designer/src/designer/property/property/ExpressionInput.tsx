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
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { DslPropertyField } from './DslPropertyField';
import { useExpressionClassName } from './useExpressionHelpers';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';

interface Props {
    expressionDefinition: CamelElement;
    expressionValue: CamelElement;
    dslLanguage?: [string, string, string];
    onPropertyChange: (fieldId: string, value: string | number | boolean | any) => void;
}

export function ExpressionInput({ expressionDefinition, expressionValue, dslLanguage, onPropertyChange }: Props) {
    const className = useExpressionClassName(expressionDefinition);

    const property = useMemo(
        () =>
            CamelDefinitionApiExt.getElementProperties(className)
                .filter((p) => p.name === 'expression')
                .at(0),
        [className],
    );

    if (!property) {
        return null;
    }

    return (
        <DslPropertyField
            property={property}
            value={expressionValue ? (expressionValue as any)[property.name] : undefined}
            dslLanguage={dslLanguage}
            onExpressionChange={(_exp) => {}}
            onPropertyChange={onPropertyChange}
        />
    );
}
