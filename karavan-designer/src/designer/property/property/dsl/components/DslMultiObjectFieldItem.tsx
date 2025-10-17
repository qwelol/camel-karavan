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
import { Button } from '@patternfly/react-core';
import TrashIcon from '@patternfly/react-icons/dist/esm/icons/trash-icon';
import { ObjectField } from '../../ObjectField';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';

interface DslMultiObjectFieldItemProps {
    property: PropertyMeta;
    value: any;
    itemValue: any;
    index: number;
    hideLabel?: boolean;
    onPropertyChange?: (fieldId: string, value: any) => void;
}

export const DslMultiObjectFieldItem: React.FC<DslMultiObjectFieldItemProps> = ({
    property,
    value,
    itemValue,
    index,
    hideLabel = false,
    onPropertyChange,
}) => {
    const onMultiValueObjectUpdate = (index: number, fieldId: string, newValue: CamelElement) => {
        const mValue = [...(value || [])];
        mValue[index] = newValue;
        onPropertyChange?.(fieldId, mValue);
    };

    return (
        <>
            <div className='object'>
                {itemValue && (
                    <ObjectField
                        property={property}
                        value={itemValue}
                        hideLabel={hideLabel}
                        onPropertyUpdate={(f, v) => onMultiValueObjectUpdate(index, f, v)}
                    />
                )}
            </div>
            <Button
                variant='link'
                className='delete-button'
                onClick={(_e) => {
                    const v = Array.from(value || []);
                    v.splice(index, 1);
                    onPropertyChange?.(property.name, v);
                }}
            >
                <TrashIcon />
            </Button>
        </>
    );
};
