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
import { ComponentRendererProps } from '../types';
import { useIntegrationStore } from '../../../../DesignerStore';
import { CamelUi } from '../../../../utils/CamelUi';
import { shallow } from 'zustand/shallow';

export const ComponentObjectField: React.FC<ComponentRendererProps> = ({ property, value, fieldId, onChange }) => {
    const [integration] = useIntegrationStore((state) => [state.integration], shallow);
    const beans = useMemo(() => CamelUi.getBeans(integration), [integration]);
    const beanPrefix = '#bean:';

    const selectOptions: React.JSX.Element[] = [];

    if (beans) {
        selectOptions.push(<SelectOption key={0} value={'Select...'} isPlaceholder />);
        selectOptions.push(
            ...beans.map((bean: any) => (
                <SelectOption key={bean.name} value={beanPrefix + bean.name} description={bean.type} />
            )),
        );
    }

    return (
        <ManagedSelect
            id={fieldId}
            name={property.name}
            variant={SelectVariant.typeahead}
            aria-label={property.name}
            onSelect={(_e, value, isPlaceholder) => onChange(!isPlaceholder ? value : undefined)}
            selections={value}
            isCreatable={true}
            createText=''
            aria-labelledby={property.name}
            direction={SelectDirection.down}
        >
            {selectOptions}
        </ManagedSelect>
    );
};
