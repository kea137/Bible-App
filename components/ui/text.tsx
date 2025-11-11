import { cn } from '@showcase/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'border-border border-b pb-2 text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = Platform.select({
  web: {
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    blockquote: 'blockquote' as Role,
    code: 'code' as Role,
  },
  default: {},
}) as Partial<Record<TextVariant, Role>>;

const ACCESSIBILITY_ROLE: Partial<Record<TextVariant, 'header'>> = Platform.select({
  web: {},
  default: {
    h1: 'header',
    h2: 'header',
    h3: 'header',
    h4: 'header',
  },
}) as Partial<Record<TextVariant, 'header'>>;

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = Platform.select({
  web: {
    h1: '1',
    h2: '2',
    h3: '3',
    h4: '4',
  },
  default: {},
}) as Partial<Record<TextVariant, string>>;

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...restProps
}: React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText> & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  const role = variant ? ROLE[variant] : undefined;
  const accessibilityRole = variant ? ACCESSIBILITY_ROLE[variant] : undefined;
  const ariaLevel = variant ? ARIA_LEVEL[variant] : undefined;
  
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      {...props}
      {...(role && { role })}
      {...(accessibilityRole && { accessibilityRole })}
      {...(ariaLevel && { 'aria-level': ariaLevel })}
    />
  );
}

export { Text, TextClassContext };
