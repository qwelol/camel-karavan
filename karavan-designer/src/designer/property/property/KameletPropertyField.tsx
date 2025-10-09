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
import {
    FormGroup,
    Popover,
    Switch,
    InputGroup,
    Button,
    Tooltip,
    Text,
    TextVariants,
    InputGroupItem,
} from '@patternfly/react-core';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { Property } from 'karavan-core/lib/model/KameletModels';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import { usePropertiesHook } from '../usePropertiesHook';
import { SelectDirection, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import { PropertyPlaceholderDropdown } from './PropertyPlaceholderDropdown';
import EditorIcon from '@patternfly/react-icons/dist/js/icons/code-icon';
import {
    InfrastructureManagedSelect,
    WithInfrastructureProps,
    PasswordInfrastructureDebouncedTextInput,
} from '../../utils/components';
import NiceModal from '@ebay/nice-modal-react';
import { ExpressionModal } from '../../utils/modals';

interface Props {
    property: Property;
    value: any;
    required: boolean;
}

export function KameletPropertyField(props: Props) {
    const { onParametersChange } = usePropertiesHook();

    function getSpecialStringInput() {
        const { property, value } = props;
        const prefix = 'parameters';
        const id = prefix + '-' + property.id;
        const inInfrastructure = InfrastructureAPI.infrastructure !== 'local';
        const noInfraSelectorButton = ['uri', 'id', 'description', 'group'].includes(property.id);

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

        const infrastructureProps: WithInfrastructureProps = {
            showInfrastructureButton: showInfraSelectorButton,
            currentValue: value,
            onInfrastructureSelect: (val) => {
                onParametersChange(property.id, val);
            },
        };

        return (
            <InputGroup>
                {selectFromList && (
                    <InfrastructureManagedSelect
                        id={id}
                        name={id}
                        placeholderText='Select or type an URI'
                        variant={SelectVariant.typeahead}
                        aria-label={property.id}
                        onSelect={(_e, value, _isPlaceholder) => {
                            onParametersChange(property.id, value);
                        }}
                        selections={value}
                        isCreatable={true}
                        createText=''
                        isInputFilterPersisted={true}
                        aria-labelledby={property.id}
                        direction={SelectDirection.down}
                        {...infrastructureProps}
                    >
                        {selectOptions}
                    </InfrastructureManagedSelect>
                )}
                {(!selectFromList || property.format === 'password') && (
                    <PasswordInfrastructureDebouncedTextInput
                        className='text-field'
                        isRequired
                        isSecret={property.format === 'password'}
                        autoComplete='off'
                        id={id}
                        name={id}
                        value={value}
                        onChange={(_: React.FormEvent<HTMLInputElement>, v: string) => {
                            if (isNumeric(v)) {
                                onParametersChange(property.id, Number(v));
                            } else {
                                onParametersChange(property.id, v);
                            }
                        }}
                        customIcon={
                            property.type !== 'string' ? (
                                <Text component={TextVariants.p}>{property.type}</Text>
                            ) : undefined
                        }
                        debounceDelay={700}
                        {...infrastructureProps}
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
                                        onParametersChange(property.id, (result as any).value);
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
                            onParametersChange(property.id, v);
                        }}
                    />
                </InputGroupItem>
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
                        onChange={(_e) => onParametersChange(property.id, !value)}
                    />
                )}
            </FormGroup>
        </div>
    );
}
