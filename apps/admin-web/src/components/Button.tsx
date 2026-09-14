type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled,
  block = true,
}: {
  label: string;
  onClick: () => void;
  variant?: Variant;
  disabled?: boolean;
  block?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${block ? 'btn-block' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
