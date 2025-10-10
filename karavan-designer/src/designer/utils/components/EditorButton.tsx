import React from 'react';
import { Button, Tooltip, InputGroupItem } from '@patternfly/react-core';
import EditorIcon from '@patternfly/react-icons/dist/js/icons/code-icon';
import NiceModal from '@ebay/nice-modal-react';
import { ExpressionModal } from '../modals';

interface EditorButtonProps {
    propertyId: string;
    value: any;
    title: string;
    onValueChange: (propertyId: string, value: any) => void;
    dslLanguage?: [string, string, string];
}

export const EditorButton: React.FC<EditorButtonProps> = ({ propertyId, value, title, onValueChange, dslLanguage }) => {
    const handleEditorClick = async () => {
        const result = await NiceModal.show(ExpressionModal, {
            name: propertyId,
            value: value,
            title: title,
            dslLanguage: dslLanguage,
        });

        if (result && typeof result === 'object' && 'value' in result) {
            onValueChange(propertyId, (result as any).value);
        }
    };

    return (
        <InputGroupItem>
            <Tooltip position='bottom-end' content={'Show Editor'}>
                <Button variant='control' onClick={handleEditorClick}>
                    <EditorIcon />
                </Button>
            </Tooltip>
        </InputGroupItem>
    );
};
