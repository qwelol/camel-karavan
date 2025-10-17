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
import { useIntegrationStore } from '../../../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { CamelUi } from '../../../../utils/CamelUi';

export const DslSelectBeanField: React.FC<DslRendererProps> = ({ property, value, fieldId, onChange }) => {
    const [integration] = useIntegrationStore((s) => [s.integration], shallow);

    const selectOptions = useMemo(() => {
        const options: React.JSX.Element[] = [];
        const beans = CamelUi.getBeans(integration);
        if (beans) {
            options.push(<SelectOption key={0} value={'Select...'} isPlaceholder />);
            options.push(
                ...beans.map((bean) => <SelectOption key={bean.name} value={bean.name} description={bean.type} />),
            );
        }
        return options;
    }, [integration]);

    return (
        <ManagedSelect
            id={fieldId}
            name={fieldId}
            variant={SelectVariant.single}
            aria-label={property.name}
            onSelect={(_, value, isPlaceholder) => onChange(!isPlaceholder ? value : undefined)}
            selections={value}
            aria-labelledby={property.name}
            direction={SelectDirection.down}
        >
            {selectOptions}
        </ManagedSelect>
    );
};
