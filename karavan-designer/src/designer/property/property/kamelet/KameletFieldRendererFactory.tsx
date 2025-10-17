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

import { Property } from 'karavan-core/lib/model/KameletModels';
import { KameletSelectFieldRenderer } from './renderers/KameletSelectFieldRenderer';
import { KameletStringFieldRenderer } from './renderers/KameletStringFieldRenderer';
import { KameletBooleanFieldRenderer } from './renderers/KameletBooleanFieldRenderer';
import { KameletRendererProps } from './types';
import { BaseFieldRendererFactory } from '../shared/BaseFieldRendererFactory';

export class KameletFieldRendererFactory extends BaseFieldRendererFactory<Property, any, KameletRendererProps> {
    constructor() {
        super();

        this.registerRenderer(new KameletSelectFieldRenderer());
        this.registerRenderer(new KameletStringFieldRenderer());
        this.registerRenderer(new KameletBooleanFieldRenderer());
    }

    protected getCacheKey(property: Property): string {
        return `${property.type}-${property.id}-${property.enum ? 'enum' : 'no-enum'}`;
    }

    protected getPropertyName(property: Property): string {
        return property.id;
    }

    protected getPropertyType(property: Property): string {
        return property.type;
    }
}
