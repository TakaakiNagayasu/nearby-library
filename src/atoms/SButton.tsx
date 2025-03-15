/**
 * `SButton` コンポーネントのプロパティ定義
 */
type Props = {
  /** ボタンのクリックイベント */
  handle: React.MouseEventHandler<HTMLButtonElement>;
  /** ボタンのレベル（見た目を決定） */
  level: "info" | "warning" | "danger";
  /** ボタンに表示するテキスト */
  buttonText: string;
};

/**
 * カスタムボタンコンポーネント
 *
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされるボタン要素
 */
export const SButton: React.FC<Props> = ({
  handle,
  level,
  buttonText,
}: Props): JSX.Element => {
  const levelClasses = {
    info: "bg-sub",
    warning: "bg-warning",
    danger: "bg-error",
  };

  return (
    <button
      className={`my-2 h-8 px-1 text-text ${levelClasses[level]}`}
      type="button"
      onClick={handle}
    >
      {buttonText}
    </button>
  );
};

export default SButton;
