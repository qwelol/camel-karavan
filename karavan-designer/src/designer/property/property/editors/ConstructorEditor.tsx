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
import { ConstructorField } from '../ConstructorField';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

interface ConstructorEditorProps {
    bean: BeanFactoryDefinition;
    onChange: (bean: BeanFactoryDefinition) => void;
}

export const ConstructorEditor: React.FC<ConstructorEditorProps> = ({ bean, onChange }) => {
    const updateBeanConstructors = useCallback(
        (newConstructors: Record<string, string>) => {
            const updatedBean = CamelUtil.cloneBean(bean);
            updatedBean.constructors = newConstructors;
            onChange(updatedBean);
        },
        [bean, onChange],
    );

    const constructorChanged = useCallback(
        (constructorKey: number, newKey: number, value: string) => {
            const constructors = { ...bean.constructors };

            // Remove old key if it exists and is different
            if (constructorKey !== undefined && constructorKey !== newKey) {
                delete constructors[constructorKey.toString()];
            }

            // Add new key
            if (newKey !== undefined) {
                constructors[newKey.toString()] = value;
            }

            updateBeanConstructors(constructors);
        },
        [bean.constructors, updateBeanConstructors],
    );

    const constructorDeleted = useCallback(
        (key: number) => {
            const constructors = { ...bean.constructors };
            delete constructors[key.toString()];
            updateBeanConstructors(constructors);
        },
        [bean.constructors, updateBeanConstructors],
    );

    const getConstructorsEntries = useCallback((): [string, string][] => {
        const constructors = bean?.constructors || {};
        return Object.entries(constructors);
    }, [bean.constructors]);

    const getNextConstructorKey = useCallback((): number => {
        const constructors = bean?.constructors || {};
        return Math.max(...Object.keys(constructors).map(Number), -1) + 1;
    }, [bean.constructors]);

    return (
        <>
            {getConstructorsEntries().map((v, index) => {
                const key = parseInt(v[0]);
                const value = v[1];
                return (
                    <ConstructorField
                        key={`constructor-${key}-${index}`}
                        keyValue={key}
                        value={value}
                        onKeyChange={constructorChanged}
                        onValueChange={(k, v) => constructorChanged(k, k, v)}
                        onDelete={constructorDeleted}
                    />
                );
            })}
            <Button
                variant='link'
                className='add-button'
                onClick={() => {
                    const nextKey = getNextConstructorKey();
                    constructorChanged(-1, nextKey, '');
                }}
            >
                <AddIcon />
                Add argument
            </Button>
        </>
    );
};
