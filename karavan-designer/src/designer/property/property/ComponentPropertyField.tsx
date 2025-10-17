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
import '@patternfly/patternfly/patternfly.css';
import { PropertyHelpIcon, PropertyHelpFooter, PropertyLabel } from '../../utils/components';
import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { usePropertiesHook } from '../usePropertiesHook';
import { PropertyUtil } from './PropertyUtil';
import { useComponentFieldRendererFactory } from './component/hooks/useComponentFieldRendererFactory';
import { ComponentRendererProps } from './component/types';

interface Props {
    property: ComponentProperty;
    element?: CamelElement;
    value: any;
}

export function ComponentPropertyField(props: Props) {
    const { onParametersChange } = usePropertiesHook();
    const { property, value, element } = props;
    const id = useId();

    const { getRenderer } = useComponentFieldRendererFactory();

    const handleChange = useCallback(
        (newValue: any, pathParameter?: boolean, newRoute?: any) => {
            onParametersChange(property.name, newValue, pathParameter, newRoute);
        },
        [onParametersChange, property.name],
    );

    const renderProps: ComponentRendererProps = useMemo(
        () => ({
            property,
            value,
            onChange: handleChange,
            fieldId: id,
            required: property.required,
            element,
        }),
        [property, value, handleChange, id, element],
    );

    const renderer = useMemo(() => {
        return getRenderer(property, renderProps);
    }, [getRenderer, property, renderProps]);

    return (
        <FormGroup
            key={id}
            label={
                <PropertyLabel
                    text={property.displayName}
                    hasValueChanged={PropertyUtil.hasComponentPropertyValueChanged(property, value)}
                />
            }
            isRequired={property.required}
            labelIcon={
                <PropertyHelpIcon
                    title={property.displayName}
                    description={property.description}
                    footerContent={
                        <PropertyHelpFooter
                            default={property.defaultValue}
                            footer={property.required ? `${property.displayName} is required` : undefined}
                        />
                    }
                />
            }
        >
            {renderer.render(renderProps)}
        </FormGroup>
    );
}
