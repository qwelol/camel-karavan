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
import { Languages } from 'karavan-core/lib/model/CamelMetadata';
import { useDslLanguage } from './useExpressionHelpers';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';

interface Props {
    language: string;
    propertyName: string;
    onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ language, propertyName, onLanguageChange }: Props) {
    const dslLanguage = useDslLanguage(language);
    const selectOptions = Languages.map((lang: [string, string, string]) => (
        <SelectOption key={lang[0]} value={lang[0]} description={lang[2]} />
    ));

    return (
        <div>
            <label className='pf-v5-c-form__label' htmlFor='expression'>
                <span className='pf-v5-c-form__label-text'>Language</span>
                <span className='pf-v5-c-form__label-required' aria-hidden='true'>
                    {' '}
                    *
                </span>
            </label>
            <ManagedSelect
                variant={SelectVariant.typeahead}
                aria-label={propertyName}
                onSelect={(_e, lang, _isPlaceholder) => {
                    onLanguageChange(lang.toString());
                }}
                selections={dslLanguage}
                aria-labelledby={propertyName}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        </div>
    );
}
