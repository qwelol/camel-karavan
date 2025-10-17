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
import { DslRenderer, DslRendererProps } from '../types';
import { DslVariableField } from '../components/DslVariableField';
import { PropertyUtil } from '../../PropertyUtil';

export class DslVariableFieldRenderer implements DslRenderer {
    canRender(property: PropertyMeta, props: DslRendererProps): boolean {
        const { element } = props;
        return PropertyUtil.isVariableProperty(property.name, element?.dslName);
    }

    render(props: DslRendererProps): React.ReactElement {
        return <DslVariableField {...props} />;
    }

    priority = 110; // Высший приоритет для переменных
}
