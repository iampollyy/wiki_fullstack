import styles from './button.module.scss'


type TbuttonSize = "sm" | "md" | "lg";
type TbuttonVariant = "primary" | "secondary";
type  TbuttonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: TbuttonVariant;
    size?: TbuttonSize;
    className?: string;
    [key: string]: any;
}

export const Button = ({children, type = 'button', variant = 'primary', size ='md', className, ...rest}:TbuttonProps) => {
  return (
    <button type={type} className={`${styles[variant]} ${styles[size]} ${className ?? ""}`} {...rest}>
    {children}
    </button>
  )
}