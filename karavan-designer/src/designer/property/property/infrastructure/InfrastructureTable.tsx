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
import { Table, Tbody, Th, Thead, Tr } from '@patternfly/react-table';
import { ConfigMapRow } from './ConfigMapRow';
import { SecretRow } from './SecretRow';
import { ServiceRow } from './ServiceRow';

type InfrastructureType = 'configMap' | 'secret' | 'services';

interface Props {
    type: InfrastructureType;
    items: string[];
    onSelect: (value: string) => void;
}

export function InfrastructureTable({ type, items, onSelect }: Props) {
    const renderHeaders = () => {
        switch (type) {
            case 'configMap':
            case 'secret':
                return (
                    <Tr>
                        <Th />
                        <Th key='name'>Name</Th>
                        <Th key='data'>Data</Th>
                    </Tr>
                );
            case 'services':
                return (
                    <Tr>
                        <Th />
                        <Th key='name'>Name</Th>
                        <Th key='host'>Host</Th>
                        <Th key='port'>Port</Th>
                    </Tr>
                );
        }
    };

    const renderRow = (item: string) => {
        switch (type) {
            case 'configMap':
                return <ConfigMapRow key={item} name={item} onSelect={onSelect} />;
            case 'secret':
                return <SecretRow key={item} name={item} onSelect={onSelect} />;
            case 'services':
                return <ServiceRow key={item} name={item} onSelect={onSelect} />;
        }
    };

    return (
        <Table variant='compact' borders={false}>
            <Thead>{renderHeaders()}</Thead>
            <Tbody>{items.map((item) => renderRow(item))}</Tbody>
        </Table>
    );
}
