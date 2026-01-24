// components/AmountInput.tsx
import TextInputComponent from "@/components/Atoms/TextInputComponent";

interface Props {
    value: number | string;
    onChange: (e: any) => void;
    error?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const AmountInput: React.FC<Props> = ({
    value,
    onChange,
    error,
    // min,
    // max,
    disabled,
}) => {
    // const hint =
    //     min || max
    //         ? `Allowed range: ₹${min ?? 0} – ₹${max ?? "∞"}`
    //         : undefined;

    return (
        <div className="mt-2">
            <TextInputComponent
                label="Amount"
                type="number"
                value={value}
                onChange={onChange}
                error={error}
                disabled={disabled}
            />
        </div>
    );
};

export default AmountInput;
