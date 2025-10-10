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
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';

export class PropertyTypeUtil {
    static isVariableProperty(propertyName: string, dslName?: string): boolean {
        if (['variableSend', 'variableReceive'].includes(propertyName)) {
            return true;
        }

        const variableDefinitions = ['SetVariableDefinition', 'RemoveVariableDefinition'];
        const convertVariableProperties = ['name', 'toName'];

        if (propertyName === 'name' && variableDefinitions.includes(dslName || '')) {
            return true;
        }

        if (convertVariableProperties.includes(propertyName) && dslName === 'ConvertVariableDefinition') {
            return true;
        }

        return false;
    }

    static isParameter(property: PropertyMeta): boolean {
        return property.name === 'parameters' && property.description === 'parameters';
    }

    static isKeyValueObject(property: PropertyMeta): boolean {
        const props = CamelDefinitionApiExt.getElementProperties(property.type);

        if (props.length !== 2) {
            return false;
        }

        const hasKey = props.some((p) => p.name === 'key');
        const hasValue = props.some((p) => p.name === 'value');

        return hasKey && hasValue;
    }

    static isMultiValueField(property: PropertyMeta): boolean {
        return property.type === 'string' && property.name !== 'expression' && property.isArray && !property.enumVals;
    }

    static javaTypeGenerated(property: PropertyMeta): boolean {
        return property.javaType.length !== 0;
    }
}
