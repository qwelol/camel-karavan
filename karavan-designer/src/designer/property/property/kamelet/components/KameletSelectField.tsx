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

import React from 'react';
import { SelectOption } from '@patternfly/react-core/deprecated';
import { SelectVariant, SelectDirection } from '@patternfly/react-core/deprecated';
import { useShowInfrastructureButton } from '../hooks/useShowInfrastructureButton';
import { InfrastructureManagedSelect } from '../../../../utils/components';
import { KameletRendererProps } from '../types';

export const KameletSelectField: React.FC<KameletRendererProps> = React.memo(
    ({ property, value, fieldId, onChange }) => {
        const showInfrastructureButton = useShowInfrastructureButton(property);
        const selectOptions: JSX.Element[] = [];

        if (property.enum) {
            selectOptions.push(
                ...property.enum.map((enumValue: string) => (
                    <SelectOption key={enumValue} value={enumValue ? enumValue.trim() : enumValue} />
                )),
            );
        }

        return (
            <InfrastructureManagedSelect
                id={fieldId}
                name={fieldId}
                placeholderText='Select or type an URI'
                variant={SelectVariant.typeahead}
                aria-label={property.id}
                onSelect={(_e, value, _isPlaceholder) => {
                    onChange(value);
                }}
                selections={value}
                isCreatable={true}
                createText=''
                isInputFilterPersisted={true}
                aria-labelledby={property.id}
                direction={SelectDirection.down}
                showInfrastructureButton={showInfrastructureButton}
                currentValue={value}
                onInfrastructureSelect={onChange}
            >
                {selectOptions}
            </InfrastructureManagedSelect>
        );
    },
);
