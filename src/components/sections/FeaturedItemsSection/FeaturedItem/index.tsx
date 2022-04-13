import * as React from 'react';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';

import { mapStylesToClassNames as mapStyles } from '../../../../utils/map-styles-to-class-names';
import Action from '../../../atoms/Action';
import ImageBlock from '../../../molecules/ImageBlock';

export default function FeaturedItem(props) {
    const cssId = props.elementId || null;
    const styles = props.styles || {};
    const itemBorderWidth = styles.self?.borderWidth ? styles.self?.borderWidth : 0;
    return (
        <article
            id={cssId}
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-item',
                props.enableHover ? 'sb-component-item-hover' : null,
                styles.self?.padding,
                styles.self?.borderColor,
                styles.self?.borderStyle ? mapStyles({ borderStyle: styles.self?.borderStyle }) : 'border-none',
                styles.self?.borderRadius ? mapStyles({ borderRadius: styles.self?.borderRadius }) : null,
                styles.self?.textAlign ? mapStyles({ textAlign: styles.self?.textAlign }) : null
            )}
            style={{
                borderWidth: itemBorderWidth ? `${itemBorderWidth}px` : undefined
            }}
            data-sb-field-path={props['data-sb-field-path']}>
            {props.featuredImage && (
                <div className="mb-6" data-sb-field-path=".featuredImage">
                    <ImageBlock {...props.featuredImage} className="inline-block" />
                </div>
            )}
            {props.title && (
                <h3 className={classNames(styles.title ? mapStyles(styles.title) : null)} data-sb-field-path=".title">
                    {props.title}
                </h3>
            )}
            {props.subtitle && (
                <p
                    className={classNames('text-lg', styles.subtitle ? mapStyles(styles.subtitle) : null, { 'mt-1': props.title })}
                    data-sb-field-path=".subtitle"
                >
                    {props.subtitle}
                </p>
            )}
            {props.text && (
                <Markdown
                    options={{ forceBlock: true, forceWrapper: true }}
                    className={classNames('sb-markdown', {
                        'mt-4': props.title || props.subtitle
                    })}
                    data-sb-field-path=".text"
                >
                    {props.text}
                </Markdown>
            )}
            <Actions actions={props.actions} styles={props.styles?.self} hasTopMargin={!!(props.title || props.subtitle || props.text)} />
        </article>
    );
}

interface ActionProps {
    actions?: any;
    styles?: Record<string, any>;
    hasTopMargin?: boolean;
}

function Actions({ actions = [], styles = {}, hasTopMargin = false }: ActionProps) {
    if (actions.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('overflow-x-hidden', {
                'mt-6': hasTopMargin
            })}
        >
            <div
                className={classNames('flex', 'flex-wrap', 'items-center', '-mx-2', {
                    'justify-center': styles.textAlign === 'center',
                    'justify-end': styles.textAlign === 'right'
                })}
                data-sb-field-path=".actions"
            >
                {actions.map((action, index) => (
                    <Action key={index} {...action} className="mb-3 mx-2 lg:whitespace-nowrap" data-sb-field-path={`.${index}`} />
                ))}
            </div>
        </div>
    );
}
