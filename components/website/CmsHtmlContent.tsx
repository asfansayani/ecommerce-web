type Props = {
  html: string;
  className?: string;
};

export default function CmsHtmlContent({ html, className = "" }: Props) {
  return (
    <div
      className={`cms-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
