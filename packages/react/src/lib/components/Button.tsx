import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn.js';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ variant = 'filled', size = 'md', className, ...rest },
	ref
) {
	return (
		<button
			ref={ref}
			className={cn('button', `button-${variant}`, `button-${size}`, className)}
			{...rest}
		/>
	);
});
