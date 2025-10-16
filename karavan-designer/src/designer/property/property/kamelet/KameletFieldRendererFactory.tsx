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
import { Property } from 'karavan-core/lib/model/KameletModels';
import { KameletSelectFieldRenderer } from './renderers/KameletSelectFieldRenderer';
import { KameletStringFieldRenderer } from './renderers/KameletStringFieldRenderer';
import { KameletBooleanFieldRenderer } from './renderers/KameletBooleanFieldRenderer';
import { KameletRenderer } from './types';
import { Skeleton } from '@patternfly/react-core';

class KameletDefaultFieldRenderer implements KameletRenderer {
    canRender(): boolean {
        return true;
    }

    render(): React.ReactElement {
        return <Skeleton height='33px' />;
    }

    priority = 0;
}

export class KameletFieldRendererFactory {
    private renderers: KameletRenderer[] = [];
    private rendererCache = new Map<string, KameletRenderer>();

    constructor() {
        this.registerRenderer(new KameletSelectFieldRenderer());
        this.registerRenderer(new KameletStringFieldRenderer());
        this.registerRenderer(new KameletBooleanFieldRenderer());
    }

    registerRenderer(renderer: KameletRenderer): void {
        this.renderers.push(renderer);
        this.renderers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    getRenderer(property: Property): KameletRenderer {
        const cacheKey = `${property.type}-${property.id}-${property.enum ? 'enum' : 'no-enum'}`;

        if (this.rendererCache.has(cacheKey)) {
            return this.rendererCache.get(cacheKey)!;
        }

        const renderer = this.renderers.find((r) => r.canRender(property));
        const finalRenderer = renderer || new KameletDefaultFieldRenderer();

        this.rendererCache.set(cacheKey, finalRenderer);

        if (!renderer) {
            console.warn(`No Kamelet renderer found for property: ${property.id} (${property.type})`);
        }

        return finalRenderer;
    }

    getAvailableRenderers(property: Property): KameletRenderer[] {
        return this.renderers.filter((r) => r.canRender(property));
    }

    clearCache(): void {
        this.rendererCache.clear();
    }
}
