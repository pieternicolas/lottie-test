import clsx from 'clsx';
import { HTMLProps } from 'react';

type CardProps = HTMLProps<HTMLDivElement>;

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx('bg-white rounded-lg p-4 shadow-lg', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
