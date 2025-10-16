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

interface FieldRenderer<TProperty, TValue, RenderProps extends BaseRenderProps<TProperty, TValue>> {
    canRender(property: TProperty): boolean;
    render(props: RenderProps): React.ReactElement;
    validate?(value: TValue, property: TProperty): ValidationResult;
    priority?: number;
}

interface BaseRenderProps<TProperty, TValue> {
    property: TProperty;
    value: TValue;
    onChange: (value: TValue) => void;
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface KameletRendererProps extends BaseRenderProps<Property, any> {
    fieldId: string;
    required: boolean;
}

export type KameletRenderer = FieldRenderer<Property, any, KameletRendererProps>;
