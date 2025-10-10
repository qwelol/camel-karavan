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
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';

export class PropertyUriUtil {
    static canBeInternalUri(property: PropertyMeta, element?: CamelElement): boolean {
        const dslName = element?.dslName;
        const propertyName = property.name;

        if (dslName === 'WireTapDefinition' && propertyName === 'uri') {
            return true;
        }

        if (dslName === 'SagaDefinition' && ['compensation', 'completion'].includes(propertyName)) {
            return true;
        }

        const restDefinitions = [
            'GetDefinition',
            'PostDefinition',
            'PutDefinition',
            'PatchDefinition',
            'DeleteDefinition',
            'HeadDefinition',
        ];

        if (dslName && restDefinitions.includes(dslName) && propertyName === 'to') {
            return true;
        }

        return false;
    }

    static canBeMediaType(property: PropertyMeta, element?: CamelElement): boolean {
        const dslName = element?.dslName;
        const propertyName = property.name;

        const restDefinitions = [
            'RestDefinition',
            'GetDefinition',
            'PostDefinition',
            'PutDefinition',
            'PatchDefinition',
            'DeleteDefinition',
            'HeadDefinition',
        ];
        const mediaTypeProperties = ['consumes', 'produces'];

        if (dslName && restDefinitions.includes(dslName) && mediaTypeProperties.includes(propertyName)) {
            return true;
        }

        return false;
    }

    static isUriReadOnly(property: PropertyMeta, dslName?: string): boolean {
        const propertyName = property.name;

        const editableUriDefinitions = [
            'ToDynamicDefinition',
            'WireTapDefinition',
            'InterceptFromDefinition',
            'InterceptSendToEndpointDefinition',
        ];

        return propertyName === 'uri' && !editableUriDefinitions.includes(dslName || '');
    }
}
