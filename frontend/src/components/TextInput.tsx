import clsx from 'clsx';

type InputProps = {
  name: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

const TextInput: React.FC<InputProps> = ({
  name,
  label,
  onChange,
  value,
  error,
  className,
  disabled,
  placeholder,
}) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="text-sm text-gray-700 pb-1 block">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="text"
        className={clsx(
          `rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`,
          error ? 'border-red-500' : '',
          className
        )}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
