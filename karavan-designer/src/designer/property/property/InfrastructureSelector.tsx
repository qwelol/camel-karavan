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
import React, { useState } from 'react';
import { capitalize, Flex, FlexItem, Modal, PageSection, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import '../../karavan.css';
import { InfrastructureAPI } from '../../utils/InfrastructureAPI';
import { SearchInput, InfrastructureTable, useInfrastructureFilter } from './infrastructure';

interface Props {
    onSelect: (value: string) => void;
    onClose?: () => void;
    isOpen: boolean;
    dark: boolean;
}

export function InfrastructureSelector(props: Props) {
    const tabs = InfrastructureAPI.infrastructure === 'kubernetes' ? ['configMap', 'secret', 'services'] : ['services'];
    const [tabIndex, setTabIndex] = useState<string | number>(tabs[0]);

    const configMapsFilter = useInfrastructureFilter(InfrastructureAPI.configMaps);
    const secretsFilter = useInfrastructureFilter(InfrastructureAPI.secrets);
    const servicesFilter = useInfrastructureFilter(InfrastructureAPI.services);

    const getCurrentFilter = () => {
        switch (tabIndex) {
            case 'configMap':
                return configMapsFilter;
            case 'secret':
                return secretsFilter;
            case 'services':
                return servicesFilter;
            default:
                return servicesFilter;
        }
    };

    const currentFilter = getCurrentFilter();

    return (
        <Modal
            aria-label='Select from Infrastructure'
            width={'50%'}
            className='dsl-modal'
            isOpen={props.isOpen}
            onClose={props.onClose}
            header={
                <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                        <h3>{'Select from ' + capitalize(InfrastructureAPI.infrastructure)}</h3>
                        <SearchInput value={currentFilter.filter} onChange={currentFilter.setFilter} />
                    </FlexItem>
                    <FlexItem>
                        <Tabs
                            style={{ overflow: 'hidden' }}
                            activeKey={tabIndex}
                            onSelect={(_, eventKey) => setTabIndex(eventKey)}
                        >
                            {tabs.map((tab) => (
                                <Tab eventKey={tab} key={tab} title={<TabTitleText>{capitalize(tab)}</TabTitleText>} />
                            ))}
                        </Tabs>
                    </FlexItem>
                </Flex>
            }
            actions={{}}
        >
            <PageSection variant={props.dark ? 'darker' : 'light'}>
                <SearchInput value={currentFilter.filter} onChange={currentFilter.setFilter} />
                {tabIndex === 'configMap' && (
                    <InfrastructureTable
                        type='configMap'
                        items={configMapsFilter.filteredItems}
                        onSelect={props.onSelect}
                    />
                )}
                {tabIndex === 'secret' && (
                    <InfrastructureTable type='secret' items={secretsFilter.filteredItems} onSelect={props.onSelect} />
                )}
                {tabIndex === 'services' && (
                    <InfrastructureTable
                        type='services'
                        items={servicesFilter.filteredItems}
                        onSelect={props.onSelect}
                    />
                )}
            </PageSection>
        </Modal>
    );
}
