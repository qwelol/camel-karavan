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

import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { ComponentRendererProps } from './types';
import { BaseFieldRendererFactory } from '../shared/BaseFieldRendererFactory';
import { ComponentEnumFieldRenderer } from './renderers/ComponentEnumFieldRenderer';
import { ComponentStringFieldRenderer } from './renderers/ComponentStringFieldRenderer';
import { ComponentBooleanFieldRenderer } from './renderers/ComponentBooleanFieldRenderer';
import { ComponentNumberFieldRenderer } from './renderers/ComponentNumberFieldRenderer';
import { ComponentObjectFieldRenderer } from './renderers/ComponentObjectFieldRenderer';
import { ComponentInternalUriFieldRenderer } from './renderers/ComponentInternalUriFieldRenderer';

export class ComponentFieldRendererFactory extends BaseFieldRendererFactory<
    ComponentProperty,
    any,
    ComponentRendererProps
> {
    constructor() {
        super();

        // Регистрируем рендереры в порядке приоритета
        this.registerRenderer(new ComponentInternalUriFieldRenderer()); // Приоритет 110 (высший)
        this.registerRenderer(new ComponentStringFieldRenderer()); // Приоритет 100
        this.registerRenderer(new ComponentBooleanFieldRenderer()); // Приоритет 100
        this.registerRenderer(new ComponentNumberFieldRenderer()); // Приоритет 100
        this.registerRenderer(new ComponentObjectFieldRenderer()); // Приоритет 100
        this.registerRenderer(new ComponentEnumFieldRenderer()); // Приоритет 90
    }

    protected getCacheKey(property: ComponentProperty): string {
        return `${property.type}-${property.name}-${property.enum ? 'enum' : 'no-enum'}`;
    }

    protected getPropertyName(property: ComponentProperty): string {
        return property.name;
    }

    protected getPropertyType(property: ComponentProperty): string {
        return property.type;
    }
}
