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
import { SelectOption } from '@patternfly/react-core/deprecated';
import { SelectVariant, SelectDirection } from '@patternfly/react-core/deprecated';
import { ManagedSelect } from '../../../../utils/components';
import { DslRendererProps } from '../types';
import { MediaTypes } from '../../../../utils/MediaTypes';

export const DslMediaTypeField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange }) => {
    const getMediaTypeSelectOptions = useMemo(() => {
        return (filter?: string): React.JSX.Element[] => {
            const options: React.JSX.Element[] = [<SelectOption key={0} value='Select Media Type' isPlaceholder />];
            const mediaTypes: React.JSX.Element[] = filter
                ? MediaTypes.filter((mt) => mt.includes(filter)).map((value: string) => (
                      <SelectOption key={value} value={value.trim()} />
                  ))
                : MediaTypes.map((value: string) => <SelectOption key={value} value={value.trim()} />);
            options.push(...mediaTypes);
            return options;
        };
    }, []);

    return (
        <ManagedSelect
            id={fieldId}
            name={fieldId}
            placeholderText='Select Media Type'
            variant={SelectVariant.typeahead}
            aria-label={property.name}
            onSelect={(_, value, isPlaceholder) => onChange(!isPlaceholder ? value : undefined)}
            selections={value}
            isCreatable={false}
            isInputFilterPersisted={false}
            onFilter={(_, text) => getMediaTypeSelectOptions(text)}
            aria-labelledby={property.name}
            direction={SelectDirection.down}
        >
            {getMediaTypeSelectOptions()}
        </ManagedSelect>
    );
};
