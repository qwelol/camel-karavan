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
import React, { useCallback } from 'react';
import { Button } from '@patternfly/react-core';
import { BeanFactoryDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { PropertyField } from '../PropertyField';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

interface PropertyEditorProps {
    bean: BeanFactoryDefinition;
    onChange: (bean: BeanFactoryDefinition) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ bean, onChange }) => {
    const updateBeanProperties = useCallback(
        (newProperties: Record<string, string>) => {
            const updatedBean = CamelUtil.cloneBean(bean);
            updatedBean.properties = newProperties;
            onChange(updatedBean);
        },
        [bean, onChange],
    );

    const propertyChanged = useCallback(
        (propertyKey: string, newKey: string, value: string) => {
            const properties = { ...bean.properties };

            // Remove old key if it exists and is different
            if (propertyKey && propertyKey !== newKey) {
                delete properties[propertyKey];
            }

            // Add new key
            if (newKey) {
                properties[newKey] = value;
            }

            updateBeanProperties(properties);
        },
        [bean.properties, updateBeanProperties],
    );

    const propertyDeleted = useCallback(
        (key: string) => {
            const properties = { ...bean.properties };
            delete properties[key];
            updateBeanProperties(properties);
        },
        [bean.properties, updateBeanProperties],
    );

    const getPropertiesEntries = useCallback((): [string, string][] => {
        const properties = bean?.properties || {};
        return Object.entries(properties);
    }, [bean.properties]);

    return (
        <>
            {getPropertiesEntries().map((v, index) => {
                const key = v[0];
                const value = v[1];
                return (
                    <PropertyField
                        key={`property-${key}-${index}`}
                        keyValue={key}
                        value={value}
                        onKeyChange={propertyChanged}
                        onValueChange={(k, v) => propertyChanged(k, k, v)}
                        onDelete={propertyDeleted}
                    />
                );
            })}
            <Button variant='link' className='add-button' onClick={() => propertyChanged('', '', '')}>
                <AddIcon />
                Add property
            </Button>
        </>
    );
};
