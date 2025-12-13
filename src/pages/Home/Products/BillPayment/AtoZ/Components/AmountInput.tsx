import TextInputComponent from "@/components/Atoms/TextInputComponent";

interface Props {
    value: any;
    error?: string;
    onChange: (val: any) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const AmountInput: React.FC<Props> = ({
    value,
    error,
    onChange,
    min,
    max,
    disabled,
}) => (
    <div className="relative">
        <TextInputComponent
            label="Amount"
            value={value}
            onChange={onChange}
            error={error}
            withAsterisk
            type="number"
            disabled={disabled}
            min={min}
            max={max}
        />

        {(min || max) && (
            <p className="text-xs text-gray-600 mt-1">
                {`Min: ₹${min || 0} | Max: ₹${max || 0}`}
            </p>
        )}
    </div>
);

export default AmountInput;
