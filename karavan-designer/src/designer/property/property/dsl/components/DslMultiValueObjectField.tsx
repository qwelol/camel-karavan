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

import React, { useMemo } from 'react';
import { Button, Card } from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { DslMultiObjectFieldItem } from './DslMultiObjectFieldItem';
import { DslRendererProps } from '../types';
import { PropertyUtil } from '../../PropertyUtil';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';

export const DslMultiValueObjectField: React.FC<DslRendererProps> = ({ property, value, onPropertyChange }) => {
    const isKeyValue = useMemo(() => PropertyUtil.isKeyValueObject(property), [property]);

    return (
        <div>
            {value &&
                Array.from(value).map((v: any, index: number) => {
                    if (isKeyValue)
                        return (
                            <div key={property.name + '-' + index} className='object-key-value'>
                                <DslMultiObjectFieldItem
                                    property={property}
                                    value={value}
                                    itemValue={v}
                                    index={index}
                                    hideLabel={index > 0}
                                    onPropertyChange={onPropertyChange}
                                />
                            </div>
                        );
                    else
                        return (
                            <Card key={property.name + '-' + index} className='object-value'>
                                <DslMultiObjectFieldItem
                                    property={property}
                                    value={value}
                                    itemValue={v}
                                    index={index}
                                    onPropertyChange={onPropertyChange}
                                />
                            </Card>
                        );
                })}
            <Button
                variant='link'
                className='add-button'
                onClick={(_e) => {
                    const valArray = value !== null ? [...value] : [];
                    valArray.push(CamelDefinitionApi.createStep(property.type, {}));
                    onPropertyChange?.(property.name, valArray);
                }}
            >
                <PlusIcon />
                {'Add ' + property.displayName}
            </Button>
        </div>
    );
};
