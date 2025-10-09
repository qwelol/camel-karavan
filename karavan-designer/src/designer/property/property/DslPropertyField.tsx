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
import {
    FormGroup,
    Switch,
    TextInputGroup,
    Button,
    Text,
    Tooltip,
    Card,
    InputGroup,
    SelectOptionProps,
    InputGroupItem,
    TextVariants,
    ToggleGroup,
    ToggleGroupItem,
} from '@patternfly/react-core';
import {
    DebouncedTextInput,
    DebouncedTextArea,
    ManagedSelect,
    InfrastructureDebouncedTextInput,
    ExpandableSectionWrapper,
    MultiValueField,
} from '../../utils/components';
import { SelectVariant, SelectDirection, SelectOption } from '@patternfly/react-core/deprecated';
import '../../karavan.css';
import './DslPropertyField.css';
import '@patternfly/patternfly/patternfly.css';
import { PropertyHelpIcon, PropertyHelpFooter, PropertyLabel, EditorButton } from '../../utils/components';
import DeleteIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import { CamelUtil } from 'karavan-core/lib/api/CamelUtil';
import { CamelMetadataApi, PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { ExpressionField } from './ExpressionField';
import { CamelUi, RouteToCreate } from '../../utils/CamelUi';
import { ComponentPropertyField } from './ComponentPropertyField';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { KameletPropertyField } from './KameletPropertyField';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { ObjectField } from './ObjectField';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';
import AddIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { MediaTypes } from '../../utils/MediaTypes';
import { ComponentProperty } from 'karavan-core/lib/model/ComponentModels';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import { useDesignerStore, useIntegrationStore } from '../../DesignerStore';
import { shallow } from 'zustand/shallow';
import {
    DataFormatDefinition,
    ExpressionDefinition,
    BeanFactoryDefinition,
} from 'karavan-core/lib/model/CamelDefinition';
import { BeanProperties } from './BeanProperties';
import { PropertyPlaceholderDropdown } from './PropertyPlaceholderDropdown';
import { VariablesDropdown } from './VariablesDropdown';
import { ROUTE, GLOBAL } from 'karavan-core/lib/api/VariableUtil';
import { SpiBeanApi } from 'karavan-core/lib/api/SpiBeanApi';
import { SelectField } from './SelectField';
import { PropertyUtil } from './PropertyUtil';
import { usePropertiesStore } from '../PropertyStore';
import { Property } from 'karavan-core/lib/model/KameletModels';
import { isNumeric } from '../../utils/commonUtils';

const beanPrefix = '#bean:';
const classPrefix = '#class:';

interface Props {
    property: PropertyMeta;
    element?: CamelElement;
    value: any;
    onPropertyChange?: (fieldId: string, value: string | number | boolean | any, newRoute?: RouteToCreate) => void;
    onExpressionChange?: (propertyName: string, exp: ExpressionDefinition) => void;
    onDataFormatChange?: (value: DataFormatDefinition) => void;
    onParameterChange?: (
        parameter: string,
        value: string | number | boolean | any,
        pathParameter?: boolean,
        newRoute?: RouteToCreate,
    ) => void;
    hideLabel?: boolean;
    dslLanguage?: [string, string, string];
}

export function DslPropertyField(props: Props) {
    const [integration, setIntegration, addVariable, files] = useIntegrationStore(
        (s) => [s.integration, s.setIntegration, s.addVariable, s.files],
        shallow,
    );
    const [setSelectedStep, beans] = useDesignerStore((s) => [s.setSelectedStep, s.beans], shallow);
    const [propertyFilter, changedOnly, requiredOnly] = usePropertiesStore(
        (s) => [s.propertyFilter, s.changedOnly, s.requiredOnly],
        shallow,
    );

    function propertyChanged(fieldId: string, value: string | number | boolean | any, newRoute?: RouteToCreate) {
        props.onPropertyChange?.(fieldId, value, newRoute);
        if (isVariable) {
            addVariable(value);
        }
    }

    function isParameter(property: PropertyMeta): boolean {
        return property.name === 'parameters' && property.description === 'parameters';
    }

    function getLabel(property: PropertyMeta, value: any, isKamelet: boolean) {
        const labelClassName = PropertyUtil.hasDslPropertyValueChanged(property, value) ? 'value-changed' : '';
        if (
            !isMultiValueField(property) &&
            property.isObject &&
            !property.isArray &&
            !['ExpressionDefinition'].includes(property.type)
        ) {
            const tooltip = value ? 'Delete ' + property.name : 'Add ' + property.name;
            const className = value ? 'change-button delete-button' : 'change-button add-button';
            const x = value ? undefined : CamelDefinitionApi.createStep(property.type, {});
            const meta = CamelMetadataApi.getCamelModelMetadataByClassName(property.type);
            const title = meta?.title || property.displayName;
            const icon = value ? <DeleteIcon /> : <AddIcon />;
            return (
                <div style={{ display: 'flex' }}>
                    <Text className={labelClassName}>{title}</Text>
                    <Tooltip position={'top'} content={<div>{tooltip}</div>}>
                        <button
                            className={className}
                            onClick={(_e) => props.onPropertyChange?.(property.name, x)}
                            aria-label='Add element'
                        >
                            {icon}
                        </button>
                    </Tooltip>
                </div>
            );
        }
        if (isParameter(property)) {
            return isKamelet ? 'Kamelet properties:' : 'Component properties:';
        } else if (!['ExpressionDefinition'].includes(property.type)) {
            return (
                <PropertyLabel
                    text={CamelUtil.capitalizeName(property.displayName)}
                    hasValueChanged={PropertyUtil.hasDslPropertyValueChanged(property, value)}
                />
            );
        }
    }

    function isUriReadOnly(property: PropertyMeta): boolean {
        const dslName: string = props.element?.dslName || '';
        return (
            property.name === 'uri' &&
            ![
                'ToDynamicDefinition',
                'WireTapDefinition',
                'InterceptFromDefinition',
                'InterceptSendToEndpointDefinition',
            ].includes(dslName)
        );
    }

    function getVariableInput(property: PropertyMeta) {
        const variableValue = value?.toString().replace(GLOBAL, '').replace(ROUTE, '') || '';
        return (
            <InputGroup>
                <InputGroupItem>
                    <ToggleGroup aria-label='Variable type'>
                        <ToggleGroupItem
                            text='global:'
                            key='global'
                            buttonId={'global-variable-' + property.name}
                            isSelected={variableType === GLOBAL}
                            onChange={(_, selected) => {
                                if (selected) {
                                    propertyChanged(property.name, GLOBAL.concat(variableValue));
                                } else {
                                    propertyChanged(property.name, variableValue);
                                }
                            }}
                        />
                        <ToggleGroupItem
                            text='route:'
                            key='route'
                            buttonId={'route-variable' + property.name}
                            className='route-variable'
                            isSelected={variableType === ROUTE}
                            onChange={(_, selected) => {
                                if (selected) {
                                    propertyChanged(property.name, ROUTE.concat(variableValue));
                                } else {
                                    propertyChanged(property.name, variableValue);
                                }
                            }}
                        />
                    </ToggleGroup>
                </InputGroupItem>
                <InputGroupItem isFill>
                    <DebouncedTextInput
                        className='text-field route-variable'
                        isRequired
                        type='text'
                        id={property.name}
                        name={property.name}
                        value={variableValue}
                        customIcon={
                            property.type !== 'string' ? (
                                <Text component={TextVariants.p}>{property.type}</Text>
                            ) : undefined
                        }
                        onChange={(_, v) => {
                            propertyChanged(property.name, variableType.concat(v));
                        }}
                    />
                </InputGroupItem>
                <InputGroupItem>
                    <VariablesDropdown
                        onVariableChange={(name) => {
                            propertyChanged(property.name, name);
                        }}
                    />
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getSpecialStringInput(property: PropertyMeta) {
        return (
            <InputGroup>
                <InputGroupItem isFill>
                    <DebouncedTextInput
                        className='text-field'
                        isRequired
                        type={property.secret ? 'password' : 'text'}
                        autoComplete='off'
                        id={property.name}
                        name={property.name}
                        value={value}
                        customIcon={
                            property.type !== 'string' ? (
                                <Text component={TextVariants.p}>{property.type}</Text>
                            ) : undefined
                        }
                        onChange={(_, v) => {
                            if (isNumeric(v)) {
                                propertyChanged(property.name, Number(v));
                            } else {
                                propertyChanged(property.name, v);
                            }
                        }}
                    />
                </InputGroupItem>
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onDslPropertyChange={(_, v, _newRoute) => {
                            propertyChanged(property.name, v);
                        }}
                    />
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getStringInput(property: PropertyMeta) {
        const inInfrastructure = InfrastructureAPI.infrastructure !== 'local';
        const noInfraSelectorButton = ['uri', 'id', 'description', 'group'].includes(property.name);
        const showInfraSelectorButton = inInfrastructure && !noInfraSelectorButton;

        const isNumber = ['integer', 'number', 'duration'].includes(property.type);
        const uriReadOnly = isUriReadOnly(property);
        const showEditorButton =
            !uriReadOnly && !isNumber && !property.secret && !['id', 'description'].includes(property.name);
        return (
            <InputGroup>
                <InfrastructureDebouncedTextInput
                    className='text-field'
                    isRequired
                    type={property.secret ? 'password' : 'text'}
                    autoComplete='off'
                    id={property.name}
                    name={property.name}
                    value={value}
                    customIcon={
                        property.type !== 'string' ? <Text component={TextVariants.p}>{property.type}</Text> : undefined
                    }
                    onChange={(_, v) => {
                        if (isNumber && isNumeric(v)) {
                            propertyChanged(property.name, Number(v));
                        } else if (!isNumber) {
                            propertyChanged(property.name, v);
                        }
                    }}
                    readOnlyVariant={uriReadOnly ? 'default' : undefined}
                    showInfrastructureButton={showInfraSelectorButton}
                    currentValue={value}
                    onInfrastructureSelect={(val) => {
                        propertyChanged(property.name, val);
                    }}
                />
                {showEditorButton && (
                    <EditorButton
                        propertyId={property.name}
                        value={value}
                        title={property.displayName}
                        onValueChange={propertyChanged}
                    />
                )}
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onDslPropertyChange={(_, v, _newRoute) => {
                            propertyChanged(property.name, v);
                        }}
                    />
                </InputGroupItem>
            </InputGroup>
        );
    }

    function getJavaTypeGeneratedInput(property: PropertyMeta, value: any) {
        const selectOptions: SelectOptionProps[] = [];
        if (beans) {
            selectOptions.push(
                ...beans.map((bean) => {
                    return { value: beanPrefix + bean.name, children: bean.name };
                }),
            );
            selectOptions.push(
                ...SpiBeanApi.findByInterfaceTypeSimple(property.javaType).map((bean) => {
                    return {
                        value: classPrefix + bean.javaType,
                        children: bean.name,
                        description: bean.description,
                    };
                }),
            );
        }
        return (
            <SelectField
                id={property.name}
                name={property.name}
                placeholder='Select bean'
                selectOptions={selectOptions}
                value={value?.toString()}
                onChange={(name, value) => propertyChanged(property.name, value)}
            />
        );
    }

    function getTextArea(property: PropertyMeta, value: any) {
        const { dslLanguage } = props;
        return (
            <InputGroup>
                <InputGroupItem isFill>
                    <DebouncedTextArea
                        className='text-field'
                        isRequired
                        type={'text'}
                        id={property.name}
                        name={property.name}
                        height={'100px'}
                        value={value}
                        onChange={(_, v) => {
                            propertyChanged(property.name, v);
                        }}
                    />
                </InputGroupItem>
                <EditorButton
                    propertyId={property.name}
                    value={value}
                    title={`Expression (${dslLanguage?.[0]})`}
                    onValueChange={propertyChanged}
                    dslLanguage={dslLanguage}
                />
            </InputGroup>
        );
    }

    function getExpressionField(property: PropertyMeta, value: any) {
        return (
            <div className='expression'>
                <ExpressionField property={property} value={value} onExpressionChange={props.onExpressionChange} />
            </div>
        );
    }

    function getObjectField(property: PropertyMeta, value: any) {
        return (
            <div className='object'>
                {value && <ObjectField property={property} value={value} onPropertyUpdate={propertyChanged} />}
            </div>
        );
    }

    function getBooleanInput(property: PropertyMeta, value: any) {
        const isValueBoolean = value?.toString() === 'true' || value?.toString() === 'false';
        const isDisabled = value?.toString().includes('{') || value?.toString().includes('}');
        let isChecked = false;
        if (value !== undefined && isValueBoolean) {
            isChecked = Boolean(value);
        } else if ((value === undefined || value.toString().length > 0) && property.defaultValue !== undefined) {
            isChecked = property.defaultValue === 'true';
        }
        return (
            <TextInputGroup className='input-group'>
                <InputGroupItem>
                    <Switch
                        isDisabled={isDisabled}
                        id={property.name + '-switch'}
                        name={property.name + '-switch'}
                        className='switch-placeholder'
                        value={value?.toString()}
                        aria-label={property.name}
                        isChecked={isChecked}
                        onChange={(_, v) => {
                            propertyChanged(property.name, v);
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
                            propertyChanged(property.name, v);
                        }}
                    />
                </InputGroupItem>
                <InputGroupItem>
                    <PropertyPlaceholderDropdown
                        property={property}
                        value={value}
                        onDslPropertyChange={(_, v, newRoute) => {
                            propertyChanged(property.name, v, newRoute);
                        }}
                    />
                </InputGroupItem>
            </TextInputGroup>
        );
    }

    function getSelectBean(property: PropertyMeta, value: any) {
        const selectOptions: JSX.Element[] = [];
        const beans = CamelUi.getBeans(integration);
        if (beans) {
            selectOptions.push(<SelectOption key={0} value={'Select...'} isPlaceholder />);
            selectOptions.push(
                ...beans.map((bean) => <SelectOption key={bean.name} value={bean.name} description={bean.type} />),
            );
        }
        return (
            <ManagedSelect
                variant={SelectVariant.single}
                aria-label={property.name}
                onSelect={(_e, value, isPlaceholder) =>
                    propertyChanged(property.name, !isPlaceholder ? value : undefined)
                }
                selections={value}
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        );
    }

    function getSelect(property: PropertyMeta, value: any) {
        const selectOptions: JSX.Element[] = [];
        if (property.enumVals && property.enumVals.length > 0) {
            selectOptions.push(<SelectOption key={0} value={'Select ' + property.name} isPlaceholder />);
            selectOptions.push(
                ...property.enumVals
                    .split(',')
                    .map((value: string) => <SelectOption key={value} value={value.trim()} />),
            );
        }
        return (
            <ManagedSelect
                variant={SelectVariant.single}
                aria-label={property.name}
                onSelect={(_e, value, isPlaceholder) =>
                    propertyChanged(property.name, !isPlaceholder ? value : undefined)
                }
                selections={value}
                id={property.name}
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {selectOptions}
            </ManagedSelect>
        );
    }

    function getMediaTypeSelectOptions(filter?: string): JSX.Element[] {
        const options: JSX.Element[] = [<SelectOption key={0} value='Select Media Type' isPlaceholder />];
        const mediaTypes: JSX.Element[] = filter
            ? MediaTypes.filter((mt) => mt.includes(filter)).map((value: string) => (
                  <SelectOption key={value} value={value.trim()} />
              ))
            : MediaTypes.map((value: string) => <SelectOption key={value} value={value.trim()} />);
        options.push(...mediaTypes);
        return options;
    }

    function getMediaTypeSelect(property: PropertyMeta, value: any) {
        return (
            <ManagedSelect
                placeholderText='Select Media Type'
                variant={SelectVariant.typeahead}
                aria-label={property.name}
                onSelect={(_e, value, isPlaceholder) =>
                    propertyChanged(property.name, !isPlaceholder ? value : undefined)
                }
                selections={value}
                isCreatable={false}
                isInputFilterPersisted={false}
                onFilter={(e, text) => getMediaTypeSelectOptions(text)}
                aria-labelledby={property.name}
                direction={SelectDirection.down}
            >
                {getMediaTypeSelectOptions()}
            </ManagedSelect>
        );
    }

    function canBeInternalUri(property: PropertyMeta, element?: CamelElement): boolean {
        if (element?.dslName === 'WireTapDefinition' && property.name === 'uri') {
            return true;
        } else if (element?.dslName === 'SagaDefinition' && ['compensation', 'completion'].includes(property.name)) {
            return true;
        } else if (
            element &&
            [
                'GetDefinition',
                'PostDefinition',
                'PutDefinition',
                'PatchDefinition',
                'DeleteDefinition',
                'HeadDefinition',
            ].includes(element?.dslName) &&
            property.name === 'to'
        ) {
            return true;
        } else {
            return false;
        }
    }

    function canBeMediaType(property: PropertyMeta, element?: CamelElement): boolean {
        if (
            element &&
            [
                'RestDefinition',
                'GetDefinition',
                'PostDefinition',
                'PutDefinition',
                'PatchDefinition',
                'DeleteDefinition',
                'HeadDefinition',
            ].includes(element.dslName) &&
            ['consumes', 'produces'].includes(property.name)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function javaTypeGenerated(property: PropertyMeta): boolean {
        return property.javaType.length !== 0;
    }

    function getInternalUriSelect(property: PropertyMeta, value: any) {
        const selectOptions: JSX.Element[] = [];
        const uris: string[] = CamelUi.getInternalUris(files, true, true, true);
        if (uris && uris.length > 0) {
            selectOptions.push(...uris.map((value: string) => <SelectOption key={value} value={value.trim()} />));
        }
        return (
            <InputGroup id={property.name} name={property.name}>
                <InputGroupItem isFill>
                    <ManagedSelect
                        placeholderText='Select or type an URI'
                        variant={SelectVariant.typeahead}
                        aria-label={property.name}
                        onClear={(_event) => propertyChanged(property.name, undefined, undefined)}
                        onSelect={(_e, value, isPlaceholder) => {
                            propertyChanged(property.name, !isPlaceholder ? value : undefined, undefined);
                        }}
                        selections={value}
                        isCreatable={true}
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
                                    const newRoute = CamelUi.createNewInternalRoute(value);
                                    propertyChanged(property.name, value, newRoute);
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

    function onMultiValueObjectUpdate(index: number, fieldId: string, value: CamelElement) {
        const mValue = [...props.value];
        mValue[index] = value;
        props.onPropertyChange?.(fieldId, mValue);
    }

    function isKeyValueObject(property: PropertyMeta) {
        const props = CamelDefinitionApiExt.getElementProperties(property.type);
        return (
            props.length === 2 &&
            props.filter((p) => p.name === 'key').length === 1 &&
            props.filter((p) => p.name === 'value').length === 1
        );
    }

    function getMultiObjectFieldProps(
        property: PropertyMeta,
        value: any,
        v: any,
        index: number,
        hideLabel: boolean = false,
    ) {
        return (
            <>
                <div className='object'>
                    {v && (
                        <ObjectField
                            property={property}
                            value={v}
                            hideLabel={hideLabel}
                            onPropertyUpdate={(f, v) => onMultiValueObjectUpdate(index, f, v)}
                        />
                    )}
                </div>
                <Button
                    variant='link'
                    className='delete-button'
                    onClick={(_e) => {
                        const v = Array.from(value);
                        v.splice(index, 1);
                        propertyChanged(property.name, v);
                    }}
                >
                    <DeleteIcon />
                </Button>
            </>
        );
    }

    function getMultiValueObjectField(property: PropertyMeta, value: any) {
        const isKeyValue = isKeyValueObject(property);
        return (
            <div>
                {value &&
                    Array.from(value).map((v: any, index: number) => {
                        if (isKeyValue)
                            return (
                                <div key={property + '-' + index} className='object-key-value'>
                                    {getMultiObjectFieldProps(property, value, v, index, index > 0)}
                                </div>
                            );
                        else
                            return (
                                <Card key={property + '-' + index} className='object-value'>
                                    {getMultiObjectFieldProps(property, value, v, index)}
                                </Card>
                            );
                    })}
                <Button
                    variant='link'
                    className='add-button'
                    onClick={(_e) => {
                        const valArray = value !== null ? [...value] : [];
                        valArray.push(CamelDefinitionApi.createStep(property.type, {}));
                        propertyChanged(property.name, valArray);
                    }}
                >
                    <AddIcon />
                    {'Add ' + property.displayName}
                </Button>
            </div>
        );
    }

    function getMultiValueField(property: PropertyMeta, value: any) {
        return (
            <MultiValueField value={value || []} onChange={(newValue) => propertyChanged(property.name, newValue)} />
        );
    }

    function getKameletPropertyValue(property: Property) {
        const element = props.element;
        return CamelDefinitionApiExt.getParametersValue(element, property.id);
    }

    function getFilteredKameletProperties(): Property[] {
        const element = props.element;
        const requiredParameters = CamelUtil.getKameletRequiredParameters(element);
        let properties = CamelUtil.getKameletProperties(element);
        const filter = propertyFilter.toLocaleLowerCase();
        properties = properties.filter(
            (p) => p.title?.toLocaleLowerCase().includes(filter) || p.id?.toLocaleLowerCase().includes(filter),
        );
        if (requiredOnly) {
            properties = properties.filter((p) => requiredParameters.includes(p.id));
        }
        if (changedOnly) {
            properties = properties.filter((p) =>
                PropertyUtil.hasKameletPropertyValueChanged(p, getKameletPropertyValue(p)),
            );
        }
        return properties;
    }

    function getKameletParameters() {
        const element = props.element;
        const requiredParameters = CamelUtil.getKameletRequiredParameters(element);
        return (
            <div className='parameters'>
                {getFilteredKameletProperties().map((property) => (
                    <KameletPropertyField
                        key={property.id}
                        property={property}
                        value={getKameletPropertyValue(property)}
                        required={requiredParameters?.includes(property.id)}
                    />
                ))}
            </div>
        );
    }

    function getComponentPropertyValue(kp: ComponentProperty) {
        const element = props.element;
        return CamelDefinitionApiExt.getParametersValue(element, kp.name, kp.kind === 'path');
    }

    function getMainComponentParameters(properties: ComponentProperty[]) {
        return (
            <div className='parameters'>
                {properties.map((kp) => {
                    return (
                        <ComponentPropertyField
                            key={kp.name}
                            property={kp}
                            value={getComponentPropertyValue(kp)}
                            element={props.element}
                            onParameterChange={props.onParameterChange}
                        />
                    );
                })}
            </div>
        );
    }

    function getExpandableComponentProperties(properties: ComponentProperty[], label: string) {
        return (
            <ExpandableSectionWrapper toggleText={label} strictExpanded={getPropertySelectorChanged()}>
                <div className='parameters'>
                    {properties.map((kp) => (
                        <ComponentPropertyField
                            key={kp.name}
                            property={kp}
                            value={getComponentPropertyValue(kp)}
                            onParameterChange={props.onParameterChange}
                        />
                    ))}
                </div>
            </ExpandableSectionWrapper>
        );
    }

    function getLabelIcon(property: PropertyMeta) {
        return property.description ? (
            <PropertyHelpIcon
                title={property.displayName}
                description={property.description}
                footerContent={
                    <PropertyHelpFooter
                        default={
                            property.defaultValue !== undefined && property.defaultValue.toString().trim().length > 0
                                ? property.defaultValue
                                : undefined
                        }
                        footer={property.required ? 'Required' : undefined}
                    />
                }
            />
        ) : (
            <div></div>
        );
    }

    function changeBean(bean: BeanFactoryDefinition) {
        const clone = CamelUtil.cloneIntegration(integration);
        const i = CamelDefinitionApiExt.addBeanToIntegration(clone, bean);
        setIntegration(i, false);
        setSelectedStep(bean);
    }

    function getBeanProperties(type: 'constructors' | 'properties') {
        return <BeanProperties type={type} onChange={changeBean} onClone={changeBean} />;
    }

    function isMultiValueField(property: PropertyMeta): boolean {
        return (
            ['string'].includes(property.type) &&
            property.name !== 'expression' &&
            property.isArray &&
            !property.enumVals
        );
    }

    function getFilteredComponentProperties(): ComponentProperty[] {
        let componentProperties = CamelUtil.getComponentProperties(element);
        const filter = propertyFilter.toLocaleLowerCase();
        componentProperties = componentProperties.filter(
            (p) =>
                p.name?.toLocaleLowerCase().includes(filter) ||
                p.label.toLocaleLowerCase().includes(filter) ||
                p.displayName.toLocaleLowerCase().includes(filter),
        );
        if (requiredOnly) {
            componentProperties = componentProperties.filter((p) => p.required);
        }
        if (changedOnly) {
            componentProperties = componentProperties.filter((p) =>
                PropertyUtil.hasComponentPropertyValueChanged(p, getComponentPropertyValue(p)),
            );
        }
        return componentProperties;
    }

    function getPropertySelectorChanged(): boolean {
        return requiredOnly || changedOnly || propertyFilter?.trim().length > 0;
    }

    function getComponentParameters(property: PropertyMeta) {
        const element = props.element;
        const properties = getFilteredComponentProperties();
        const propertiesMain = properties.filter(
            (p) => !p.label.includes('advanced') && !p.label.includes('security') && !p.label.includes('scheduler'),
        );
        const propertiesAdvanced = properties.filter((p) => p.label.includes('advanced'));
        const propertiesScheduler = properties.filter((p) => p.label.includes('scheduler'));
        const propertiesSecurity = properties.filter((p) => p.label.includes('security'));
        return (
            <>
                {property.name === 'parameters' && getMainComponentParameters(propertiesMain)}
                {property.name === 'parameters' &&
                    element &&
                    propertiesScheduler.length > 0 &&
                    getExpandableComponentProperties(propertiesScheduler, 'Component scheduler properties')}
                {property.name === 'parameters' &&
                    element &&
                    propertiesSecurity.length > 0 &&
                    getExpandableComponentProperties(propertiesSecurity, 'Component security properties')}
                {property.name === 'parameters' &&
                    element &&
                    propertiesAdvanced.length > 0 &&
                    getExpandableComponentProperties(propertiesAdvanced, 'Component advanced properties')}
            </>
        );
    }

    function getIsVariable() {
        if (['variableSend', 'variableReceive'].includes(property.name)) {
            return true;
        } else if (property.name === 'name' && element?.dslName === 'SetVariableDefinition') {
            return true;
        } else if (property.name === 'name' && element?.dslName === 'RemoveVariableDefinition') {
            return true;
        } else if (['name', 'toName'].includes(property.name) && element?.dslName === 'ConvertVariableDefinition') {
            return true;
        }
        return false;
    }

    const element = props.element;
    const isKamelet = CamelUtil.isKameletComponent(element);
    const property: PropertyMeta = props.property;
    const value = props.value;
    const isVariable = getIsVariable();

    const variableType = useMemo((): 'global:' | 'route:' | '' => {
        if (isVariable && value) {
            if (value.toString().startsWith(GLOBAL)) {
                return GLOBAL;
            } else if (value.toString().startsWith(ROUTE)) {
                return ROUTE;
            }
        }
        return '';
    }, [isVariable, value]);
    const beanConstructors = element?.dslName === 'BeanFactoryDefinition' && property.name === 'constructors';
    const beanProperties = element?.dslName === 'BeanFactoryDefinition' && property.name === 'properties';

    return (
        <div>
            <FormGroup
                className='dsl-property-form-group'
                label={props.hideLabel ? undefined : getLabel(property, value, isKamelet)}
                isRequired={property.required}
                labelIcon={isParameter(property) ? undefined : getLabelIcon(property)}
            >
                {value !== undefined &&
                    ['ExpressionDefinition', 'ExpressionSubElementDefinition'].includes(property.type) &&
                    getExpressionField(property, value)}
                {property.isObject &&
                    !property.isArray &&
                    !['ExpressionDefinition', 'ExpressionSubElementDefinition'].includes(property.type) &&
                    getObjectField(property, value)}
                {property.isObject &&
                    property.isArray &&
                    !isMultiValueField(property) &&
                    getMultiValueObjectField(property, value)}
                {property.name === 'expression' &&
                    property.type === 'string' &&
                    !property.isArray &&
                    getTextArea(property, value)}
                {canBeInternalUri(property, element) && getInternalUriSelect(property, value)}
                {canBeMediaType(property, element) && getMediaTypeSelect(property, value)}
                {javaTypeGenerated(property) && getJavaTypeGeneratedInput(property, value)}
                {['duration', 'integer', 'number'].includes(property.type) &&
                    !isVariable &&
                    property.name !== 'expression' &&
                    !property.name.endsWith('Ref') &&
                    !property.isArray &&
                    !property.enumVals &&
                    !canBeInternalUri(property, element) &&
                    !canBeMediaType(property, element) &&
                    !javaTypeGenerated(property) &&
                    getSpecialStringInput(property)}
                {['string'].includes(property.type) &&
                    !isVariable &&
                    property.name !== 'expression' &&
                    !property.name.endsWith('Ref') &&
                    !property.isArray &&
                    !property.enumVals &&
                    !canBeInternalUri(property, element) &&
                    !canBeMediaType(property, element) &&
                    !javaTypeGenerated(property) &&
                    getStringInput(property)}
                {isVariable && getVariableInput(property)}
                {['string'].includes(property.type) &&
                    property.name.endsWith('Ref') &&
                    !property.isArray &&
                    !property.enumVals &&
                    getSelectBean(property, value)}
                {isMultiValueField(property) && getMultiValueField(property, value)}
                {property.type === 'boolean' && getBooleanInput(property, value)}
                {property.enumVals && getSelect(property, value)}
                {isKamelet && property.name === 'parameters' && getKameletParameters()}
                {!isKamelet && property.name === 'parameters' && getComponentParameters(property)}
                {beanConstructors && getBeanProperties('constructors')}
                {beanProperties && getBeanProperties('properties')}
            </FormGroup>
        </div>
    );
}
