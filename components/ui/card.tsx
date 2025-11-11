import { Text, TextClassContext } from '@showcase/components/ui/text';
import { cn } from '@showcase/lib/utils';
import { View, type ViewProps, Platform } from 'react-native';

function Card({ className, ...restProps }: ViewProps & React.RefAttributes<View>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View
        className={cn(
          'bg-card border-border flex flex-col gap-6 rounded-xl border py-6 shadow-sm shadow-black/5',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function CardHeader({ className, ...restProps }: ViewProps & React.RefAttributes<View>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  return <View className={cn('flex flex-col gap-1.5 px-6', className)} {...props} />;
}

function CardTitle({
  className,
  ...restProps
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  const accessibilityProps = Platform.OS === 'web' 
    ? { 'aria-level': 3 } 
    : { accessibilityRole: 'header' as const };
    
  return (
    <Text
      {...accessibilityProps}
      className={cn('font-semibold leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...restProps
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardContent({ className, ...restProps }: ViewProps & React.RefAttributes<View>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  return <View className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...restProps }: ViewProps & React.RefAttributes<View>) {
  // Filter out web-only props on native
  const props = (Platform.OS === 'web' ? restProps : Object.fromEntries(
    Object.entries(restProps).filter(([key]) => 
      !['aria-hidden', 'aria-label', 'aria-labelledby', 'aria-level', 'role'].includes(key)
    )
  )) as typeof restProps;
  
  return <View className={cn('flex flex-row items-center px-6', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
