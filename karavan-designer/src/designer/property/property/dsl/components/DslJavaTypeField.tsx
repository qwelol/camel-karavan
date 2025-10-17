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
import { SelectOptionProps } from '@patternfly/react-core';
import { SelectField } from '../../SelectField';
import { DslRendererProps } from '../types';
import { useDesignerStore } from '../../../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { SpiBeanApi } from 'karavan-core/lib/api/SpiBeanApi';

const beanPrefix = '#bean:';
const classPrefix = '#class:';

export const DslJavaTypeField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange }) => {
    const [beans] = useDesignerStore((s) => [s.beans], shallow);

    const selectOptions: SelectOptionProps[] = useMemo(() => {
        const options: SelectOptionProps[] = [];

        if (beans) {
            options.push(
                ...beans.map((bean) => ({
                    value: beanPrefix + bean.name,
                    children: bean.name,
                })),
            );

            options.push(
                ...SpiBeanApi.findByInterfaceTypeSimple(property.javaType).map((bean) => ({
                    value: classPrefix + bean.javaType,
                    children: bean.name,
                    description: bean.description,
                })),
            );
        }

        return options;
    }, [beans, property.javaType]);

    return (
        <SelectField
            id={fieldId}
            name={property.name}
            placeholder='Select bean'
            selectOptions={selectOptions}
            value={value?.toString()}
            onChange={(_, value) => onChange(value)}
        />
    );
};
