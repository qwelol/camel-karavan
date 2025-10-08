import React from 'react';
import { Button, Tooltip, InputGroupItem } from '@patternfly/react-core';
import ShowIcon from '@patternfly/react-icons/dist/js/icons/eye-icon';
import HideIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon';

interface PasswordToggleButtonProps {
    showPassword: boolean;
    onToggle: () => void;
}

export const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({ showPassword, onToggle }) => {
    return (
        <InputGroupItem>
            <Tooltip position='bottom-end' content={showPassword ? 'Hide' : 'Show'}>
                <Button variant='control' onClick={onToggle}>
                    {showPassword ? <ShowIcon /> : <HideIcon />}
                </Button>
            </Tooltip>
        </InputGroupItem>
    );
};
