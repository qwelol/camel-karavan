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
import React, { useState, useCallback } from 'react';
import '../../karavan.css';
import '@patternfly/patternfly/patternfly.css';
import { CamelMetadataApi } from 'karavan-core/lib/model/CamelMetadata';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { DataFormatDefinition } from 'karavan-core/lib/model/CamelDefinition';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';
import { CamelDefinitionApi } from 'karavan-core/lib/api/CamelDefinitionApi';
import { DataFormatSelector } from './DataFormatSelector';
import { DataFormatPropertiesPanel } from './DataFormatPropertiesPanel';

interface Props {
    dslName: string;
    value: CamelElement;
    onDataFormatChange?: (value: DataFormatDefinition) => void;
}

export function DataFormatField({ dslName, value, onDataFormatChange }: Props) {
    const [currentDataFormat, setCurrentDataFormat] = useState(
        () => CamelDefinitionApiExt.getDataFormat(value)?.name || 'json',
    );

    const handleDataFormatChange = useCallback(
        (dataFormat: string) => {
            setCurrentDataFormat(dataFormat);

            const className = CamelMetadataApi.getCamelDataFormatMetadataByName(dataFormat)?.className;
            const newDataFormatValue = CamelDefinitionApi.createDataFormat(className || '', {});

            const df = CamelDefinitionApi.createStep(dslName, {});
            (df as any)[dataFormat] = newDataFormatValue;
            (df as any)['uuid'] = value.uuid;
            (df as any)['id'] = (value as any)['id'];

            onDataFormatChange?.(df);
        },
        [dslName, value, onDataFormatChange],
    );

    const handlePropertyChange = useCallback(
        (fieldId: string, propertyValue: string | number | boolean | any) => {
            const dataFormatValue = getDataFormatValue();
            if (dataFormatValue) {
                (dataFormatValue as any)[fieldId] = propertyValue;
                handleDataFormatChange(currentDataFormat);
            }
        },
        [currentDataFormat, handleDataFormatChange],
    );

    function getDataFormatValue(): CamelElement {
        return (value as any)[currentDataFormat]
            ? (value as any)[currentDataFormat]
            : CamelDefinitionApi.createDataFormat(currentDataFormat, (value as any)[currentDataFormat]);
    }

    return (
        <div>
            <DataFormatSelector value={currentDataFormat} onDataFormatChange={handleDataFormatChange} />
            <DataFormatPropertiesPanel
                dataFormat={currentDataFormat}
                value={value}
                onPropertyChange={handlePropertyChange}
            />
        </div>
    );
}
