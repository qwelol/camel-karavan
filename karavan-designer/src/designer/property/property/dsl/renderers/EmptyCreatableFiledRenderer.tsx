import React from 'react';
import { PropertyMeta } from 'karavan-core/lib/model/CamelMetadata';
import { DslRenderer, DslRendererProps } from '../types';
import { PropertyUtil } from '../../PropertyUtil';

export class EmptyCreatableFiledRenderer implements DslRenderer {
    canRender(property: PropertyMeta, props: DslRendererProps): boolean {
        const { value } = props;
        const isMultiValueField = PropertyUtil.isMultiValueField(property);

        return (
            !value &&
            !isMultiValueField &&
            property.isObject &&
            !property.isArray &&
            !['ExpressionDefinition'].includes(property.type)
        );
    }

    render(): React.ReactElement {
        return <div />;
    }

    priority = 70;
}
