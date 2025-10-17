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
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { DslRenderer } from '../types';
import { DslRendererProps } from '../types';
import { ComponentParameters } from '../../ComponentParameters';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';

export class DslComponentParametersFieldRenderer implements DslRenderer {
    canRender(property: PropertyMeta, props: DslRendererProps): boolean {
        const { element } = props;
        const isKamelet = CamelUtil.isKameletComponent(element);

        return !isKamelet && property.name === 'parameters';
    }

    render(props: DslRendererProps): React.ReactElement {
        const { element } = props;
        return <ComponentParameters element={element} />;
    }

    priority = 80; // Низкий приоритет для специфичных полей
}
