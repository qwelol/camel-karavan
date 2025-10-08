import React, { useState, ComponentType, forwardRef } from 'react';
import { InputGroup, InputGroupItem } from '@patternfly/react-core';
import { PasswordToggleButton } from './PasswordToggleButton';

interface PasswordToggleProps {
    isSecret?: boolean;
}

type ComponentRef = HTMLInputElement | HTMLDivElement | HTMLElement;

export function withPasswordToggle<P extends object, T extends ComponentRef = HTMLElement>(
    WrappedComponent: ComponentType<P>,
) {
    const PasswordToggleComponent = forwardRef<T, P & PasswordToggleProps>(
        ({ isSecret = false, ...props }, forwardedRef) => {
            const [showPassword, setShowPassword] = useState<boolean>(false);

            const togglePassword = () => setShowPassword(!showPassword);

            // Если компонент не secret, просто возвращаем его без обертки
            if (!isSecret) {
                return <WrappedComponent ref={forwardedRef} {...(props as P)} />;
            }

            // Для secret компонентов оборачиваем в InputGroup с toggle кнопкой
            return (
                <InputGroup>
                    <InputGroupItem isFill>
                        <WrappedComponent
                            ref={forwardedRef}
                            {...(props as P & { type: 'password' | 'text' })}
                            type={showPassword ? 'text' : 'password'}
                        />
                    </InputGroupItem>
                    <PasswordToggleButton showPassword={showPassword} onToggle={togglePassword} />
                </InputGroup>
            );
        },
    );

    PasswordToggleComponent.displayName = `withPasswordToggle(${WrappedComponent.displayName || WrappedComponent.name})`;

    return PasswordToggleComponent;
}
