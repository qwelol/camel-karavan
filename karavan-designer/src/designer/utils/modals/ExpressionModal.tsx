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
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ExpressionModalEditor } from '../../../expression/ExpressionModalEditor';
import { useDesignerStore } from '../../DesignerStore';
import { shallow } from 'zustand/shallow';

interface ExpressionModalProps {
    name: string;
    value: any;
    title: string;
    dslLanguage?: [string, string, string];
}

export const ExpressionModal = NiceModal.create<ExpressionModalProps>(({ name, value, title, dslLanguage }) => {
    const modal = useModal();
    const [dark] = useDesignerStore((s) => [s.dark], shallow);

    const handleSave = (fieldId: string, value: string) => {
        modal.resolve({ fieldId, value });
        modal.hide();
    };

    const handleClose = () => {
        modal.hide();
    };

    return (
        <ExpressionModalEditor
            name={name}
            customCode={value}
            showEditor={modal.visible}
            dark={dark}
            dslLanguage={dslLanguage}
            title={title}
            onClose={handleClose}
            onSave={handleSave}
        />
    );
});
