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
import { PropertyEditor } from '../../editors/PropertyEditor';
import { ConstructorEditor } from '../../editors/ConstructorEditor';
import { DslRendererProps } from '../types';
import { useIntegrationStore, useDesignerStore } from '../../../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { BeanFactoryDefinition } from 'karavan-core/lib/model/CamelDefinition';

export const DslBeanPropertiesField: React.FC<DslRendererProps> = ({ property }) => {
    const [integration, setIntegration] = useIntegrationStore((s) => [s.integration, s.setIntegration], shallow);
    const [selectedStep, setSelectedStep] = useDesignerStore((s) => [s.selectedStep, s.setSelectedStep], shallow);

    const type = property.name === 'constructors' ? 'constructors' : 'properties';
    const bean = selectedStep as BeanFactoryDefinition;

    const changeBean = (bean: BeanFactoryDefinition) => {
        const clone = CamelUtil.cloneIntegration(integration);
        const i = CamelDefinitionApiExt.addBeanToIntegration(clone, bean);
        setIntegration(i, false);
        setSelectedStep(bean);
    };

    return (
        <div className='properties'>
            {type === 'constructors' && <ConstructorEditor bean={bean} onChange={changeBean} />}
            {type === 'properties' && <PropertyEditor bean={bean} onChange={changeBean} />}
        </div>
    );
};
