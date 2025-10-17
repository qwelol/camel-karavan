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
import { Property } from 'karavan-core/lib/model/KameletModels';
import { usePropertiesHook } from '../usePropertiesHook';
import { PropertyUtil } from './PropertyUtil';
import { useKameletFieldRendererFactory } from './kamelet/hooks/useKameletFieldRendererFactory';
import { KameletRendererProps } from './kamelet/types';

interface Props {
    property: Property;
    value: any;
    required: boolean;
}

export function KameletPropertyField(props: Props) {
    const { property, value, required } = props;
    const { onParametersChange } = usePropertiesHook();
    const id = useId();

    const { getRenderer } = useKameletFieldRendererFactory();

    const handleChange = useCallback(
        (newValue: any) => {
            onParametersChange(property.id, newValue);
        },
        [onParametersChange, property.id],
    );

    const renderProps: KameletRendererProps = useMemo(
        () => ({
            property,
            value,
            onChange: handleChange,
            fieldId: id,
            required,
        }),
        [property, value, handleChange, id, required],
    );

    const renderer = useMemo(() => getRenderer(property, renderProps), [getRenderer, property, renderProps]);

    return (
        <FormGroup
            key={id}
            label={
                <PropertyLabel
                    text={property.title}
                    hasValueChanged={PropertyUtil.hasKameletPropertyValueChanged(property, value)}
                />
            }
            fieldId={id}
            isRequired={required}
            labelIcon={
                <PropertyHelpIcon
                    title={property.title}
                    description={property.description}
                    footerContent={<PropertyHelpFooter default={property.default} example={property.example} />}
                />
            }
        >
            {renderer.render(renderProps)}
        </FormGroup>
    );
}
