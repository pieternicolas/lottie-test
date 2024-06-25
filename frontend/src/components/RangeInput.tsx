import clsx from 'clsx';

type RangeInputProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
  label?: string;
};

const RangeInput = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  className,
  label,
}: RangeInputProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-bold">{label}</label>}

        <p className="text-sm">{value}</p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          className={clsx('w-full flex-1', className)}
        />
        <span className="text-sm">{max}</span>
      </div>
    </div>
  );
};

export default RangeInput;
