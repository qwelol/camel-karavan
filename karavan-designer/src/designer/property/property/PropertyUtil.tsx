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

import { PropertyValueUtil } from './PropertyValueUtil';
import { PropertyTypeUtil } from './PropertyTypeUtil';
import { PropertyUriUtil } from './PropertyUriUtil';
import { ComponentPropertyUtil } from './ComponentPropertyUtil';

export class PropertyUtil {
    static hasDslPropertyValueChanged = PropertyValueUtil.hasDslPropertyValueChanged;
    static hasComponentPropertyValueChanged = PropertyValueUtil.hasComponentPropertyValueChanged;
    static hasKameletPropertyValueChanged = PropertyValueUtil.hasKameletPropertyValueChanged;

    static isVariableProperty = PropertyTypeUtil.isVariableProperty;
    static isParameter = PropertyTypeUtil.isParameter;
    static isKeyValueObject = PropertyTypeUtil.isKeyValueObject;
    static isMultiValueField = PropertyTypeUtil.isMultiValueField;
    static javaTypeGenerated = PropertyTypeUtil.javaTypeGenerated;

    static canBeInternalUri = PropertyUriUtil.canBeInternalUri;
    static canBeMediaType = PropertyUriUtil.canBeMediaType;
    static isUriReadOnly = PropertyUriUtil.isUriReadOnly;

    static canBeInternalUriComponent = ComponentPropertyUtil.canBeInternalUriComponent;
    static checkUriComponent = ComponentPropertyUtil.checkUriComponent;
}
