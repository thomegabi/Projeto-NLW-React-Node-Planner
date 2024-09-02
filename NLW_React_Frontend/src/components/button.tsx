import { ComponentProps, ReactNode } from "react"; // esse tipo de função dentro do react permite dividir diversos componentes menores e que irão se repetir 
import { tv, VariantProps } from "tailwind-variants";
// basta atualizar os childrens

const buttonVariants = tv({
  base:'rounded-lg px-5 font-medium flex items-center justify-center gap-2',

  variants:{
    variant: {
      primary: 'bg-lime-300 text-lime-950 hover:bg-lime-400',
      secondary: 'bg-zinc-800 text-zinc-200  hover:bg-zinc-900',
    },

    size: {
      default: 'py-2',
      full: 'w-full h-11'
    }
  }, 

  defaultVariants:{
    variant: 'primary',
    size: 'default'
  }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants>{ // esse extends ComponentProps fornece todas as propriedades do html que um botão receberia
  children: ReactNode // esse children de tipo reactNode, permite enviar qualquer tipo de dados, e são especificor para esse tipo de operação
}

export function Button({ children, variant, size, ...props } : ButtonProps){ // aqui o ...props está recebendo todas essas possiveis propriedades e ao passalo para dentro de do html ele vai ler qualquer extensão possível de html que um botão possa receber
  return (
    <button {...props} className={buttonVariants({variant, size})}> 
      {children}
    </button>
  )
}