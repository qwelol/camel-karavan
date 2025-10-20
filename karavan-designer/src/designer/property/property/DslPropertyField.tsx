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

import React, { useId, useMemo, useCallback } from 'react';
import { FormGroup } from '@patternfly/react-core';
import '../../karavan.css';
import './DslPropertyField.css';
import '@patternfly/patternfly/patternfly.css';
import { PropertyHelpIcon, PropertyHelpFooter } from '../../utils/components';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { PropertyUtil } from './PropertyUtil';
import { useDslFieldRendererFactory } from './dsl/hooks/useDslFieldRendererFactory';
import { DslRendererProps } from './dsl/types';
import { RouteToCreate } from '../../utils/CamelUi';
import { ExpressionDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { PropertyLabel } from './dsl/components/PropertyLabel';

interface Props {
    property: PropertyMeta;
    element?: CamelElement;
    value: any;
    onPropertyChange?: (fieldId: string, value: string | number | boolean | any, newRoute?: RouteToCreate) => void;
    onExpressionChange?: (propertyName: string, exp: ExpressionDefinition) => void;
    hideLabel?: boolean;
    dslLanguage?: [string, string, string];
}

export function DslPropertyField(props: Props) {
    const { property, value, element, hideLabel, onPropertyChange, onExpressionChange, dslLanguage } = props;
    const id = useId();

    const { getRenderer } = useDslFieldRendererFactory();

    const handleChange = useCallback(
        (newValue: any, _?: boolean, newRoute?: any) => {
            onPropertyChange?.(property.name, newValue, newRoute);
        },
        [onPropertyChange, property.name],
    );

    const renderProps: DslRendererProps = useMemo(
        () => ({
            property,
            value,
            onChange: handleChange,
            fieldId: id,
            required: property.required,
            element,
            hideLabel,
            dslLanguage,
            onPropertyChange,
            onExpressionChange,
        }),
        [property, value, handleChange, id, element, hideLabel, dslLanguage, onPropertyChange, onExpressionChange],
    );

    const renderer = useMemo(() => {
        return getRenderer(property, renderProps);
    }, [getRenderer, property, renderProps]);

    const isKamelet = CamelUtil.isKameletComponent(element);
    const isParameter = PropertyUtil.isParameter(property);
    const isMultiValueField = PropertyUtil.isMultiValueField(property);

    return (
        <div>
            <FormGroup
                className='dsl-property-form-group'
                label={
                    hideLabel ? undefined : (
                        <PropertyLabel
                            property={property}
                            value={value}
                            isKamelet={isKamelet}
                            isParameter={isParameter}
                            isMultiValueField={isMultiValueField}
                            onPropertyChange={onPropertyChange}
                        />
                    )
                }
                isRequired={property.required}
                labelIcon={
                    isParameter ? undefined : property.description ? (
                        <PropertyHelpIcon
                            title={property.displayName}
                            description={property.description}
                            footerContent={
                                <PropertyHelpFooter
                                    default={
                                        property.defaultValue !== undefined &&
                                        property.defaultValue.toString().trim().length > 0
                                            ? property.defaultValue
                                            : undefined
                                    }
                                    footer={property.required ? 'Required' : undefined}
                                />
                            }
                        />
                    ) : (
                        <div></div>
                    )
                }
            >
                {renderer.render(renderProps)}
            </FormGroup>
        </div>
    );
}
