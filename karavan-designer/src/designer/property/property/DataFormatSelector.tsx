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
import { ManagedSelect } from '../../utils/components';
import { SelectVariant, SelectDirection, SelectOption } from '@patternfly/react-core/deprecated';
import { DataFormats } from 'karavan-core/lib/model/CamelMetadata';

interface Props {
    value: string;
    onDataFormatChange: (dataFormat: string) => void;
}

export function DataFormatSelector({ value, onDataFormatChange }: Props) {
    const selectOptions: JSX.Element[] = [];
    DataFormats.forEach((lang: [string, string, string]) => {
        const s = <SelectOption key={lang[0]} value={lang[0]} description={lang[2]} />;
        selectOptions.push(s);
    });

    return (
        <div>
            <label className='pf-v5-c-form__label' htmlFor='dataFormat'>
                <span className='pf-v5-c-form__label-text'>{'Data Format'}</span>
                <span className='pf-v5-c-form__label-required' aria-hidden='true'>
                    {' '}
                    *
                </span>
            </label>
            <ManagedSelect
                variant={SelectVariant.typeahead}
                aria-label={'dataFormat'}
                onSelect={(_, dataFormat, _isPlaceholder) => onDataFormatChange(dataFormat.toString())}
                selections={value}
                aria-labelledby={'dataFormat'}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        </div>
    );
}
