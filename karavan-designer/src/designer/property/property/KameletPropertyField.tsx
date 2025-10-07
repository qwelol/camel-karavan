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
import React, { useRef, useState } from 'react';
import {
    FormGroup,
    Popover,
    Switch,
    InputGroup,
    Button,
    Tooltip,
    capitalize,
    Text,
    TextVariants,
    InputGroupItem,
} from '@patternfly/react-core';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { Property } from 'karavan-core/lib/model/KameletModels';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import ShowIcon from '@patternfly/react-icons/dist/js/icons/eye-icon';
import HideIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon';
import DockerIcon from '@patternfly/react-icons/dist/js/icons/docker-icon';
import { usePropertiesHook } from '../usePropertiesHook';
import { Select, SelectDirection, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import { KubernetesIcon } from '../../icons/ComponentIcons';
import { PropertyPlaceholderDropdown } from './PropertyPlaceholderDropdown';
import EditorIcon from '@patternfly/react-icons/dist/js/icons/code-icon';
import { DebouncedTextInput } from '../../utils/components';
import NiceModal from '@ebay/nice-modal-react';
import { InfrastructureModal, ExpressionModal } from '../../utils/modals';

interface Props {
    property: Property;
    value: any;
    required: boolean;
}

export function KameletPropertyField(props: Props) {
    const { onParametersChange } = usePropertiesHook();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [selectStatus, setSelectStatus] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const ref = useRef<any>(null);

    function parametersChanged(parameter: string, value: string | number | boolean | any, pathParameter?: boolean) {
        onParametersChange(parameter, value, pathParameter);
        setSelectStatus(new Map<string, boolean>([[parameter, false]]));
    }

    function openSelect(propertyName: string, isExpanded: boolean) {
        setSelectStatus(new Map<string, boolean>([[propertyName, isExpanded]]));
    }

    function isSelectOpen(propertyName: string): boolean {
        return selectStatus.has(propertyName) && selectStatus.get(propertyName) === true;
    }

    function selectInfrastructure(propertyId: string, value: string) {
        // check if there is a selection
        const textVal = ref.current;
        if (textVal != null) {
            const cursorStart = textVal.selectionStart;
            const cursorEnd = textVal.selectionEnd;
            if (cursorStart !== cursorEnd) {
                const prevValue = props.value;
                const selectedText = prevValue.substring(cursorStart, cursorEnd);
                value = prevValue.replace(selectedText, value);
            }
        }
        if (value.startsWith('config') || value.startsWith('secret')) value = '{{' + value + '}}';
        parametersChanged(propertyId, value);
    }

    function getSpecialStringInput() {
        const { property, value } = props;
        const prefix = 'parameters';
        const id = prefix + '-' + property.id;
        const inInfrastructure = InfrastructureAPI.infrastructure !== 'local';
        const noInfraSelectorButton = ['uri', 'id', 'description', 'group'].includes(property.id);
        const icon =
            InfrastructureAPI.infrastructure === 'kubernetes' ? KubernetesIcon('infra-button') : <DockerIcon />;
        const showInfraSelectorButton = inInfrastructure && !noInfraSelectorButton;
        const showEditorButton = property.type === 'string' && property.format !== 'password';
        const selectFromList: boolean = property.enum !== undefined && property?.enum?.length > 0;
        const selectOptions: JSX.Element[] = [];
        if (selectFromList && property.enum) {
            selectOptions.push(
                ...property.enum.map((value: string) => (
                    <SelectOption key={value} value={value ? value.trim() : value} />
                )),
            );
        }
        return (
            <InputGroup>
                {showInfraSelectorButton && (
                    <Tooltip
                        position='bottom-end'
                        content={'Select from ' + capitalize(InfrastructureAPI.infrastructure)}
                    >
                        <Button
                            variant='control'
                            onClick={async () => {
                                const value = await NiceModal.show(InfrastructureModal, {});
                                if (typeof value === 'string') {
                                    selectInfrastructure(property.id, value);
                                }
                            }}
                        >
                            {icon}
                        </Button>
                    </Tooltip>
                )}
                {selectFromList && (
                    <Select
                        id={id}
                        name={id}
                        placeholderText='Select or type an URI'
                        variant={SelectVariant.typeahead}
                        aria-label={property.id}
                        onToggle={(_event, isExpanded) => {
                            openSelect(property.id, isExpanded);
                        }}
                        onSelect={(_e, value, _isPlaceholder) => {
                            parametersChanged(property.id, value);
                        }}
                        selections={value}
                        isOpen={isSelectOpen(property.id)}
                        isCreatable={true}
                        createText=''
                        isInputFilterPersisted={true}
                        aria-labelledby={property.id}
                        direction={SelectDirection.down}
                    >
                        {selectOptions}
                    </Select>
                )}
                {(!selectFromList || property.format === 'password') && (
                    <DebouncedTextInput
                        ref={ref}
                        className='text-field'
                        isRequired
                        type={property.format && !showPassword ? 'password' : 'text'}
                        autoComplete='off'
                        id={id}
                        name={id}
                        value={value}
                        onChange={(_: React.FormEvent<HTMLInputElement>, v: string) => {
                            if (isNumeric(v)) {
                                parametersChanged(property.id, Number(v));
                            } else {
                                parametersChanged(property.id, v);
                            }
                        }}
                        customIcon={
                            property.type !== 'string' ? (
                                <Text component={TextVariants.p}>{property.type}</Text>
                            ) : undefined
                        }
                        debounceDelay={700}
                    />
                )}
                {showEditorButton && (
                    <InputGroupItem>
                        <Tooltip position='bottom-end' content={'Show Editor'}>
                            <Button
                                variant='control'
                                onClick={async () => {
                                    const result = await NiceModal.show(ExpressionModal, {
                                        name: property.id,
                                        value: value,
                                        title: property.title,
                                    });
                                    if (result && typeof result === 'object' && 'value' in result) {
                                        parametersChanged(property.id, (result as any).value);
                                    }
                                }}
                            >
                                <EditorIcon />
                            </Button>
                        </Tooltip>
                    </InputGroupItem>
                )}
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onDslPropertyChange={(_, v, _newRoute) => {
                            parametersChanged(property.id, v);
                        }}
                    />
                </InputGroupItem>
                {property.format === 'password' && (
                    <Tooltip position='bottom-end' content={showPassword ? 'Hide' : 'Show'}>
                        <Button variant='control' onClick={(_e) => setShowPassword(!showPassword)}>
                            {showPassword ? <ShowIcon /> : <HideIcon />}
                        </Button>
                    </Tooltip>
                )}
            </InputGroup>
        );
    }

    function isNumeric(num: any) {
        return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num as number);
    }

    function hasValueChanged(property: Property, value: any): boolean {
        const isSet = value !== undefined;
        const isDefault = property.default !== undefined && value?.toString() === property.default?.toString();
        return isSet && !isDefault;
    }

    function getLabel(property: Property, value: any) {
        const labelClassName = hasValueChanged(property, value) ? 'value-changed' : 'transparent';
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '3px',
                }}
            >
                <Text className={labelClassName}>{property.title}</Text>
            </div>
        );
    }

    const property = props.property;
    const value = props.value;
    const prefix = 'parameters';
    const id = prefix + '-' + property.id;
    return (
        <div>
            <FormGroup
                key={id}
                label={getLabel(property, value)}
                fieldId={id}
                isRequired={props.required}
                labelIcon={
                    <Popover
                        position={'left'}
                        headerContent={property.title}
                        bodyContent={property.description}
                        footerContent={
                            <div>
                                {property.default !== undefined && <div>Default: {property.default.toString()}</div>}
                                {property.example !== undefined && <div>Example: {property.example}</div>}
                            </div>
                        }
                    >
                        <button
                            type='button'
                            aria-label='More info'
                            onClick={(e) => e.preventDefault()}
                            className='pf-v5-c-form__group-label-help'
                        >
                            <HelpIcon />
                        </button>
                    </Popover>
                }
            >
                {['string', 'integer', 'int', 'number'].includes(property.type) && getSpecialStringInput()}
                {property.type === 'boolean' && (
                    <Switch
                        id={id}
                        name={id}
                        value={value?.toString()}
                        aria-label={id}
                        isChecked={Boolean(value) === true}
                        onChange={(_e) => parametersChanged(property.id, !value)}
                    />
                )}
            </FormGroup>
        </div>
    );
}
