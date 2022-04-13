import * as React from 'react';
import classNames from 'classnames';
import { iconMap } from '../../svgs';
import Link from '../Link';

export default function Action(props) {
    const { label, altText, url, showIcon, icon = 'arrowLeft', iconPosition = 'right', className, elementId } = props;
    const IconComponent = iconMap[icon];
    const fieldPath = props['data-sb-field-path'] ?? '';
    const annotations = fieldPath
        ? {
              'data-sb-field-path': [
                  fieldPath,
                  `${fieldPath}.url#@href`,
                  `${fieldPath}.altText#@aria-label`,
                  `${fieldPath}.elementId#@id`,
                  `${fieldPath}.label#span[1]`,
                  `${fieldPath}.icon#svg[1]`
              ]
                  .join(' ')
                  .trim()
          }
        : {};
    const defaultStyle = props.__metadata.modelName === 'Link' ? 'link' : 'secondary';
    const style = 'style' in props ? props?.style ?? defaultStyle : defaultStyle;

    return (
        <Link
            href={url}
            aria-label={altText}
            id={elementId}
            className={classNames('sb-component', 'sb-component-block', style === 'link' ? 'sb-component-link' : 'sb-component-button', className, {
                'sb-component-button-primary': style === 'primary',
                'sb-component-button-secondary': style === 'secondary'
            })}
            {...annotations}
        >
            {label && <span>{label}</span>}
            {showIcon && IconComponent && (
                <IconComponent
                    className={classNames('fill-current h-5 w-5', {
                        'order-first': iconPosition === 'left',
                        'mr-1.5': label && iconPosition === 'left',
                        'ml-1.5': label && iconPosition === 'right'
                    })}
                />
            )}
        </Link>
    );
}
