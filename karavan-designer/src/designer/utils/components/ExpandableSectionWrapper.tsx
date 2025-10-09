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
import { ExpandableSection, ExpandableSectionProps } from '@patternfly/react-core';

interface ExpandableSectionWrapperProps extends Omit<ExpandableSectionProps, 'isExpanded' | 'onToggle' | 'ref'> {
    strictExpanded?: boolean;
}

export const ExpandableSectionWrapper: React.FC<ExpandableSectionWrapperProps> = ({
    strictExpanded = false,
    children,
    ...restProps
}) => {
    const [userExpanded, setUserExpanded] = useState<boolean>(false);

    const handleToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
        if (!strictExpanded) {
            setUserExpanded(isExpanded);
        }
    };

    const isExpanded = strictExpanded || userExpanded;

    return (
        <ExpandableSection {...restProps} isExpanded={isExpanded} onToggle={handleToggle}>
            {children}
        </ExpandableSection>
    );
};
