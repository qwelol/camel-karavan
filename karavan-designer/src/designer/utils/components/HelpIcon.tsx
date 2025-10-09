import React from 'react';
import { Popover } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';

interface PropertyHelpIconProps {
    title: string;
    description: string;
    footerContent?: React.ReactNode;
}

export const PropertyHelpIcon: React.FC<PropertyHelpIconProps> = ({ title, description, footerContent }) => (
    <Popover position={'left'} headerContent={title} bodyContent={description} footerContent={footerContent}>
        <button
            type='button'
            aria-label='More info'
            onClick={(e) => e.preventDefault()}
            className='pf-v5-c-form__group-label-help'
        >
            <HelpIcon />
        </button>
    </Popover>
);
