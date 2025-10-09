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
import React, { useId } from 'react';
import {
    FormGroup,
    Switch,
    InputGroup,
    Tooltip,
    Button,
    InputGroupItem,
    TextInputGroup,
    TextVariants,
    Text,
} from '@patternfly/react-core';
import { SelectVariant, SelectDirection, SelectOption } from '@patternfly/react-core/deprecated';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import { PropertyHelpIcon, PropertyHelpFooter, PropertyLabel } from '../../utils/components';
import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { CamelUi, RouteToCreate } from '../../utils/CamelUi';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { ToDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { usePropertiesHook } from '../usePropertiesHook';
import { useDesignerStore, useIntegrationStore } from '../../DesignerStore';
import { shallow } from 'zustand/shallow';
import EditorIcon from '@patternfly/react-icons/dist/js/icons/code-icon';
import { PropertyPlaceholderDropdown } from './PropertyPlaceholderDropdown';
import { INTERNAL_COMPONENTS } from 'karavan-core/lib/api/ComponentApi';
import { PropertyUtil } from './PropertyUtil';
import { DebouncedTextInput, ManagedSelect, PasswordInfrastructureDebouncedTextInput } from '../../utils/components';
import NiceModal from '@ebay/nice-modal-react';
import { ExpressionModal } from '../../utils/modals';

const beanPrefix = '#bean:';

interface Props {
    property: ComponentProperty;
    element?: CamelElement;
    value: any;
    onParameterChange?: (
        parameter: string,
        value: string | number | boolean | any,
        pathParameter?: boolean,
        newRoute?: RouteToCreate,
    ) => void;
}

export function ComponentPropertyField(props: Props) {
    const { onParametersChange, getInternalComponentName } = usePropertiesHook();

    const [integration, files] = useIntegrationStore((state) => [state.integration, state.files], shallow);
    const [beans] = useDesignerStore((s) => [s.beans], shallow);

    const id = useId();

    function getSelectBean(property: ComponentProperty, value: any) {
        const selectOptions: React.JSX.Element[] = [];
        if (beans) {
            selectOptions.push(<SelectOption key={0} value={'Select...'} isPlaceholder />);
            selectOptions.push(
                ...beans.map((bean) => (
                    <SelectOption key={bean.name} value={beanPrefix + bean.name} description={bean.type} />
                )),
            );
        }
        return (
            <ManagedSelect
                id={id}
                name={props.property.name}
                variant={SelectVariant.typeahead}
                aria-label={property.name}
                onSelect={(_e, value, isPlaceholder) =>
                    onParametersChange(property.name, !isPlaceholder ? value : undefined)
                }
                selections={value}
                isCreatable={true}
                createText=''
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        );
    }

    function canBeInternalUri(property: ComponentProperty): boolean {
        if (
            props.element &&
            props.element.dslName === 'ToDefinition' &&
            (property.name === 'name' || property.name === 'address')
        ) {
            const uri: string = (props.element as ToDefinition).uri || '';
            const parts = uri.split(':');
            return parts.length > 0 && INTERNAL_COMPONENTS.includes(parts[0]);
        } else {
            return false;
        }
    }

    function checkUri(startsWith: string): boolean {
        if (
            props.element &&
            props.element.dslName === 'ToDefinition' &&
            (property.name === 'name' || property.name === 'address')
        ) {
            const uri: string = (props.element as ToDefinition).uri || '';
            return uri.startsWith(startsWith);
        } else {
            return false;
        }
    }

    function getInternalUriSelect(property: ComponentProperty, value: any) {
        const selectOptions: JSX.Element[] = [];
        const componentName = getInternalComponentName(property.name, props.element);
        const internalUris = CamelUi.getInternalRouteUris(integration, componentName, false);
        let uris: string[] = CamelUi.getInternalUris(files, checkUri('direct'), checkUri('seda'), checkUri('vertx'));
        uris.push(...internalUris);
        uris = [...new Set(uris.map((e) => (e.includes(':') ? e.split(':')?.at(1) || '' : e)))];
        if (value && value.length > 0 && !uris.includes(value)) {
            uris.unshift(value);
        }
        if (uris && uris.length > 0) {
            selectOptions.push(
                ...uris.map((value: string) => <SelectOption key={value} value={value ? value.trim() : value} />),
            );
        }
        return (
            <InputGroup>
                <InputGroupItem isFill>
                    <ManagedSelect
                        id={id}
                        name={props.property.name}
                        placeholderText='Select or type an URI'
                        variant={SelectVariant.typeahead}
                        aria-label={property.name}
                        onSelect={(e, value, isPlaceholder) => {
                            onParametersChange(
                                property.name,
                                !isPlaceholder ? value : undefined,
                                property.kind === 'path',
                                undefined,
                            );
                        }}
                        selections={value}
                        isCreatable={true}
                        createText=''
                        isInputFilterPersisted={true}
                        aria-labelledby={property.name}
                        direction={SelectDirection.down}
                    >
                        {selectOptions}
                    </ManagedSelect>
                </InputGroupItem>
                <InputGroupItem>
                    <Tooltip position='bottom-end' content={'Create route'}>
                        <Button
                            isDisabled={value === undefined}
                            variant='control'
                            onClick={(_e) => {
                                if (value) {
                                    const newRoute = !internalUris.includes(value.toString())
                                        ? CamelUi.createNewInternalRoute(componentName.concat(...':', value.toString()))
                                        : undefined;
                                    onParametersChange(property.name, value, property.kind === 'path', newRoute);
                                }
                            }}
                        >
                            {<PlusIcon />}
                        </Button>
                    </Tooltip>
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getStringInput(property: ComponentProperty) {
        const inInfrastructure = InfrastructureAPI.infrastructure !== 'local';
        const noInfraSelectorButton = ['uri', 'id', 'description', 'group'].includes(property.name);
        const showInfraSelectorButton = inInfrastructure && !noInfraSelectorButton;

        return (
            <InputGroup>
                <PasswordInfrastructureDebouncedTextInput
                    className='text-field'
                    isRequired
                    isSecret={property.secret}
                    autoComplete='off'
                    id={id}
                    name={props.property.name}
                    value={value !== undefined ? value : property.defaultValue}
                    onChange={(_, v) => {
                        onParametersChange(property.name, v, property.kind === 'path');
                    }}
                    debounceDelay={700}
                    showInfrastructureButton={showInfraSelectorButton}
                    currentValue={value}
                    onInfrastructureSelect={(val: string) => {
                        onParametersChange(property.name, val);
                    }}
                />

                <InputGroupItem>
                    <Tooltip position='bottom-end' content={'Show Editor'}>
                        <Button
                            variant='control'
                            onClick={async () => {
                                const result = await NiceModal.show(ExpressionModal, {
                                    name: property.name,
                                    value: value,
                                    title: property.displayName,
                                });
                                if (result && typeof result === 'object' && 'value' in result) {
                                    onParametersChange(property.name, (result as any).value, property.kind === 'path');
                                }
                            }}
                        >
                            <EditorIcon />
                        </Button>
                    </Tooltip>
                </InputGroupItem>
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onComponentPropertyChange={(parameter, v) => {
                            onParametersChange(parameter, v);
                        }}
                    />
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getSpecialStringInput(property: ComponentProperty) {
        return (
            <InputGroup>
                <InputGroupItem isFill>
                    <DebouncedTextInput
                        className='text-field'
                        isRequired
                        type={property.secret ? 'password' : 'text'}
                        autoComplete='off'
                        id={id}
                        name={props.property.name}
                        value={value !== undefined ? value : property.defaultValue}
                        onChange={(_, v) => {
                            onParametersChange(property.name, v, property.kind === 'path');
                        }}
                        customIcon={<Text component={TextVariants.p}>{property.type}</Text>}
                        debounceDelay={700}
                    />
                </InputGroupItem>
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onComponentPropertyChange={(_, v) => {
                            onParametersChange(property.name, v);
                        }}
                    />
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getSelect(property: ComponentProperty, value: any) {
        const selectOptions: JSX.Element[] = [];
        if (property.enum && property.enum.length > 0) {
            selectOptions.push(<SelectOption key={0} value={'Select ...'} isPlaceholder />);
            property.enum.forEach((v) => selectOptions.push(<SelectOption key={v} value={v} />));
        }
        return (
            <ManagedSelect
                id={id}
                name={props.property.name}
                variant={SelectVariant.single}
                aria-label={property.name}
                onSelect={(e, value, isPlaceholder) =>
                    onParametersChange(property.name, !isPlaceholder ? value : undefined, property.kind === 'path')
                }
                selections={value !== undefined ? value.toString() : property.defaultValue}
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        );
    }

    function getSwitch(property: ComponentProperty, value: any) {
        const isValueBoolean = value?.toString() === 'true' || value?.toString() === 'false';
        const isDisabled = value?.toString().includes('{') || value?.toString().includes('}');
        const isChecked =
            value !== undefined
                ? Boolean(value)
                : property.defaultValue !== undefined && ['true', true].includes(property.defaultValue);
        return (
            <TextInputGroup className='input-group'>
                <InputGroupItem>
                    <Switch
                        id={id}
                        name={props.property.name}
                        isDisabled={isDisabled}
                        className='switch-placeholder'
                        aria-label={property.name}
                        isChecked={isChecked}
                        value={value?.toString()}
                        onChange={(_, v) => {
                            onParametersChange(property.name, v);
                        }}
                    />
                </InputGroupItem>
                <InputGroupItem isFill>
                    <DebouncedTextInput
                        id={property.name + '-placeholder'}
                        name={property.name + '-placeholder'}
                        type='text'
                        aria-label='placeholder'
                        value={!isValueBoolean ? value?.toString() : undefined}
                        onChange={(_, v) => {
                            onParametersChange(property.name, v);
                        }}
                        debounceDelay={700}
                    />
                </InputGroupItem>
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onDslPropertyChange={(_, v) => {
                            onParametersChange(property.name, v);
                        }}
                    />
                </InputGroupItem>
            </TextInputGroup>
        );
    }

    const property: ComponentProperty = props.property;
    const value = props.value;
    return (
        <FormGroup
            key={id}
            label={
                <PropertyLabel
                    text={property.displayName}
                    hasValueChanged={PropertyUtil.hasComponentPropertyValueChanged(property, value)}
                />
            }
            isRequired={property.required}
            labelIcon={
                <PropertyHelpIcon
                    title={property.displayName}
                    description={property.description}
                    footerContent={
                        <PropertyHelpFooter
                            default={property.defaultValue}
                            footer={property.required ? `${property.displayName} is required` : undefined}
                        />
                    }
                />
            }
        >
            {canBeInternalUri(property) && getInternalUriSelect(property, value)}
            {property.type === 'string' &&
                property.enum === undefined &&
                !canBeInternalUri(property) &&
                getStringInput(property)}
            {['duration', 'integer', 'int', 'number'].includes(property.type) &&
                property.enum === undefined &&
                !canBeInternalUri(property) &&
                getSpecialStringInput(property)}
            {['object'].includes(property.type) && !property.enum && getSelectBean(property, value)}
            {['string', 'object', 'integer'].includes(property.type) && property.enum && getSelect(property, value)}
            {property.type === 'boolean' && getSwitch(property, value)}
        </FormGroup>
    );
}
