import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'dark:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-200 bg-slate-900 text-slate-300 hover:bg-slate-800',
                ghost: 'bg-transparent dark:text-slate-200 dark:hover:text-slate-300 dark:hover:bg-slate-800 text-slate-800 hover:text-slate-700 hover:bg-slate-200',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg: 'h-11 px-8',
                huge: 'h-56 w-96 px-10'
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean
}
 
const Button: FC<ButtonProps> = ({
    className,
    children,
    variant,
    isLoading,
    size,
    ...props
}) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className='text-slate-200 mr-2 h-4 w-4 animate-spin'/> : null}
        {children}
    </button>;
}
 
export { Button };