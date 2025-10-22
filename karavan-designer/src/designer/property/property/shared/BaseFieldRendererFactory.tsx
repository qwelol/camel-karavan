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
import { FieldRenderer } from './types';
import { Skeleton } from '@patternfly/react-core';

class DefaultFieldRenderer<TProperty = any, TValue = any, TRenderProps = any>
    implements FieldRenderer<TProperty, TValue, TRenderProps>
{
    canRender(): boolean {
        return true;
    }

    render(): React.ReactElement {
        return <Skeleton height='33px' />;
    }

    priority = 0;
}

export class BaseFieldRendererFactory<TProperty = any, TValue = any, TRenderProps = any> {
    protected renderers: FieldRenderer<TProperty, TValue, TRenderProps>[] = [];
    protected rendererCache = new Map<string, FieldRenderer<TProperty, TValue, TRenderProps>>();
    protected defaultRenderer: FieldRenderer<TProperty, TValue, TRenderProps>;

    constructor(defaultRenderer?: FieldRenderer<TProperty, TValue, TRenderProps>) {
        this.defaultRenderer = defaultRenderer || new DefaultFieldRenderer<TProperty, TValue, TRenderProps>();
    }

    registerRenderer(renderer: FieldRenderer<TProperty, TValue, TRenderProps>): void {
        this.renderers.push(renderer);
        this.renderers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    getRenderer(property: TProperty, props: TRenderProps): FieldRenderer<TProperty, TValue, TRenderProps> {
        const cacheKey = this.getCacheKey(property, props);

        if (this.rendererCache.has(cacheKey)) {
            const cachedRenderer = this.rendererCache.get(cacheKey)!;

            if (cachedRenderer.canRender(property, props)) {
                return cachedRenderer;
            } else {
                this.rendererCache.delete(cacheKey);
            }
        }

        const renderer = this.renderers.find((r) => r.canRender(property, props));
        const finalRenderer = renderer || this.defaultRenderer;

        this.rendererCache.set(cacheKey, finalRenderer);

        if (!renderer) {
            console.warn(
                `No renderer found for property: ${this.getPropertyName(property)} (${this.getPropertyType(property)})`,
            );
        }

        return finalRenderer;
    }

    getAvailableRenderers(property: TProperty, props: TRenderProps): FieldRenderer<TProperty, TValue, TRenderProps>[] {
        return this.renderers.filter((r) => r.canRender(property, props));
    }

    clearCache(): void {
        this.rendererCache.clear();
    }

    protected getCacheKey(property: TProperty, _props?: TRenderProps): string {
        return `${this.getPropertyType(property)}-${this.getPropertyName(property)}`;
    }

    protected getPropertyName(property: TProperty): string {
        return (property as any).name || 'unknown';
    }

    protected getPropertyType(property: TProperty): string {
        return (property as any).type || 'unknown';
    }
}
