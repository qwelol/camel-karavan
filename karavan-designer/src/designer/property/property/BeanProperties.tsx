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
import { TextInput, Button, Tooltip, InputGroup, InputGroupItem, capitalize } from '@patternfly/react-core';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import { BeanFactoryDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { SensitiveKeys } from 'karavan-core/lib/model/CamelMetadata';
import DeleteIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import { PasswordTextInput } from '../../utils/components';
import NiceModal from '@ebay/nice-modal-react';
import { InfrastructureModal } from '../../utils/modals';
import DockerIcon from '@patternfly/react-icons/dist/js/icons/docker-icon';
import { useDesignerStore } from '../../DesignerStore';
import { shallow } from 'zustand/shallow';
import { KubernetesIcon } from '../../icons/ComponentIcons';

interface Props {
    type: 'constructors' | 'properties';
    onChange: (bean: BeanFactoryDefinition) => void;
    onClone: (bean: BeanFactoryDefinition) => void;
}

export function BeanProperties(props: Props) {
    const [selectedStep] = useDesignerStore((s) => [s.selectedStep], shallow);

    function getPropertiesEntries(): [string, string][] {
        const bean = selectedStep as BeanFactoryDefinition;
        const properties = bean?.properties || {};
        return Object.entries(properties);
    }

    function getConstructorsEntries(): [string, string][] {
        const bean = selectedStep as BeanFactoryDefinition;
        const constructors = bean?.constructors || {};
        return Object.entries(constructors);
    }

    function updateBeanProperties(newProperties: Record<string, string>) {
        if (selectedStep) {
            const bean = CamelUtil.cloneBean(selectedStep as BeanFactoryDefinition);
            bean.properties = newProperties;
            props.onChange(bean);
        }
    }

    function updateBeanConstructors(newConstructors: Record<string, string>) {
        if (selectedStep) {
            const bean = CamelUtil.cloneBean(selectedStep as BeanFactoryDefinition);
            bean.constructors = newConstructors;
            props.onChange(bean);
        }
    }

    function propertyChanged(propertyKey: string, newKey: string, value: string) {
        const bean = selectedStep as BeanFactoryDefinition;
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
    }

    function constructorChanged(constructorKey: number, newKey: number, value: string) {
        const bean = selectedStep as BeanFactoryDefinition;
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
    }

    function propertyDeleted(key: string) {
        const bean = selectedStep as BeanFactoryDefinition;
        const properties = { ...bean.properties };
        delete properties[key];
        updateBeanProperties(properties);
    }

    function constructorDeleted(key: number) {
        const bean = selectedStep as BeanFactoryDefinition;
        const constructors = { ...bean.constructors };
        delete constructors[key.toString()];
        updateBeanConstructors(constructors);
    }

    async function selectInfrastructure(propertyName: string) {
        const infrastructureValue = await NiceModal.show(InfrastructureModal, {});

        if (typeof infrastructureValue === 'string') {
            let finalValue = infrastructureValue;

            if (finalValue.startsWith('config') || finalValue.startsWith('secret')) {
                finalValue = '{{' + finalValue + '}}';
            }

            propertyChanged(propertyName, propertyName, finalValue);
        }
    }

    function getBeanConstructors() {
        return (
            <>
                {getConstructorsEntries().map((v, index) => {
                    const key = v[0];
                    const value = v[1];
                    const i = `constructor-${key}-${index}`;
                    const isSecret = false;
                    return (
                        <div key={'key-' + i} className='bean-property'>
                            <TextInput
                                placeholder='Argument Index'
                                className='text-field'
                                isRequired
                                type='text'
                                id={'key-' + i}
                                name={'key-' + i}
                                value={key}
                                onChange={(_, beanFieldName) => {
                                    constructorChanged(parseInt(key), parseInt(beanFieldName), value);
                                }}
                            />
                            <PasswordTextInput
                                placeholder='Argument Value'
                                isSecret={isSecret}
                                autoComplete='off'
                                className='text-field'
                                isRequired
                                id={'value-' + i}
                                name={'value-' + i}
                                value={value}
                                onChange={(_, newValue) => {
                                    constructorChanged(parseInt(key), parseInt(key), newValue);
                                }}
                            />
                            <Button
                                variant='link'
                                className='delete-button'
                                onClick={(_e) => constructorDeleted(parseInt(key))}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                    );
                })}
                <Button
                    variant='link'
                    className='add-button'
                    onClick={(_e) => {
                        const bean = selectedStep as BeanFactoryDefinition;
                        const constructors = bean?.constructors || {};
                        const nextKey = Math.max(...Object.keys(constructors).map(Number), -1) + 1;
                        constructorChanged(-1, nextKey, '');
                    }}
                >
                    <AddIcon />
                    Add argument
                </Button>
            </>
        );
    }

    function getBeanProperties() {
        return (
            <>
                {getPropertiesEntries().map((v, index) => {
                    const key = v[0];
                    const value = v[1];
                    const i = `property-${key}-${index}`;
                    const isSecret = key !== undefined && SensitiveKeys.includes(key.toLowerCase());
                    const inInfrastructure = InfrastructureAPI.infrastructure !== 'local';
                    const icon =
                        InfrastructureAPI.infrastructure === 'kubernetes' ? (
                            KubernetesIcon('infra-button')
                        ) : (
                            <DockerIcon />
                        );
                    return (
                        <div key={'key-' + i} className='bean-property'>
                            <TextInput
                                placeholder='Bean Field Name'
                                className='text-field'
                                isRequired
                                type='text'
                                id={'key-' + i}
                                name={'key-' + i}
                                value={key}
                                onChange={(_, beanFieldName) => {
                                    propertyChanged(key, beanFieldName, value);
                                }}
                            />
                            <InputGroup>
                                {inInfrastructure && (
                                    <Tooltip
                                        position='bottom-end'
                                        content={'Select from ' + capitalize(InfrastructureAPI.infrastructure)}
                                    >
                                        <Button variant='control' onClick={(_e) => selectInfrastructure(key)}>
                                            {icon}
                                        </Button>
                                    </Tooltip>
                                )}
                                <InputGroupItem isFill>
                                    <PasswordTextInput
                                        placeholder='Bean Field Value'
                                        isSecret={isSecret}
                                        autoComplete='off'
                                        className='text-field'
                                        isRequired
                                        id={'value-' + i}
                                        name={'value-' + i}
                                        value={value}
                                        onChange={(_, newValue) => {
                                            propertyChanged(key, key, newValue);
                                        }}
                                    />
                                </InputGroupItem>
                            </InputGroup>
                            <Button variant='link' className='delete-button' onClick={(_e) => propertyDeleted(key)}>
                                <DeleteIcon />
                            </Button>
                        </div>
                    );
                })}
                <Button variant='link' className='add-button' onClick={(_e) => propertyChanged('', '', '')}>
                    <AddIcon />
                    Add property
                </Button>
            </>
        );
    }

    const bean = selectedStep as BeanFactoryDefinition;
    return (
        <div className='properties' key={bean ? bean.uuid : 'integration'}>
            {props.type === 'constructors' && getBeanConstructors()}
            {props.type === 'properties' && getBeanProperties()}
        </div>
    );
}
