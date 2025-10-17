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
import { SelectVariant, SelectDirection, SelectOption } from '@patternfly/react-core/deprecated';
import { ManagedSelect } from '../../../../utils/components';
import { ComponentRendererProps } from '../types';
import { useIntegrationStore } from '../../../../DesignerStore';
import { CamelUi } from '../../../../utils/CamelUi';
import { shallow } from 'zustand/shallow';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { PropertyUtil } from '../../PropertyUtil';
import { usePropertiesHook } from '../../../usePropertiesHook';

export const ComponentInternalUriField: React.FC<ComponentRendererProps> = ({
    property,
    value,
    fieldId,
    onChange,
    element,
}) => {
    const [integration, files] = useIntegrationStore((state) => [state.integration, state.files], shallow);
    const { getInternalComponentName } = usePropertiesHook();

    const componentName = useMemo(() => {
        return getInternalComponentName(property.name, element);
    }, [property.name, element]);

    const internalUris = useMemo(
        () => CamelUi.getInternalRouteUris(integration, componentName, false),
        [integration, componentName],
    );

    const checkUriDirect = useMemo(
        () => PropertyUtil.checkUriComponent(property, element, 'direct'),
        [property, element],
    );

    const checkUriSeda = useMemo(() => PropertyUtil.checkUriComponent(property, element, 'seda'), [property, element]);

    const checkUriVertx = useMemo(
        () => PropertyUtil.checkUriComponent(property, element, 'vertx'),
        [property, element],
    );

    const uris = useMemo(() => {
        let uriList: string[] = CamelUi.getInternalUris(files, checkUriDirect, checkUriSeda, checkUriVertx);
        uriList.push(...internalUris);
        uriList = [...new Set(uriList.map((e) => (e.includes(':') ? e.split(':')?.at(1) || '' : e)))];

        if (value && value.length > 0 && !uriList.includes(value)) {
            uriList.unshift(value);
        }

        return uriList;
    }, [files, checkUriDirect, checkUriSeda, checkUriVertx, internalUris, value]);

    const selectOptions: React.JSX.Element[] = [];
    if (uris && uris.length > 0) {
        selectOptions.push(...uris.map((uri: string) => <SelectOption key={uri} value={uri ? uri.trim() : uri} />));
    }

    const handleCreateRoute = () => {
        if (value) {
            const newRoute = !internalUris.includes(value.toString())
                ? CamelUi.createNewInternalRoute(componentName.concat(...':', value.toString()))
                : undefined;
            onChange(value, property.kind === 'path', newRoute);
        }
    };

    return (
        <InputGroup>
            <InputGroupItem isFill>
                <ManagedSelect
                    id={fieldId}
                    name={property.name}
                    placeholderText='Select or type an URI'
                    variant={SelectVariant.typeahead}
                    aria-label={property.name}
                    onSelect={(e, value, isPlaceholder) => {
                        onChange(!isPlaceholder ? value : undefined, property.kind === 'path');
                    }}
                    selections={value}
                    isCreatable={true}
                    createText=''
                    isInputFilterPersisted={true}
                    aria-labelledby={property.name}
                    direction={SelectDirection.down}
                >
                    {selectOptions}
                </ManagedSelect>
            </InputGroupItem>
            <InputGroupItem>
                <Tooltip position='bottom-end' content={'Create route'}>
                    <Button isDisabled={value === undefined} variant='control' onClick={handleCreateRoute}>
                        <PlusIcon />
                    </Button>
                </Tooltip>
            </InputGroupItem>
        </InputGroup>
    );
};
