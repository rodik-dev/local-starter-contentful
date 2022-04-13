import * as React from 'react';
import classNames from 'classnames';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

export default function Badge(props) {
    const { label, className, elementId } = props;
    if (!label) {
        return null;
    }
    const fieldPath = props['data-sb-field-path'] ?? '';
    const annotations = fieldPath ? { 'data-sb-field-path': [fieldPath, `${fieldPath}.elementId#@id`].join(' ').trim() } : {};
    const styles = props.styles?.self;
    return (
        <div
            id={elementId}
            className={classNames('sb-component', 'sb-component-block', 'sb-component-badge', className, styles ? mapStyles(styles) : null)}
            {...annotations}
        >
            <span data-sb-field-path=".label">{label}</span>
        </div>
    );
}
