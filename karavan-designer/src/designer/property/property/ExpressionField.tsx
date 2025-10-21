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
import React, { useMemo, useCallback } from 'react';
import { FormGroup } from '@patternfly/react-core';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import { PropertyHelpIcon } from '../../utils/components';
import { CamelMetadataApi, PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { ExpressionDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';
import { LanguageSelector } from './LanguageSelector';
import { ExpressionInput } from './ExpressionInput';
import { ExpressionPropertiesSection } from './ExpressionPropertiesSection';
import { useExpressionClassName, useDslLanguage } from './useExpressionHelpers';

interface Props {
    property: PropertyMeta;
    value: CamelElement;
    onExpressionChange?: (propertyName: string, exp: ExpressionDefinition) => void;
}

export function ExpressionField({ property, value, onExpressionChange }: Props) {
    const currentLanguage = useMemo(() => CamelDefinitionApiExt.getExpressionLanguageName(value) || 'groovy', [value]);

    const className = useExpressionClassName(value);

    const expressionValue = useMemo(() => {
        return value && (value as any)[currentLanguage]
            ? (value as any)[currentLanguage]
            : CamelDefinitionApi.createExpression(className, value);
    }, [value, currentLanguage, className]);

    const dslLanguage = useDslLanguage(currentLanguage);

    const expressionChanged = useCallback(
        (language: string, expressionValue: CamelElement) => {
            if (language !== (expressionValue as any).expressionName) {
                const languageClassName = CamelMetadataApi.getCamelLanguageMetadataByName(language)?.className;
                expressionValue = CamelDefinitionApi.createExpression(languageClassName || '', {
                    expression: (expressionValue as any).expression,
                });
            }
            const exp = new ExpressionDefinition();
            (exp as any)[language] = expressionValue;
            if (value) {
                (exp as any).uuid = value.uuid;
            }
            onExpressionChange?.(property.name, exp);
        },
        [value, property.name, onExpressionChange],
    );

    const propertyChanged = useCallback(
        (fieldId: string, propertyValue: string | number | boolean | any) => {
            if (expressionValue) {
                (expressionValue as any)[fieldId] = propertyValue;
                expressionChanged(currentLanguage, expressionValue);
            }
        },
        [expressionValue, currentLanguage, expressionChanged],
    );

    const handleLanguageChange = useCallback(
        (language: string) => {
            expressionChanged(language, expressionValue);
        },
        [expressionValue, expressionChanged],
    );

    return (
        <div>
            <LanguageSelector
                language={currentLanguage}
                propertyName={property.name}
                onLanguageChange={handleLanguageChange}
            />
            <FormGroup
                fieldId={property.name}
                labelIcon={
                    property.description ? (
                        <PropertyHelpIcon title={property.displayName} description={property.description} />
                    ) : undefined
                }
            >
                <ExpressionInput
                    expressionDefinition={value}
                    expressionValue={expressionValue}
                    dslLanguage={dslLanguage}
                    onPropertyChange={propertyChanged}
                />
                <ExpressionPropertiesSection
                    expressionDefinition={value}
                    expressionValue={expressionValue}
                    dslLanguage={dslLanguage}
                    onPropertyChange={propertyChanged}
                />
            </FormGroup>
        </div>
    );
}
