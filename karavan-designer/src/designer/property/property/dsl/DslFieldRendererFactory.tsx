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

import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { DslRendererProps } from './types';
import { BaseFieldRendererFactory } from '../shared/BaseFieldRendererFactory';
import { DslStringFieldRenderer } from './renderers/DslStringFieldRenderer';
import { DslBooleanFieldRenderer } from './renderers/DslBooleanFieldRenderer';
import { DslNumberFieldRenderer } from './renderers/DslNumberFieldRenderer';
import { DslVariableFieldRenderer } from './renderers/DslVariableFieldRenderer';
import { DslJavaTypeFieldRenderer } from './renderers/DslJavaTypeFieldRenderer';
import { DslTextAreaFieldRenderer } from './renderers/DslTextAreaFieldRenderer';
import { DslMediaTypeFieldRenderer } from './renderers/DslMediaTypeFieldRenderer';
import { DslInternalUriFieldRenderer } from './renderers/DslInternalUriFieldRenderer';
import { DslObjectFieldRenderer } from './renderers/DslObjectFieldRenderer';
import { DslExpressionFieldRenderer } from './renderers/DslExpressionFieldRenderer';
import { DslSelectBeanFieldRenderer } from './renderers/DslSelectBeanFieldRenderer';
import { DslEnumFieldRenderer } from './renderers/DslEnumFieldRenderer';
import { DslMultiValueFieldRenderer } from './renderers/DslMultiValueFieldRenderer';
import { DslMultiValueObjectFieldRenderer } from './renderers/DslMultiValueObjectFieldRenderer';
import { DslKameletParametersFieldRenderer } from './renderers/DslKameletParametersFieldRenderer';
import { DslComponentParametersFieldRenderer } from './renderers/DslComponentParametersFieldRenderer';
import { DslBeanPropertiesFieldRenderer } from './renderers/DslBeanPropertiesFieldRenderer';

export class DslFieldRendererFactory extends BaseFieldRendererFactory<PropertyMeta, any, DslRendererProps> {
    constructor() {
        super();

        // Регистрируем рендереры в порядке приоритета
        this.registerRenderer(new DslExpressionFieldRenderer()); // Приоритет 120 (высший)
        this.registerRenderer(new DslMultiValueFieldRenderer()); // Приоритет 115 (высокий)
        this.registerRenderer(new DslVariableFieldRenderer()); // Приоритет 110
        this.registerRenderer(new DslJavaTypeFieldRenderer()); // Приоритет 105
        this.registerRenderer(new DslMediaTypeFieldRenderer()); // Приоритет 105
        this.registerRenderer(new DslInternalUriFieldRenderer()); // Приоритет 105
        this.registerRenderer(new DslBooleanFieldRenderer()); // Приоритет 100
        this.registerRenderer(new DslNumberFieldRenderer()); // Приоритет 100
        this.registerRenderer(new DslStringFieldRenderer()); // Приоритет 100
        this.registerRenderer(new DslSelectBeanFieldRenderer()); // Приоритет 100
        this.registerRenderer(new DslEnumFieldRenderer()); // Приоритет 100
        this.registerRenderer(new DslTextAreaFieldRenderer()); // Приоритет 95
        this.registerRenderer(new DslObjectFieldRenderer()); // Приоритет 90
        this.registerRenderer(new DslMultiValueObjectFieldRenderer()); // Приоритет 85
        this.registerRenderer(new DslKameletParametersFieldRenderer()); // Приоритет 80
        this.registerRenderer(new DslComponentParametersFieldRenderer()); // Приоритет 80
        this.registerRenderer(new DslBeanPropertiesFieldRenderer()); // Приоритет 80
    }

    protected getCacheKey(property: PropertyMeta): string {
        return `${property.type}-${property.name}-${property.isObject ? 'object' : 'primitive'}-${property.isArray ? 'array' : 'single'}`;
    }

    protected getPropertyName(property: PropertyMeta): string {
        return property.name;
    }

    protected getPropertyType(property: PropertyMeta): string {
        return property.type;
    }
}
