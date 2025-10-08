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
import React, { useCallback, useRef, ComponentType, forwardRef } from 'react';
import { Button, capitalize, Tooltip } from '@patternfly/react-core';
import NiceModal from '@ebay/nice-modal-react';
import { InfrastructureModal } from '../modals';
import { InfrastructureAPI } from '../InfrastructureAPI';
import { KubernetesIcon } from '../../icons/ComponentIcons';
import DockerIcon from '@patternfly/react-icons/dist/js/icons/docker-icon';

export interface WithInfrastructureProps {
    showInfrastructureButton?: boolean;
    currentValue?: string;
    onInfrastructureSelect?: (value: string) => void;
}

// Типы для ref'ов различных компонентов
type TextInputRef = HTMLInputElement;
type SelectRef = HTMLDivElement;

// Объединяем возможные типы ref'ов
type ComponentRef = TextInputRef | SelectRef | HTMLElement;

/**
 * HOC для добавления Infrastructure функциональности к любому компоненту поля ввода
 * Поддерживает forwardRef и типизированные ref'ы
 */
export function withInfrastructure<P extends object, T extends ComponentRef = HTMLElement>(
    WrappedComponent: ComponentType<P>,
) {
    const InfrastructureComponent = forwardRef<T, P & WithInfrastructureProps>(
        ({ showInfrastructureButton = false, currentValue = '', onInfrastructureSelect, ...props }, forwardedRef) => {
            const internalRef = useRef<T>(null);

            const selectInfrastructure = useCallback(async () => {
                const infrastructureValue = await NiceModal.show(InfrastructureModal, {});
                if (typeof infrastructureValue === 'string') {
                    // check if there is a selection
                    const textVal = internalRef.current;
                    if (textVal != null && 'selectionStart' in textVal && 'selectionEnd' in textVal) {
                        const cursorStart = textVal.selectionStart;
                        const cursorEnd = textVal.selectionEnd;
                        if (cursorStart !== null && cursorEnd !== null && cursorStart !== cursorEnd) {
                            const selectedText = currentValue.substring(cursorStart, cursorEnd);
                            const newValue = currentValue.replace(selectedText, infrastructureValue);
                            onInfrastructureSelect?.(newValue);
                            return;
                        }
                    }

                    // Если нет выделения, добавляем значение в конец или заменяем полностью
                    let finalValue = infrastructureValue;
                    if (finalValue.startsWith('config') || finalValue.startsWith('secret')) {
                        finalValue = '{{' + finalValue + '}}';
                    }
                    onInfrastructureSelect?.(finalValue);
                }
            }, [currentValue, onInfrastructureSelect]);

            const icon =
                InfrastructureAPI.infrastructure === 'kubernetes' ? KubernetesIcon('infra-button') : <DockerIcon />;

            // Функция для объединения внутреннего и внешнего ref'ов
            const setRefs = useCallback(
                (node: T | null) => {
                    // Устанавливаем внутренний ref для нашей логики
                    (internalRef as React.MutableRefObject<T | null>).current = node;

                    // Передаем ref дальше, если он был передан снаружи
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(node);
                    } else if (forwardedRef && 'current' in forwardedRef) {
                        // Используем type assertion для избежания ошибки readonly`
                        (forwardedRef as React.MutableRefObject<T | null>).current = node;
                    }
                },
                [forwardedRef],
            );

            if (!showInfrastructureButton) {
                // Если кнопка не нужна, просто возвращаем оригинальный компонент
                return <WrappedComponent ref={setRefs} {...(props as P)} />;
            }

            return (
                <>
                    <Tooltip
                        position='bottom-end'
                        content={'Select from ' + capitalize(InfrastructureAPI.infrastructure)}
                    >
                        <Button variant='control' onClick={selectInfrastructure}>
                            {icon}
                        </Button>
                    </Tooltip>
                    <WrappedComponent ref={setRefs} {...(props as P)} />
                </>
            );
        },
    );

    InfrastructureComponent.displayName = `withInfrastructure(${WrappedComponent.displayName || WrappedComponent.name})`;

    return InfrastructureComponent;
}
