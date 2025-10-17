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
import { InputGroup, InputGroupItem, Tooltip, Button } from '@patternfly/react-core';
import { SelectOption } from '@patternfly/react-core/deprecated';
import { SelectVariant, SelectDirection } from '@patternfly/react-core/deprecated';
import { ManagedSelect } from '../../../../utils/components';
import { DslRendererProps } from '../types';
import { useIntegrationStore } from '../../../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { CamelUi } from '../../../../utils/CamelUi';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';

export const DslInternalUriField: React.FC<DslRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    onPropertyChange,
}) => {
    const [files] = useIntegrationStore((s) => [s.files], shallow);

    const selectOptions = useMemo(() => {
        const options: React.JSX.Element[] = [];
        const uris: string[] = CamelUi.getInternalUris(files, true, true, true);
        if (uris && uris.length > 0) {
            options.push(...uris.map((value: string) => <SelectOption key={value} value={value.trim()} />));
        }
        return options;
    }, [files]);

    return (
        <InputGroup id={fieldId} name={fieldId}>
            <InputGroupItem isFill>
                <ManagedSelect
                    placeholderText='Select or type an URI'
                    variant={SelectVariant.typeahead}
                    aria-label={property.name}
                    onClear={(_event) => onChange(undefined)}
                    onSelect={(_, value, isPlaceholder) => {
                        onChange(!isPlaceholder ? value : undefined);
                    }}
                    selections={value}
                    isCreatable={true}
                    isInputFilterPersisted={true}
                    aria-labelledby={property.name}
                    direction={SelectDirection.down}
                >
                    {selectOptions}
                </ManagedSelect>
            </InputGroupItem>
            <InputGroupItem>
                <Tooltip position='bottom-end' content={'Create route'}>
                    <Button
                        isDisabled={value === undefined}
                        variant='control'
                        onClick={(_e) => {
                            if (value) {
                                const newRoute = CamelUi.createNewInternalRoute(value);
                                onPropertyChange?.(property.name, value, newRoute);
                            }
                        }}
                    >
                        <PlusIcon />
                    </Button>
                </Tooltip>
            </InputGroupItem>
        </InputGroup>
    );
};
